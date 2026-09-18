import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn-frame-SLAx4j-g.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var learnFrame_createServerFn_handler = createServerRpc({
	id: "8e7f377214126115aabbae8713dff47c84e3b65a99bf079f38b786392b3f9007",
	name: "learnFrame",
	filename: "src/lib/ddl/learn-frame.ts"
}, (opts) => learnFrame.__executeServer(opts));
var learnFrame = createServerFn({ method: "POST" }).validator((input) => input).handler(learnFrame_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Vision is unavailable. Paste board text instead."
	};
	const image = data.image.slice(0, 9e5);
	if (!image.startsWith("data:image/")) return {
		ok: false,
		error: "Bad frame."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		signal: AbortSignal.timeout(15e3),
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 350,
			messages: [{
				role: "system",
				content: "You read a screenshot of Doginal Dogs Legends (DDLTCG) play. Extract visible buttons, whose turn, both Hero HP if shown, card names, keywords (Taunt Rush Poison Fury Frozen), and one coaching line. Advice only — never click. JSON keys: turn (you|opp|unknown), youHP, oppHP, labels (string[]), cards (string[]), keywords (string[]), advice (string)."
			}, {
				role: "user",
				content: [{
					type: "text",
					text: "Read this play-page frame. JSON only."
				}, {
					type: "image_url",
					image_url: { url: image }
				}]
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Vision error ${res.status}`
	};
	const text = (await res.json()).choices[0]?.message.content ?? "";
	const jsonStart = text.indexOf("{");
	const jsonEnd = text.lastIndexOf("}");
	if (jsonStart < 0 || jsonEnd < 0) return {
		ok: true,
		text,
		parsed: null
	};
	try {
		return {
			ok: true,
			text,
			parsed: JSON.parse(text.slice(jsonStart, jsonEnd + 1))
		};
	} catch {
		return {
			ok: true,
			text,
			parsed: null
		};
	}
});
//#endregion
export { learnFrame_createServerFn_handler };
