import { BRIDGE_POLL_MS, DEFAULT_BRIDGE } from "@/lib/packwatch-config";
import { useCallback, useEffect, useRef, useState } from "react";

export type BridgeStatus = "idle" | "connecting" | "connected" | "offline" | "error";

export type LiveAdvice = {
  observed: string;
  recommendation: string;
  confidence?: string;
  source: string;
};

export type PackwatchBridgeState = {
  endpoint: string;
  status: BridgeStatus;
  board: string;
  advice: LiveAdvice | null;
  lastSeen: string | null;
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
  return {
    observed: String(record.observed ?? record.summary ?? "Live board received"),
    recommendation: String(
      record.recommendation ?? record.action ?? record.advice ?? steps ?? "No recommendation was returned.",
    ),
    confidence: record.confidence == null ? undefined : String(record.confidence),
    source: String(record.source ?? "Local watcher"),
  };
}

async function readJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Bridge returned ${response.status}`);
  return response.json();
}

export function usePackwatchBridge(): PackwatchBridgeState {
  const [endpoint, setEndpoint] = useState(DEFAULT_BRIDGE);
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [board, setBoard] = useState("");
  const [advice, setAdvice] = useState<LiveAdvice | null>(null);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const disconnect = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setActive(false);
    setStatus("idle");
    setError(null);
  }, []);

  const connect = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (!active) return undefined;
    const controller = new AbortController();
    controllerRef.current = controller;
    const base = endpoint.trim().replace(/\/$/, "");
    let firstAttempt = true;
    const poll = async () => {
      if (controller.signal.aborted) return;
      setStatus(firstAttempt ? "connecting" : "connected");
      try {
        const [livePayload, advicePayload] = await Promise.all([
          readJson(`${base}/live`, controller.signal),
          readJson(`${base}/advice`, controller.signal),
        ]);
        setBoard(pickBoard(livePayload));
        setAdvice(pickAdvice(advicePayload));
        setLastSeen(new Date().toISOString());
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
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), BRIDGE_POLL_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [active, endpoint]);

  return {
    endpoint,
    status,
    board,
    advice,
    lastSeen,
    error,
    active,
    setEndpoint,
    connect,
    disconnect,
  };
}
