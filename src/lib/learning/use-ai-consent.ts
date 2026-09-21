"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "packwatch-ai-explanation-consent-v1";

export type AiConsent = "granted" | "denied" | "unset";

export function useAiConsent() {
  const [consent, setConsent] = useState<AiConsent>("unset");

  useEffect(() => {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "granted" || value === "denied") setConsent(value);
  }, []);

  const update = useCallback((next: Exclude<AiConsent, "unset">) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setConsent(next);
  }, []);

  return { consent, update };
}
