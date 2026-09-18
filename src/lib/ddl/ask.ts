import { createServerFn } from "@tanstack/react-start";

export const askCoach = createServerFn({ method: "POST" })
  .validator((input: { question: string; board: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Live Grok is unavailable here. Use the rules coach." };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 250,
        messages: [
          {
            role: "system",
            content:
              "You are Pack Watch, an advice-only DDLTCG coach. Never tell the player to click for them. Enforce kill-gate, Taunt, Rush-cannot-hit-hero-same-turn, traps cannot spring the turn set, mana does not bank. Be short.",
          },
          {
            role: "user",
            content: `Board:\n${data.board.slice(0, 2500)}\n\nQuestion: ${data.question.slice(0, 400)}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `Coach error ${res.status}` };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });
