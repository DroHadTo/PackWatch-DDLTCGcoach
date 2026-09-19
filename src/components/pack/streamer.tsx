import { KICK_CHANNELS, KICK_TITLE_TERMS } from "@/lib/packwatch-config";
import { useState } from "react";

function kickEmbed(channel: string) {
  return `https://player.kick.com/${encodeURIComponent(channel)}`;
}

export function StreamerPage() {
  const [channel, setChannel] = useState<string>(KICK_CHANNELS[0]);
  const [title, setTitle] = useState("");
  const matching = KICK_TITLE_TERMS.some((term) => title.toLowerCase().includes(term));

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs tracking-wide text-muted">/ streamer / kick watch</p>
      <h2 className="font-display text-3xl tracking-tight">Follow the DDL stream.</h2>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Watch configured Kick channels in Packwatch. The coach only learns from structured board events supplied by the
        local read-only bridge; it never claims to see or interpret unverified video pixels.
      </p>
      <div className="flex flex-wrap gap-2">
        {KICK_CHANNELS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setChannel(name)}
            className={`min-h-11 rounded-md border px-4 text-sm ${channel === name ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface"}`}
          >
            @{name}
          </button>
        ))}
      </div>
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-mono text-xs text-muted">KICK / {channel}</p>
          <a className="text-xs text-accent underline" href={`https://kick.com/${channel}`} target="_blank" rel="noreferrer">
            Open on Kick
          </a>
        </div>
        <iframe
          title={`Kick stream for ${channel}`}
          src={kickEmbed(channel)}
          className="aspect-video w-full bg-bg"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </section>
      <section className="rounded-xl border border-border bg-surface p-4">
        <p className="font-mono text-xs tracking-wide text-muted">TITLE FILTER</p>
        <p className="mt-1 text-sm text-muted">Only titles containing DDLTCG, Doginal Dogs Legends, or Doginal Dogs TCG qualify for Packwatch tracking.</p>
        <label className="mt-4 block text-xs text-muted" htmlFor="kick-title">Paste the current stream title to check it</label>
        <input id="kick-title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-accent" placeholder="DDLTCG ranked climb" />
        {title && <p className={`mt-3 text-sm ${matching ? "text-ok" : "text-muted"}`}>{matching ? "Title matches the DDL tracking filter." : "Title does not match the DDL tracking filter."}</p>}
      </section>
      <p className="text-xs leading-relaxed text-faint">Unattended Kick metadata tracking requires a server-side Kick access token and is intentionally not faked in the browser. The local bridge remains the source of verified game events.</p>
    </div>
  );
}
