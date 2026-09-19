"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT,
  type ConsentSource,
  type LearningConsent,
} from "./policy";

function readLocal(): LearningConsent {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null") as Partial<LearningConsent> | null;
    if (!parsed || parsed.policyVersion !== CONSENT_POLICY_VERSION) return DEFAULT_CONSENT;
    if (!["granted", "denied", "unset"].includes(parsed.status ?? "")) return DEFAULT_CONSENT;
    return {
      status: parsed.status as LearningConsent["status"],
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      policyVersion: CONSENT_POLICY_VERSION,
      source: parsed.source === "prompt" || parsed.source === "settings" ? parsed.source : null,
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function useConsent() {
  const [consent, setConsent] = useState<LearningConsent>(DEFAULT_CONSENT);
  const [error, setError] = useState("");

  useEffect(() => setConsent(readLocal()), []);

  const update = useCallback(async (status: "granted" | "denied", source: ConsentSource) => {
    const next: LearningConsent = {
      status,
      updatedAt: new Date().toISOString(),
      policyVersion: CONSENT_POLICY_VERSION,
      source,
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    setConsent(next);
    setError("");
    try {
      const response = await fetch("/api/consent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!response.ok && response.status !== 401) throw new Error("The account consent record could not be saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The account consent record could not be saved.");
    }
  }, []);

  const withdraw = useCallback(async () => {
    await update("denied", "settings");
    try {
      const response = await fetch("/api/consent", { method: "DELETE" });
      if (!response.ok && response.status !== 401) throw new Error("Withdrawal could not be confirmed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal could not be confirmed.");
    }
  }, [update]);

  return { consent, error, update, withdraw };
}
