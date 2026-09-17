"use client";

import { learnFrame } from "@/lib/ddl/learn-frame";
import { parseSight, type Sight } from "@/lib/ddl/parse-sight";
import { useBrain } from "@/lib/ddl/store";
import { useEffect, useRef, useState } from "react";

type Detector = { detect: (src: ImageBitmap) => Promise<{ rawValue: string }[]> };

function shareOptions(): DisplayMediaStreamOptions {
  return {
    video: { frameRate: 6 },
    audio: false,
    // Prefer a Chrome tab/window — never inject into the game.
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "exclude",
    surfaceSwitching: "exclude",
    monitorTypeSurfaces: "exclude",
  } as DisplayMediaStreamOptions;
}

export function ScreenWatch({ compact = false }: { compact?: boolean }) {
  const b = useBrain();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sight, setSight] = useState<Sight | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [learns, setLearns] = useState(0);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [stream]);

  useEffect(() => {
    if (!stream) return;
    const id = window.setInterval(() => void sample(false), 900);
    void sample(false);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  function grabJpeg(): string | null {
    const video = videoRef.current;
    if (!video || video.videoWidth < 8) return null;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 960 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.5);
  }

  async function sample(deep: boolean) {
    const video = videoRef.current;
    if (!video || video.videoWidth < 8) return;
    setTicks((n) => n + 1);
    let text = "";
    try {
      const TD = (window as unknown as { TextDetector?: new () => Detector }).TextDetector;
      if (TD) {
        const bmp = await createImageBitmap(video);
        const hits = await new TD().detect(bmp);
        text = hits.map((h) => h.rawValue).join(" ");
        bmp.close();
      }
    } catch {
      /* optional */
    }
    if (text) {
      const s = parseSight(text);
      setSight(s);
      b.mergeControls([...s.labels, ...s.cards], "Shared window");
      b.noteScan(s.advice);
      b.setNotice(s.advice);
    }
    if (!deep) return;
    if (learns >= 8) {
      setErr("That's enough deep reads for now. Keep the share on — I still watch the picture.");
      return;
    }
    const img = grabJpeg();
    if (!img) return;
    setBusy(true);
    setErr("");
    try {
      const res = await learnFrame({ data: { image: img } });
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      setLearns((n) => n + 1);
      const parsed = res.parsed;
      const advice = parsed?.advice || parseSight(res.text).advice;
      b.setNotice(advice);
      b.noteScan(advice);
      if (parsed?.labels) b.mergeControls(parsed.labels.concat(parsed.cards ?? []), "Shared window");
      setSight({
        turn: parsed?.turn === "you" || parsed?.turn === "opp" ? parsed.turn : "unknown",
        youHP: parsed?.youHP ?? null,
        oppHP: parsed?.oppHP ?? null,
        labels: parsed?.labels ?? [],
        cards: parsed?.cards ?? [],
        keywords: parsed?.keywords ?? [],
        raw: res.text,
        advice,
      });
    } catch {
      setErr("I couldn't deep-read that frame. Keep the share on — local watch still runs.");
    } finally {
      setBusy(false);
    }
  }

  async function startShare() {
    setErr("");
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setErr("This window cannot share a screen. Open the companion from Chrome, not inside a locked preview.");
      return;
    }
    try {
      const media = await navigator.mediaDevices.getDisplayMedia(shareOptions());
      setStream(media);
      b.setWatching(true);
      const v = videoRef.current;
      if (v) {
        v.srcObject = media;
        await v.play().catch(() => undefined);
      }
      media.getVideoTracks()[0]?.addEventListener("ended", () => stopShare());
    } catch {
      setErr("Share was cancelled. Tap Watch game, then pick the Chrome tab that has ddltcg.com/play — not this window, not your whole desktop.");
    }
  }

  function stopShare() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    b.setWatching(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  return (
    <div className="flex flex-col gap-3">
      {!stream && (
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>
            Log into{" "}
            <a className="underline" href="https://ddltcg.com/play" target="_blank" rel="noreferrer">
              ddltcg.com/play
            </a>{" "}
            in normal Chrome. Pack Watch is not installed there.
          </li>
          <li>Sit this window beside the game.</li>
          <li>Tap Watch game. Pick that Chrome tab only — never your whole screen (passwords live there).</li>
        </ol>
      )}
      <video
        ref={videoRef}
        className={`w-full rounded-xl border border-border bg-bg object-contain ${stream ? "aspect-video" : "hidden"}`}
        muted
        playsInline
      />
      {stream && (
        <p className="font-mono text-xs tracking-wide text-ok">
          LIVE · tick {ticks}
          {sight ? ` · turn ${sight.turn} · HP ${sight.youHP ?? "?"} / ${sight.oppHP ?? "?"}` : " · reading…"}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {!stream ? (
          <button
            type="button"
            onClick={startShare}
            className="min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
          >
            Watch game
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void sample(true)}
              disabled={busy}
              className="min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg disabled:opacity-40"
            >
              {busy ? "Reading…" : "Deep read"}
            </button>
            <button type="button" onClick={stopShare} className="min-h-12 rounded-md border border-border px-5 text-sm">
              Stop
            </button>
          </>
        )}
      </div>
      {err && <p className="text-sm text-danger">{err}</p>}
      {sight && <p className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">{sight.advice}</p>}
      {!compact && (
        <p className="text-xs leading-relaxed text-faint">
          Safety: Pack Watch never injects into DDL, never clicks, never reads cookies, never sees a window you did
          not share. Remove any old Chrome add-on named Pack Watch — that one sat on the login page.
        </p>
      )}
    </div>
  );
}

export function openCompanion() {
  const url = `${window.location.origin}/desk`;
  const w = window.open(url, "packwatch-desk", "popup=yes,width=440,height=920,resizable=yes,scrollbars=yes");
  return Boolean(w);
}
