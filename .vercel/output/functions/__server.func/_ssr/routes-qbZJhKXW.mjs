import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as answerQuestion, c as defOf, d as groupDeck, f as openCompanion, i as ScreenWatch, l as effectiveAtk, m as useBrain, n as DECK_CLASSES, o as answerWatch, p as parseSight, r as RULES_TEXT, s as canAttackCreature, t as CARDS, u as effectiveKeywords } from "./screen-watch-mY4oK6s5.mjs";
import { n as RotateCcw } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-qbZJhKXW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function inLockedFrame() {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function BoardCall() {
	const b = useBrain();
	const [turn, setTurn] = (0, import_react.useState)("you");
	const [youHP, setYouHP] = (0, import_react.useState)("40");
	const [oppHP, setOppHP] = (0, import_react.useState)("40");
	const [taunt, setTaunt] = (0, import_react.useState)(false);
	const [paste, setPaste] = (0, import_react.useState)("");
	const [now, setNow] = (0, import_react.useState)("");
	const preview = (0, import_react.useMemo)(() => inLockedFrame(), []);
	function run() {
		const blob = [
			turn === "you" ? "YOUR TURN" : "OPPONENT TURN",
			`${youHP} / 40`,
			`${oppHP} / 40`,
			taunt ? "Taunt" : "",
			paste
		].join(" ");
		const sight = parseSight(blob);
		const advice = answerWatch(paste || "what should I do", blob);
		const full = `${turn === "opp" ? "Their turn. Plan. Do not click." : taunt ? "Crack Taunt first — you cannot win through a wall." : sight.advice} ${advice}`;
		setNow(full);
		b.noteScan(full);
		b.setNotice(full);
		b.setWatching(true);
		if (paste) b.mergeControls(sight.labels.concat(sight.cards), "Board call");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted",
				children: "This preview cannot see your other Chrome tab. Call the board here — that always works."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTurn("you"),
					className: `min-h-11 rounded-md border px-3 text-sm ${turn === "you" ? "border-accent bg-elevated" : "border-border bg-surface"}`,
					children: "My turn"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTurn("opp"),
					className: `min-h-11 rounded-md border px-3 text-sm ${turn === "opp" ? "border-accent bg-elevated" : "border-border bg-surface"}`,
					children: "Their turn"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Your HP", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: youHP,
						onChange: (e) => setYouHP(e.target.value),
						inputMode: "numeric",
						className: "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Their HP", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: oppHP,
						onChange: (e) => setOppHP(e.target.value),
						inputMode: "numeric",
						className: "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTaunt((v) => !v),
				className: `min-h-11 rounded-md border px-3 text-sm ${taunt ? "border-danger bg-elevated text-danger" : "border-border bg-surface"}`,
				children: taunt ? "Taunt is up" : "No Taunt"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["Cards you can see (paste names)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: paste,
					onChange: (e) => setPaste(e.target.value),
					rows: 4,
					placeholder: "Stump, Dash, End Turn, YOUR TURN…",
					className: "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: run,
				className: "min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg",
				children: "Coach this board"
			}),
			now && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed",
				children: now
			})
		]
	});
}
function CoachPanels() {
	const b = useBrain();
	const { game } = b;
	const oppBodies = game.bot.lanes.filter(Boolean).length;
	const youBodies = game.you.lanes.filter(Boolean).length;
	const taunt = game.bot.lanes.some((c) => c && defOf(c.defId).keywords.includes("Taunt"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Advice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl leading-snug",
						children: b.watching ? b.lastScan || b.coachLine.now : b.coachLine.now
					}),
					b.notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: b.notice
					}),
					b.coachLine.legal[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ok",
						children: b.coachLine.legal[0]
					}),
					b.coachLine.dont[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-danger",
						children: b.coachLine.dont[0]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Deck tracker"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: [
							"You ",
							game.you.hp,
							"/40 · mana ",
							game.you.mana,
							"/",
							game.you.manaCap,
							" · hand ",
							game.you.hand.length,
							" · deck ",
							game.you.deck.length,
							" · grave ",
							game.you.grave.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"Bodies ",
							youBodies,
							"/5 · back ",
							game.you.back.filter(Boolean).length,
							"/5"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "Opponent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm",
					children: [
						game.bot.hp,
						"/40 · bodies ",
						oppBodies,
						"/5 · ",
						taunt ? "Taunt up" : "face open"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "Lessons"
				}), b.lessons[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2 text-sm",
					children: b.lessons.slice(0, 4).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-danger",
						children: l.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-muted",
						children: l.detail
					})] }, l.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Illegal taps get remembered and replayed on matching boards."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "Stats"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm",
					children: [
						"Turn ",
						game.turnNo,
						" · ",
						game.events.filter((e) => e.kind === "illegal").length,
						" illegal · ",
						b.lessons.length,
						" lessons"
					]
				})]
			})
		]
	});
}
function hpTone(hp) {
	if (hp <= 10) return "text-danger";
	if (hp <= 20) return "text-fg";
	return "text-ok";
}
function Mini({ inst, secret, active, dim, onClick }) {
	const d = defOf(inst.defId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `flex min-h-16 w-full flex-col rounded-md border px-2 py-1.5 text-left transition-colors ${active ? "border-accent bg-elevated" : "border-border bg-surface hover:border-muted"} ${dim ? "opacity-40" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate font-display text-sm tracking-tight",
				children: secret ? "Set trap" : d.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted",
				children: d.cost
			})]
		}), !secret && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-1 flex items-center justify-between text-[11px] text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.kind === "Creature" ? `${inst.atk}/${inst.hp}` : d.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.cls })]
		})]
	});
}
function Lane({ inst, owner, index, onClick, glow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `flex min-h-[88px] flex-col justify-between rounded-lg border p-2 text-left ${glow ? "border-accent bg-elevated" : "border-border bg-surface"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-mono text-[10px] tracking-widest text-faint",
			children: ["L", index + 1]
		}), inst ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-sm leading-tight",
			children: defOf(inst.defId).name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between font-mono text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				effectiveAtk(owner, index),
				"/",
				inst.hp
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: effectiveKeywords(owner, index).join(" ") || "—" })]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-faint",
			children: "Empty"
		})]
	});
}
function Back({ inst }) {
	if (!inst) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 rounded-md border border-dashed border-border" });
	const d = defOf(inst.defId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-10 items-center justify-center rounded-md border border-border bg-elevated px-1 font-mono text-[10px] text-muted",
		children: inst.faceDown ? "Trap" : d.name
	});
}
var Guard = class extends import_react.Component {
	state = { err: null };
	static getDerivedStateFromError(error) {
		return { err: error.message || "Preview glitch" };
	}
	render() {
		if (this.state.err) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "min-h-dvh bg-bg p-6 text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl",
					children: "Pack Watch"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-muted",
					children: "The coach hit a snag. Start a fresh session — your practice match will reset."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-6 min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg",
					onClick: () => {
						try {
							localStorage.removeItem("pack-watch-brain");
							localStorage.removeItem("pack-watch-brain-v3");
							localStorage.removeItem("pack-watch-brain-v4");
						} catch {}
						window.location.reload();
					},
					children: "Start over"
				})
			]
		});
		return this.props.children;
	}
};
function PackApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Guard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackAppInner, {}) });
}
function PackAppInner() {
	const b = useBrain();
	const { game, selected } = b;
	const [q, setQ] = (0, import_react.useState)("");
	const [popupBlock, setPopupBlock] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.trim().toLowerCase();
		if (!s) return CARDS;
		return CARDS.filter((c) => c.name.toLowerCase().includes(s) || c.id.toLowerCase().includes(s) || c.text.toLowerCase().includes(s) || c.cls.toLowerCase().includes(s));
	}, [q]);
	function sendAsk() {
		const question = b.ask.trim() || "What should I do right now?";
		if (b.asking) return;
		if (b.watching) {
			b.setAskReply(answerWatch(question, b.lastScan));
			return;
		}
		b.setAskReply(answerQuestion(game, question));
	}
	function onHand(c) {
		if (game.turn !== "you" || game.winner) {
			b.setNotice("Wait for your turn.");
			return;
		}
		const d = defOf(c.defId);
		if (!(game.you.mana >= d.cost || game.you.coin && game.you.mana + 1 >= d.cost)) {
			b.setNotice(`This costs ${d.cost}. You only have ${game.you.mana} mana. Tap End turn to get more.`);
			return;
		}
		b.play(c.uid);
	}
	function onYourLane(i) {
		if (selected?.kind === "hand") {
			b.play(selected.id, i);
			return;
		}
		if (game.you.lanes[i]) b.pick({
			kind: "lane",
			id: String(i)
		});
	}
	function onOppLane(i) {
		if (selected?.kind === "lane") b.hit(Number(selected.id), i);
	}
	function onOppHero() {
		if (selected?.kind === "lane") b.hit(Number(selected.id), "hero");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border px-4 py-3 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => b.setTab("home"),
					className: "text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] tracking-[0.22em] text-muted",
						children: "DDLTCG COACH"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl tracking-tight",
						children: "Pack Watch"
					})]
				}), b.tab !== "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 rounded-lg border border-border bg-surface p-1",
					children: [
						["arena", "Play"],
						["watch", "Watch"],
						["brain", "Cards"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => b.setTab(id),
						className: `min-h-11 rounded-md px-3 text-sm ${b.tab === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"}`,
						children: label
					}, id))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-4 md:px-8",
			children: [b.tab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-xl py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl tracking-tight",
						children: "How to use this"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base leading-relaxed text-muted",
						children: "Pack Watch is an advice-only companion, never a Chrome extension. It stays outside the game: practice here, or call the live board by typing what you see."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => b.setTab("arena"),
								className: "rounded-xl border border-border bg-surface p-5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl",
									children: "Practice a match"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "Works right now. Tap a bright card, End turn, read Do this now. Hunt the win."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => b.setTab("watch"),
								className: "rounded-xl border border-border bg-surface p-5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl",
									children: "Coach my live game"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "Play DDL in Chrome. Here, mark whose turn, HP, Taunt, paste card names. Pack Watch answers."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => b.setTab("brain"),
								className: "rounded-xl border border-border bg-surface p-5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl",
									children: "Build a legal deck"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "40 cards, max 3 copies, from the current online pool. Wayne stays out."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-faint",
						children: "You can always tap the Pack Watch title to come back here."
					})
				]
			}), b.tab !== "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0",
					children: [
						b.tab === "arena" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed",
									children: "Bright cards you can play now. Faded cards cost too much. Tap one bright card. When you are stuck, tap End turn."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted",
										children: [
											"Turn ",
											game.turnNo,
											" · ",
											game.turn === "you" ? "Your turn" : "Bot turn",
											game.winner ? ` · ${game.winner === "you" ? "You won" : game.winner === "bot" ? "You lost" : "Draw"}` : ""
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: b.newMatch,
											className: "inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "New match"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: b.pass,
											disabled: game.turn !== "you" || !!game.winner,
											className: "inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg disabled:opacity-40",
											children: "End turn"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: onOppHero,
									className: "flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted",
										children: "Opponent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono text-xl tabular-nums ${hpTone(game.bot.hp)}`,
										children: [game.bot.hp, "/40"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: game.bot.back.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, { inst: c }, `ob${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: game.bot.lanes.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
										inst: c,
										owner: game.bot,
										index: i,
										glow: selected?.kind === "lane" && !!c && canAttackCreature(game, Number(selected.id), i).ok,
										onClick: () => onOppLane(i)
									}, `ol${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: game.you.lanes.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
										inst: c,
										owner: game.you,
										index: i,
										glow: selected?.kind === "lane" && selected.id === String(i),
										onClick: () => onYourLane(i)
									}, `yl${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: game.you.back.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, { inst: c }, `yb${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: "You"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-xs text-faint",
										children: [
											"Mana ",
											game.you.mana,
											"/",
											game.you.manaCap,
											game.you.coin ? " · Coin" : ""
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono text-xl tabular-nums ${hpTone(game.you.hp)}`,
										children: [game.you.hp, "/40"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-sm text-muted",
									children: "Your hand — tap a bright card"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
									children: game.you.hand.map((c) => {
										const d = defOf(c.defId);
										const dim = d.cost > game.you.mana && !(game.you.coin && d.cost === game.you.mana + 1);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
											inst: c,
											dim,
											active: selected?.kind === "hand" && selected.id === c.uid,
											onClick: () => onHand(c)
										}, c.uid);
									})
								})] })
							]
						}),
						b.tab === "watch" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-surface p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-2xl",
											children: "Call the live board"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 max-w-prose text-sm leading-relaxed text-muted",
											children: "Works in this preview. Play DDL in normal Chrome. Mark turn, HP, Taunt, paste names. Same SKILL as the desktop HUD. No second login."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardCall, {})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "rounded-xl border border-border bg-surface p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
											className: "cursor-pointer font-display text-xl",
											children: "Desktop HUD (your PC)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-muted",
											children: "Attaches to the Chrome you already play in. Does not open the site. Does not click. If CDP is flagged, use screen OCR instead."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
											className: "mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Download the zip. Unzip. That folder is Pack Watch." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Start Chrome with a dedicated profile and debug port (see README). Log into ddltcg.com/play yourself." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-xs",
													children: "python python/watcher.py --mode attach"
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-xs",
													children: "python python/brain.py --loop"
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-xs",
													children: "cd overlay && npm start"
												}) })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "/packwatch-desktop.zip",
											download: "packwatch-desktop.zip",
											className: "mt-4 inline-flex min-h-12 items-center rounded-md bg-accent px-5 text-sm font-medium text-accent-fg",
											children: "Download desktop HUD"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
									className: "rounded-xl border border-border bg-surface p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
											className: "cursor-pointer font-display text-xl",
											children: "Share a window (optional)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-muted",
											children: "Only works if Pack Watch is open as its own Chrome window, not inside this preview. If Chrome does not ask you to pick a tab, use Call the live board above."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												if (!openCompanion()) setPopupBlock("This preview blocks extra windows. Use Call the live board.");
											},
											className: "mt-3 min-h-11 rounded-md border border-border px-4 text-sm",
											children: "Try sidecar window"
										}),
										popupBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-danger",
											children: popupBlock
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenWatch, {})
										})
									]
								})
							]
						}),
						b.tab === "brain" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-surface p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl",
											children: "Build for online play"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm leading-relaxed text-muted",
											children: "Legal pool only. Wayne is removed from competition — too strong as a 2-mana Rush. Tap a class. Pack Watch writes a 40-card list you can take to ddltcg.com."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4 flex flex-wrap gap-2",
											children: DECK_CLASSES.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => b.buildDeck(cls),
												className: "min-h-11 rounded-md border border-border px-4 text-sm",
												children: cls
											}, cls))
										}),
										b.lastDeck && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm",
												children: b.lastDeck.notes
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "mt-3 grid gap-1 sm:grid-cols-2",
												children: groupDeck(b.lastDeck.list).map(({ def, n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex justify-between gap-2 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														def.name,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-muted",
															children: [
																def.cost,
																" · ",
																def.kind
															]
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-muted",
														children: ["×", n]
													})]
												}, def.id))
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-surface p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl",
											children: "Simple rules"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-3 space-y-2",
											children: RULES_TEXT.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: r.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: r.body
											})] }, r.title))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm text-danger",
											children: "Wayne — banned online. Do not register it."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Find a card",
									className: "min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "grid gap-2 sm:grid-cols-2",
									children: filtered.slice(0, 24).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "rounded-lg border border-border bg-surface p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display",
											children: [
												c.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-xs text-muted",
													children: [
														c.cost,
														" mana",
														c.banned ? " · banned" : ""
													]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: c.text
										})]
									}, c.id))
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachPanels, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "Ask anything"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: b.ask,
								onChange: (e) => b.setAsk(e.target.value),
								rows: 3,
								placeholder: "What should I do?",
								className: "mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: sendAsk,
								className: "mt-2 min-h-11 w-full rounded-md bg-accent text-sm font-medium text-accent-fg",
								children: "Tell me"
							}),
							b.askReply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed",
								children: b.askReply
							})
						]
					})]
				})]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackApp, {});
}
//#endregion
export { Home as component };
