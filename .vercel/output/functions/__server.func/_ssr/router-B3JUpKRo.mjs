import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { R as require_react, _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B3JUpKRo.js
var router_B3JUpKRo_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-DNEjE1Oo.css";
var APP_NAME = "Pack Watch";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0c0b0a"
			},
			{
				name: "description",
				content: "Live DDLTCG coach that watches the board, learns controls, and never auto-plays."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$1 = () => import("./routes-on63J66i.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./desk--Egrg078.mjs");
var Route$1 = createFileRoute("/desk")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var PACK_WATCH_ZIP_B64 = "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";
function zipBytes() {
	const bin = Buffer.from(PACK_WATCH_ZIP_B64, "base64");
	return new Uint8Array(bin);
}
var Route = createFileRoute("/api/pack-watch-ext.zip")({ server: { handlers: { GET: async () => {
	return new Response(zipBytes(), { headers: {
		"Content-Type": "application/zip",
		"Content-Disposition": "attachment; filename=\"pack-watch-ext.zip\"",
		"Cache-Control": "no-store"
	} });
} } } });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	DeskRoute: Route$1.update({
		id: "/desk",
		path: "/desk",
		getParentRoute: () => Route$3
	}),
	ApiPackWatchExtDotzipRoute: Route.update({
		id: "/api/pack-watch-ext.zip",
		path: "/api/pack-watch-ext.zip",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter, router_B3JUpKRo_exports as t };
