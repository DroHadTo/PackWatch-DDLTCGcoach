import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ScreenWatch, m as useBrain, o as answerWatch } from "./screen-watch-DlcaV2hQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk--Egrg078.js
var import_jsx_runtime = require_jsx_runtime();
function Desk() {
	const b = useBrain();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-bg px-4 py-4 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.22em] text-muted",
				children: "SIDECAR"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl tracking-tight",
				children: "Pack Watch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "This window sits next to Chrome. It watches a tab you share. It does not touch the game."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-lg border border-danger/40 bg-surface px-3 py-2 text-sm text-danger",
				children: "If you installed the old Pack Watch add-on, remove it in chrome://extensions or DDL login can stay broken."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenWatch, { compact: true })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Ask this match"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: b.ask,
						onChange: (e) => b.setAsk(e.target.value),
						rows: 3,
						placeholder: "Can I hit face?",
						className: "mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => b.setAskReply(answerWatch(b.ask.trim() || "what should I do", b.lastScan)),
						className: "mt-2 min-h-11 w-full rounded-md bg-accent text-sm font-medium text-accent-fg",
						children: "Tell me"
					}),
					b.askReply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed",
						children: b.askReply
					}),
					b.lastScan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: b.lastScan
					})
				]
			})
		]
	});
}
//#endregion
export { Desk as component };
