/**
 * Deployed-app (Nitro) half of the platform PWA chrome. Auto-registered as
 * global h3 middleware because vite.config.ts sets `serverDir: "./server"` —
 * without that option Nitro v3 never scans this directory.
 *
 * - `?install=1&platform=ios` on a document path → the Home Screen tutorial,
 *   bundled into the server build via `?raw` (the public/ directory is CDN
 *   static output on Vercel and not readable from the function).
 * - `/__grok/manifest.webmanifest` → per-app-named manifest (kept out of
 *   public/ so this dynamic response is the only one).
 * - Other HTML documents → stream-inject PWA + OG head tags at `</head>`.
 *   OG identity is baked via `virtual:grok-og-identity` at `vite build`
 *   (this function cannot read `src/lib/og/site.json` or `public/og.jpg`).
 *   This must be a middleware transforming `next()`: h3 discards the `response`
 *   runtime hook's return value, and `render:html` does not exist in Nitro v3.
 */
import installPageTemplate from "../../scripts/install-page.html?raw";
import { grokOgIdentity } from "virtual:grok-og-identity";
import {
  enforceRateLimit,
  rateLimitHeaders,
  RateLimitError,
  type RateLimitBucket,
} from "../../src/lib/rate-limit.server";
import {
  acceptsHtml,
  createHeadInjector,
  isDocumentPath,
  isInstallQuery,
  renderInstallPageHtml,
  renderWebManifest,
} from "../../scripts/grok-pwa-shared.mjs";

interface GrokPwaEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function requestHost(event: GrokPwaEvent): string {
  return (
    event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host") ?? event.url.host
  );
}

function injectHeadStreaming(response: Response, host: string): Response {
  const injector = createHeadInjector({
    host,
    site: grokOgIdentity.site,
  });
  const transformed = response.body!.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        for (const out of injector.push(chunk)) controller.enqueue(out);
      },
      flush(controller) {
        for (const out of injector.flush()) controller.enqueue(out);
      },
    }),
  );
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(transformed, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function rateLimitBucket(path: string): { bucket: RateLimitBucket; failClosed: boolean } | null {
  if (path === "/api/pack-watch-ext.zip") {
    return { bucket: "public-read", failClosed: false };
  }
  if (path === "/api/auth" || path.startsWith("/api/auth/")) return { bucket: "auth", failClosed: true };
  return null;
}

export default async function grokPwaMiddleware(
  event: GrokPwaEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = (event.req.method ?? "GET").toUpperCase();
  const path = event.url.pathname;
  const rateLimit = rateLimitBucket(path);
  let headers: Headers | undefined;
  if (rateLimit) {
    try {
      const decision = await enforceRateLimit({
        bucket: rateLimit.bucket,
        failClosed: rateLimit.failClosed,
        request: new Request(event.url, { method, headers: event.req.headers }),
      });
      headers = rateLimitHeaders(decision);
    } catch (error) {
      if (error instanceof RateLimitError) {
        const responseHeaders = rateLimitHeaders(error.decision);
        responseHeaders.set("Content-Type", "application/json; charset=utf-8");
        return Response.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: responseHeaders });
      }
      console.error("[packwatch] rate limiter unavailable", error);
      return Response.json({ error: "Request protection is temporarily unavailable." }, { status: 503 });
    }
  }
  if (method !== "GET") {
    const result = await next();
    if (result instanceof Response && headers) {
      const responseHeaders = new Headers(result.headers);
      headers.forEach((value, key) => responseHeaders.set(key, value));
      return new Response(result.body, { status: result.status, statusText: result.statusText, headers: responseHeaders });
    }
    return result;
  }

  const urlWithQuery = path + event.url.search;

  if (path === "/__grok/manifest.webmanifest" || path === "/__grok/manifest.json") {
    return withSecurityHeaders(new Response(renderWebManifest(requestHost(event)), {
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
        "cache-control": "no-cache",
        ...(headers ? Object.fromEntries(headers.entries()) : {}),
      },
    }));
  }

  if (
    isInstallQuery(urlWithQuery) &&
    isDocumentPath(path) &&
    acceptsHtml(event.req.headers.get("accept"))
  ) {
    const html = renderInstallPageHtml(installPageTemplate, {
      host: requestHost(event),
      url: urlWithQuery,
    });
    return withSecurityHeaders(new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache",
        ...(headers ? Object.fromEntries(headers.entries()) : {}),
      },
    }));
  }

  if (!isDocumentPath(path)) {
    const result = await next();
    if (result instanceof Response && headers) {
      const responseHeaders = new Headers(result.headers);
      headers.forEach((value, key) => responseHeaders.set(key, value));
      return new Response(result.body, { status: result.status, statusText: result.statusText, headers: responseHeaders });
    }
    return result;
  }

  const result = await next();
  if (
    result instanceof Response &&
    result.body &&
    String(result.headers.get("content-type") ?? "").includes("text/html") &&
    !result.headers.get("content-encoding")
  ) {
    return withSecurityHeaders(injectHeadStreaming(result, requestHost(event)));
  }
  if (result instanceof Response && headers) {
    const responseHeaders = new Headers(result.headers);
    headers.forEach((value, key) => responseHeaders.set(key, value));
    return withSecurityHeaders(new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers: responseHeaders,
    }));
  }
  return result instanceof Response ? withSecurityHeaders(result) : result;
}
