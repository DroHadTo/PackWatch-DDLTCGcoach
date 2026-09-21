import { BRIDGE_POLL_MS, BRIDGE_REQUEST_TIMEOUT_MS, DEFAULT_BRIDGE } from "@/lib/packwatch-config";
import { useCallback, useEffect, useRef, useState } from "react";

export type BridgeStatus = "idle" | "connecting" | "connected" | "offline" | "error";

export type LiveAdvice = {
  observed: string;
  recommendation: string;
  confidence?: string;
  source: string;
  boardState?: {
    turn?: string;
    round?: number | null;
    you_hp?: number | null;
    opp_hp?: number | null;
    mana?: number | null;
    mana_cap?: number | null;
    threats?: string[];
    labels?: string[];
    decision_window?: boolean;
    face_open?: boolean;
    mana_spend?: number | null;
  };
  updatedAt?: string;
};

export type PackwatchBridgeState = {
  endpoint: string;
  status: BridgeStatus;
  board: string;
  advice: LiveAdvice | null;
  lastSeen: string | null;
  latencyMs: number | null;
  error: string | null;
  active: boolean;
  setEndpoint: (endpoint: string) => void;
  connect: () => void;
  disconnect: () => void;
};

function stringifyPayload(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function pickBoard(payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidate = record.board ?? record.boardState ?? record.text ?? record.live;
    if (candidate != null) return stringifyPayload(candidate);
  }
  return stringifyPayload(payload);
}

function pickAdvice(payload: unknown): LiveAdvice {
  if (typeof payload === "string") {
    return { observed: "Live watcher advice", recommendation: payload, source: "Local watcher" };
  }
  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const steps = Array.isArray(record.steps)
    ? record.steps.filter((item): item is string => typeof item === "string").join(" ")
    : "";
  const recommendation =
    record.recommendation ??
    record.action ??
    record.advice ??
    (record.next != null ? `Next: ${String(record.next)}${record.why ? ` Why: ${String(record.why)}` : ""}` : null) ??
    steps;
  return {
    observed: String(record.observed ?? record.summary ?? "Live board received"),
    recommendation: String(recommendation ?? "No recommendation was returned."),
    confidence: record.confidence == null ? undefined : String(record.confidence),
    source: String(record.source ?? "Local watcher"),
    boardState:
      record.board_state && typeof record.board_state === "object"
        ? (record.board_state as LiveAdvice["boardState"])
        : undefined,
    updatedAt: record.updated_at == null ? undefined : String(record.updated_at),
  };
}

async function readJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
  });
  if (!response.ok) throw new Error(`Bridge returned ${response.status}`);
  return response.json();
}

export function usePackwatchBridge(): PackwatchBridgeState {
  const [endpoint, setEndpoint] = useState(DEFAULT_BRIDGE);
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [board, setBoard] = useState("");
  const [advice, setAdvice] = useState<LiveAdvice | null>(null);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const disconnect = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setActive(false);
    setStatus("idle");
    setError(null);
    setLatencyMs(null);
  }, []);

  const connect = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (!active) return undefined;
    const controller = new AbortController();
    controllerRef.current = controller;
    const base = endpoint.trim().replace(/\/$/, "");
    let firstAttempt = true;
    let timer: number | null = null;
    let polling = false;
    let lastBoardFingerprint = "";
    let lastAdviceFingerprint = "";
    const poll = async () => {
      if (controller.signal.aborted) return;
      if (polling) return;
      polling = true;
      const startedAt = performance.now();
      const requestController = new AbortController();
      const abortRequest = () => requestController.abort();
      controller.signal.addEventListener("abort", abortRequest, { once: true });
      const timeout = window.setTimeout(() => requestController.abort(), BRIDGE_REQUEST_TIMEOUT_MS);
      try {
        const [livePayload, advicePayload] = await Promise.all([
          readJson(`${base}/live`, requestController.signal),
          readJson(`${base}/advice`, requestController.signal),
        ]);
        const nextBoard = pickBoard(livePayload);
        const nextAdvice = pickAdvice(advicePayload);
        const boardFingerprint = nextBoard;
        const adviceFingerprint = JSON.stringify(nextAdvice);
        if (boardFingerprint !== lastBoardFingerprint) {
          lastBoardFingerprint = boardFingerprint;
          setBoard(nextBoard);
        }
        if (adviceFingerprint !== lastAdviceFingerprint) {
          lastAdviceFingerprint = adviceFingerprint;
          setAdvice(nextAdvice);
        }
        setLastSeen(new Date().toISOString());
        setLatencyMs(Math.round(performance.now() - startedAt));
        setError(null);
        setStatus("connected");
        firstAttempt = false;
      } catch (cause) {
        if (controller.signal.aborted) return;
        const message = cause instanceof Error ? cause.message : "The local bridge could not be read.";
        setError(
          message.includes("Failed to fetch") || message.includes("NetworkError")
            ? "Bridge unavailable or blocked by browser CORS. Start the local watcher, then reconnect."
            : message,
        );
        setStatus(firstAttempt ? "offline" : "error");
        firstAttempt = false;
      } finally {
        window.clearTimeout(timeout);
        controller.signal.removeEventListener("abort", abortRequest);
        polling = false;
        if (!controller.signal.aborted) {
          timer = window.setTimeout(() => void poll(), BRIDGE_POLL_MS);
        }
      }
    };
    void poll();
    return () => {
      controller.abort();
      if (timer !== null) window.clearTimeout(timer);
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [active, endpoint]);

  return {
    endpoint,
    status,
    board,
    advice,
    lastSeen,
    latencyMs,
    error,
    active,
    setEndpoint,
    connect,
    disconnect,
  };
}
