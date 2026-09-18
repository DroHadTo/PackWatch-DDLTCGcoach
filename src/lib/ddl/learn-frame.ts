import { createServerFn } from "@tanstack/react-start";

export const learnFrame = createServerFn({ method: "POST" })
  .validator((input: { image: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Vision is unavailable. Paste board text instead." };
    const image = data.image.slice(0, 900_000);
    if (!image.startsWith("data:image/")) return { ok: false as const, error: "Bad frame." };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content:
              "You read a screenshot of Doginal Dogs Legends (DDLTCG) play. Extract visible buttons, whose turn, both Hero HP if shown, card names, keywords (Taunt Rush Poison Fury Frozen), and one coaching line. Advice only — never click. JSON keys: turn (you|opp|unknown), youHP, oppHP, labels (string[]), cards (string[]), keywords (string[]), advice (string).",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Read this play-page frame. JSON only." },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `Vision error ${res.status}` };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    const text = body.choices[0]?.message.content ?? "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) return { ok: true as const, text, parsed: null };
    try {
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
        turn?: string;
        youHP?: number | null;
        oppHP?: number | null;
        labels?: string[];
        cards?: string[];
        keywords?: string[];
        advice?: string;
      };
      return { ok: true as const, text, parsed };
    } catch {
      return { ok: true as const, text, parsed: null };
    }
  });
