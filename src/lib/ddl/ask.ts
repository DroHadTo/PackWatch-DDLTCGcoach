import { createServerFn } from "@tanstack/react-start";
import { enforceRateLimit } from "@/lib/rate-limit.server";

export const askCoach = createServerFn({ method: "POST" })
  .validator((input: { question: string; board: string; aiConsent: boolean }) => {
    if (
      !input ||
      typeof input.question !== "string" ||
      typeof input.board !== "string" ||
      input.aiConsent !== true ||
      input.question.length > 400 ||
      input.board.length > 2500
    ) {
      throw new Error("AI explanation requires explicit consent.");
    }
    return input;
  })
  .handler(async ({ data }) => {
    try {
      await enforceRateLimit({ bucket: "expensive", failClosed: true });
      const apiKey = process.env.PACKWATCH_AI_API_KEY?.trim() || process.env.XAI_API_KEY?.trim();
      const baseUrl = (process.env.PACKWATCH_AI_BASE_URL?.trim() || "https://api.x.ai/v1").replace(/\/$/, "");
      const model = process.env.PACKWATCH_AI_MODEL?.trim() || "grok-4.5";
      if (!apiKey) {
        return { ok: false as const, error: "External AI is not configured. The local rules coach is still available." };
      }
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          model,
          max_tokens: 250,
          messages: [
            {
              role: "system",
              content:
                "You are Pack Watch, an advice-only DDLTCG coach. Never tell the player to click for them. Enforce kill-gate, Taunt, Rush-cannot-hit-hero-same-turn, traps cannot spring the turn set, mana does not bank. Be short. If the board is incomplete, say what is unknown instead of inventing a line.",
            },
            {
              role: "user",
              content: `Board snapshot:\n${data.board.slice(0, 2500)}\n\nQuestion:\n${data.question.slice(0, 400)}`,
            },
          ],
        }),
      });
      if (!res.ok) return { ok: false as const, error: "External AI is temporarily unavailable. Use the local rules coach." };
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = body.choices?.[0]?.message?.content?.trim();
      return text
        ? { ok: true as const, text }
        : { ok: false as const, error: "External AI returned no explanation. Use the local rules coach." };
    } catch (error) {
      console.error("[packwatch] external AI explanation failed", error);
      return { ok: false as const, error: "External AI is temporarily unavailable. Use the local rules coach." };
    }
  });
