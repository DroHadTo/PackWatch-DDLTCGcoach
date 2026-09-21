"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useConsent } from "@/lib/learning/use-consent";
import { CONSENT_POLICY_VERSION } from "@/lib/learning/policy";

export function ConsentPanel() {
  const { consent, error, update, withdraw } = useConsent();
  const [open, setOpen] = useState(consent.status === "unset");
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (consent.status !== "unset") setOpen(false);
  }, [consent.status]);

  async function choose(status: "granted" | "denied", source: "prompt" | "settings") {
    setSaving(true);
    await update(status, source);
    setSaving(false);
    setOpen(false);
  }

  async function revoke() {
    setSaving(true);
    await withdraw();
    setSaving(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 shrink-0 rounded-md border border-border px-3 text-sm text-muted hover:text-fg"
      >
        Sharing: {consent.status === "granted" ? "on" : "local"}
      </button>
      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="consent-title">
          <section className="mb-4 max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-4 shadow-2xl sm:mb-0 sm:p-6">
            <p className="font-mono text-xs tracking-[0.2em] text-muted">LEARNING PRIVACY</p>
            <h2 id="consent-title" className="mt-2 font-display text-2xl">Choose where learning stays.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Packwatch is local-only by default. Your match notes, lessons, scans, and practice state stay in this browser unless you explicitly choose to contribute learning signals.
            </p>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-lg border border-border bg-bg p-3">
                <p className="font-medium text-fg">If you share learning</p>
                <p className="mt-1 leading-relaxed text-muted">Only approved categories can be sent: pack outcomes, card labels you choose to contribute, and model updates you approve. Raw screenshots, passwords, payment data, identity documents, and payment card data are never shared.</p>
              </div>
              <div className="rounded-lg border border-border bg-bg p-3">
                <p className="font-medium text-fg">If you keep it local</p>
                <p className="mt-1 leading-relaxed text-muted">Your own bot can continue learning from your local browser data. No training or collection request is made, and nothing is uploaded for shared learning.</p>
              </div>
              <div className="rounded-lg border border-border bg-bg p-3">
                <p className="font-medium text-fg">Optional AI explanations are separate</p>
                <p className="mt-1 leading-relaxed text-muted">The live bridge has its own opt-in. Only a manual board-text question is sent to the configured provider, and that request is not used as Packwatch shared training.</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-faint">Policy {CONSENT_POLICY_VERSION}. You can withdraw at any time; withdrawal stops future uploads and removes stored contributions from your account.</p>
            {error && <p className="mt-3 rounded-md border border-danger/50 px-3 py-2 text-sm text-danger">{error}</p>}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap">
              <button type="button" disabled={saving} onClick={() => void choose("granted", consent.status === "unset" ? "prompt" : "settings")} className="min-h-10 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg disabled:opacity-50">
                Share learning
              </button>
              <button type="button" disabled={saving} onClick={() => void choose("denied", consent.status === "unset" ? "prompt" : "settings")} className="min-h-10 rounded-md border border-border px-3 text-sm text-fg disabled:opacity-50">
                Keep local
              </button>
              {consent.status === "unset" && (
                <button type="button" disabled={saving} onClick={() => void choose("denied", "prompt")} className="min-h-10 rounded-md border border-border px-3 text-sm text-muted disabled:opacity-50">
                  Not now
                </button>
              )}
              {consent.status === "granted" && (
                <button type="button" disabled={saving} onClick={() => void revoke()} className="min-h-10 rounded-md border border-danger/50 px-3 text-sm text-danger disabled:opacity-50">
                  Turn sharing off
                </button>
              )}
              {consent.status !== "unset" && (
                <button type="button" onClick={() => setOpen(false)} className="min-h-10 rounded-md px-3 text-sm text-muted hover:text-fg">
                  Close
                </button>
              )}
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
