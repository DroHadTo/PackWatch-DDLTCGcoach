export const CONSENT_POLICY_VERSION =
  (import.meta.env.VITE_CONSENT_POLICY_VERSION as string | undefined)?.trim() || "2026-09-19-v1";

export const CONSENT_STATUSES = ["granted", "denied", "unset"] as const;
export type ConsentStatus = (typeof CONSENT_STATUSES)[number];
export type ConsentSource = "prompt" | "settings";

export interface LearningConsent {
  status: ConsentStatus;
  updatedAt: string | null;
  policyVersion: string;
  source: ConsentSource | null;
}

export const DEFAULT_CONSENT: LearningConsent = {
  status: "unset",
  updatedAt: null,
  policyVersion: CONSENT_POLICY_VERSION,
  source: null,
};

export const CONSENT_STORAGE_KEY = "packwatch-learning-consent-v1";
