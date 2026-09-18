import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/screen-watch-mY4oK6s5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var learnFrame = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("8e7f377214126115aabbae8713dff47c84e3b65a99bf079f38b786392b3f9007"));
var CARDS = [
	{
		id: "V001",
		name: "Chico",
		cls: "Crown",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 2,
		keywords: ["Taunt"],
		text: "Taunt."
	},
	{
		id: "V002",
		name: "Daisy",
		cls: "Bow",
		kind: "Creature",
		cost: 1,
		atk: 2,
		hp: 2,
		keywords: [],
		text: "A 2/2 Bow body."
	},
	{
		id: "V003",
		name: "Dash",
		cls: "Bow",
		kind: "Creature",
		cost: 1,
		atk: 2,
		hp: 1,
		keywords: ["Rush"],
		text: "Rush. Cannot hit the Hero the turn it enters."
	},
	{
		id: "V004",
		name: "Gary",
		cls: "Neutral",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 1,
		keywords: [],
		text: "Play: Draw a card.",
		play: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V005",
		name: "Ginger",
		cls: "Wizard",
		kind: "Creature",
		cost: 1,
		atk: 0,
		hp: 1,
		keywords: [],
		text: "Passive: At the end of your turn, draw a card.",
		end: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V006",
		name: "Icy",
		cls: "Neutral",
		kind: "Creature",
		cost: 1,
		atk: 0,
		hp: 2,
		keywords: [],
		text: "Passive: Your Hero is immune.",
		flags: ["heroImmune"]
	},
	{
		id: "V007",
		name: "Jones",
		cls: "Neutral",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 2,
		keywords: [],
		text: "Play: Shuffle your hand into your deck and draw that many.",
		play: [{ op: "shuffleHandRedraw" }]
	},
	{
		id: "V008",
		name: "Mini",
		cls: "All",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 2,
		keywords: [],
		text: "Counts as all classes.",
		flags: ["allClass"]
	},
	{
		id: "V009",
		name: "Poke",
		cls: "Wizard",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 1,
		keywords: [],
		text: "End: Deal 1 to the enemy Hero.",
		end: [{
			op: "damage",
			n: 1,
			who: "enemyHero"
		}]
	},
	{
		id: "V010",
		name: "Prince",
		cls: "Crown",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 2,
		keywords: [],
		text: "Start: Draw a card.",
		start: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V011",
		name: "Pumpy",
		cls: "Zombie",
		kind: "Creature",
		cost: 2,
		atk: 3,
		hp: 2,
		keywords: [],
		text: "Haunt: Restore 3 HP.",
		haunt: [{
			op: "heal",
			n: 3
		}]
	},
	{
		id: "V012",
		name: "Stump",
		cls: "Pirate",
		kind: "Creature",
		cost: 1,
		atk: 1,
		hp: 2,
		keywords: [],
		text: "Passive: +2 ATK if you control another creature.",
		flags: ["stumpBuff"]
	},
	{
		id: "V013",
		name: "Thumpy",
		cls: "Zombie",
		kind: "Creature",
		cost: 1,
		atk: 0,
		hp: 2,
		keywords: ["Taunt"],
		text: "Taunt. Haunt: Draw a card.",
		haunt: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V014",
		name: "Web",
		cls: "Pirate",
		kind: "Creature",
		cost: 1,
		atk: 2,
		hp: 1,
		keywords: [],
		text: "Haunt: Draw a card.",
		haunt: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V015",
		name: "Blade",
		cls: "Pirate",
		kind: "Creature",
		cost: 2,
		atk: 3,
		hp: 2,
		keywords: [],
		text: "Haunt: Deal 2 to the enemy Hero.",
		haunt: [{
			op: "damage",
			n: 2,
			who: "enemyHero"
		}]
	},
	{
		id: "V016",
		name: "Bone",
		cls: "Neutral",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 2,
		keywords: [],
		text: "Play: Banish a card from a graveyard.",
		play: [{ op: "banishGrave" }]
	},
	{
		id: "V017",
		name: "Chart",
		cls: "Pirate",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "Play: Add a Pirate Spell from your deck.",
		play: [{
			op: "addFromDeck",
			kind: "Spell",
			cls: "Pirate",
			n: 1
		}]
	},
	{
		id: "V018",
		name: "Digger",
		cls: "Zombie",
		kind: "Creature",
		cost: 1,
		atk: 2,
		hp: 1,
		keywords: [],
		text: "Play: Send a creature from your deck to the grave.",
		play: [{ op: "millCreature" }]
	},
	{
		id: "V019",
		name: "Doom",
		cls: "Neutral",
		kind: "Creature",
		cost: 2,
		atk: 0,
		hp: 5,
		keywords: [],
		text: "Start: Destroy all creatures.",
		start: [{ op: "destroyAllCreatures" }]
	},
	{
		id: "V020",
		name: "Dumpy",
		cls: "Zombie",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "Haunt: Deal 2 to the enemy Hero.",
		haunt: [{
			op: "damage",
			n: 2,
			who: "enemyHero"
		}]
	},
	{
		id: "V021",
		name: "Flame",
		cls: "Neutral",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 1,
		keywords: [],
		text: "Play: Deal 2 to a target.",
		play: [{
			op: "damage",
			n: 2,
			who: "any"
		}]
	},
	{
		id: "V022",
		name: "Helios",
		cls: "Crown",
		kind: "Creature",
		cost: 2,
		atk: 0,
		hp: 4,
		keywords: [],
		text: "Start: Deal 3 to the enemy Hero.",
		start: [{
			op: "damage",
			n: 3,
			who: "enemyHero"
		}]
	},
	{
		id: "V023",
		name: "Hunter",
		cls: "Neutral",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "Play: Destroy a trap or lasting spell.",
		play: [{ op: "destroyBackrow" }]
	},
	{
		id: "V024",
		name: "Loopy",
		cls: "Bow",
		kind: "Creature",
		cost: 2,
		atk: 1,
		hp: 3,
		keywords: ["Poison"],
		text: "Poison."
	},
	{
		id: "V025",
		name: "Midi",
		cls: "All",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "Counts as all classes.",
		flags: ["allClass"]
	},
	{
		id: "V026",
		name: "Scroll",
		cls: "Wizard",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "Play: Add a Wizard Spell from your deck.",
		play: [{
			op: "addFromDeck",
			kind: "Spell",
			cls: "Wizard",
			n: 1
		}]
	},
	{
		id: "V027",
		name: "Stone",
		cls: "Crown",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: ["Taunt"],
		text: "Taunt."
	},
	{
		id: "V028",
		name: "Sunny",
		cls: "Bow",
		kind: "Creature",
		cost: 2,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "When an adjacent creature dies, draw a card.",
		flags: ["adjDeathDraw"]
	},
	{
		id: "V029",
		name: "Wayne",
		cls: "Neutral",
		kind: "Creature",
		cost: 2,
		atk: 4,
		hp: 1,
		keywords: ["Rush"],
		text: "Rush. Removed from online competitive play — overpowered.",
		banned: true
	},
	{
		id: "V030",
		name: "Champ",
		cls: "Crown",
		kind: "Creature",
		cost: 3,
		atk: 4,
		hp: 2,
		keywords: ["Taunt"],
		text: "Taunt. Haunt: Draw a card.",
		haunt: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V031",
		name: "Dusty",
		cls: "Pirate",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 3,
		keywords: [],
		text: "Adjacent creatures have Taunt.",
		flags: ["adjTaunt"]
	},
	{
		id: "V032",
		name: "Fitch",
		cls: "Zombie",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 3,
		keywords: [],
		text: "Play: Add a spell from your graveyard.",
		play: [{
			op: "addFromGrave",
			kind: "Spell",
			n: 1
		}]
	},
	{
		id: "V033",
		name: "Goji",
		cls: "Crown",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 3,
		keywords: [],
		text: "Adjacent start effects trigger twice.",
		flags: ["adjStartDouble"]
	},
	{
		id: "V034",
		name: "Mary",
		cls: "Bow",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 2,
		keywords: [],
		text: "Play: Deal 3 to a target.",
		play: [{
			op: "damage",
			n: 3,
			who: "any"
		}]
	},
	{
		id: "V035",
		name: "Mega",
		cls: "All",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 4,
		keywords: [],
		text: "Counts as all classes.",
		flags: ["allClass"]
	},
	{
		id: "V036",
		name: "Plague",
		cls: "Neutral",
		kind: "Creature",
		cost: 3,
		atk: 2,
		hp: 4,
		keywords: [],
		text: "Enemy Hero cannot be healed.",
		flags: ["antiHeal"]
	},
	{
		id: "V037",
		name: "Scout",
		cls: "Pirate",
		kind: "Creature",
		cost: 3,
		atk: 2,
		hp: 4,
		keywords: [],
		text: "Adjacent creatures have Rush.",
		flags: ["adjRush"]
	},
	{
		id: "V038",
		name: "Shepherd",
		cls: "Zombie",
		kind: "Creature",
		cost: 3,
		atk: 2,
		hp: 2,
		keywords: [],
		text: "Play: Summon a 2-or-less from grave.",
		play: [{
			op: "summonGrave",
			maxCost: 2,
			n: 1
		}]
	},
	{
		id: "V039",
		name: "Skip",
		cls: "Wizard",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 3,
		keywords: [],
		text: "End: Restore 3 HP.",
		end: [{
			op: "heal",
			n: 3
		}]
	},
	{
		id: "V040",
		name: "Spark",
		cls: "Wizard",
		kind: "Creature",
		cost: 3,
		atk: 3,
		hp: 3,
		keywords: [],
		text: "End: Deal 2 to the enemy Hero.",
		end: [{
			op: "damage",
			n: 2,
			who: "enemyHero"
		}]
	},
	{
		id: "V041",
		name: "Surge",
		cls: "Wizard",
		kind: "Creature",
		cost: 3,
		atk: 2,
		hp: 3,
		keywords: [],
		text: "Adjacent end effects trigger twice.",
		flags: ["adjEndDouble"]
	},
	{
		id: "V042",
		name: "Sweetie",
		cls: "Bow",
		kind: "Creature",
		cost: 3,
		atk: 2,
		hp: 2,
		keywords: [],
		text: "Play: Summon a 2-or-less from deck.",
		play: [{
			op: "summonDeck",
			maxCost: 2,
			n: 1
		}]
	},
	{
		id: "V043",
		name: "Yang",
		cls: "Neutral",
		kind: "Creature",
		cost: 3,
		atk: 2,
		hp: 1,
		keywords: [],
		text: "Play: Summon all copies of this from deck.",
		play: [{ op: "summonCopies" }]
	},
	{
		id: "V044",
		name: "Boogie",
		cls: "Zombie",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Play: Trigger Haunt of your other creatures.",
		play: [{ op: "hauntAllOthers" }]
	},
	{
		id: "V045",
		name: "Buster",
		cls: "Pirate",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Whenever another friendly creature dies, deal 2 to face.",
		flags: ["deathFace2"]
	},
	{
		id: "V046",
		name: "Cherry",
		cls: "Bow",
		kind: "Creature",
		cost: 4,
		atk: 3,
		hp: 3,
		keywords: [],
		text: "Play: Summon a 2-or-less from deck.",
		play: [{
			op: "summonDeck",
			maxCost: 2,
			n: 1
		}]
	},
	{
		id: "V047",
		name: "Houdini",
		cls: "Wizard",
		kind: "Creature",
		cost: 4,
		atk: 2,
		hp: 2,
		keywords: [],
		text: "Play: Summon up to two 2-or-less from deck.",
		play: [{
			op: "summonDeck",
			maxCost: 2,
			n: 2
		}]
	},
	{
		id: "V048",
		name: "Mama Light",
		cls: "Bow",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Play: Draw 1, or 2 if you control another creature.",
		play: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V049",
		name: "Mento",
		cls: "Wizard",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 4,
		keywords: ["Taunt"],
		text: "Taunt. Haunt: Draw a card.",
		haunt: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V050",
		name: "Pulse",
		cls: "Crown",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Start: Restore 5 HP.",
		start: [{
			op: "heal",
			n: 5
		}]
	},
	{
		id: "V051",
		name: "Reaper",
		cls: "Zombie",
		kind: "Creature",
		cost: 4,
		atk: 3,
		hp: 5,
		keywords: [],
		text: "End: Trigger Haunt of adjacent creatures.",
		flags: ["adjHauntEnd"]
	},
	{
		id: "V052",
		name: "Renza",
		cls: "Neutral",
		kind: "Creature",
		cost: 7,
		atk: 5,
		hp: 5,
		keywords: [],
		text: "Play: Add a spell, a trap, and a creature from deck.",
		play: [{
			op: "addFromDeck",
			kind: "any",
			n: 3
		}]
	},
	{
		id: "V053",
		name: "Seeker",
		cls: "Crown",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 2,
		keywords: [],
		text: "Play: Add a creature from deck.",
		play: [{
			op: "addFromDeck",
			kind: "Creature",
			n: 1
		}]
	},
	{
		id: "V054",
		name: "Shiboshi",
		cls: "Pirate",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 2,
		keywords: [],
		text: "Haunt: Destroy creatures that killed this in combat.",
		haunt: [{ op: "destroyCombatKillers" }]
	},
	{
		id: "V055",
		name: "Turbo",
		cls: "Neutral",
		kind: "Creature",
		cost: 4,
		atk: 4,
		hp: 3,
		keywords: [],
		text: "Play: Destroy an enemy Taunt.",
		play: [{ op: "destroyTaunt" }]
	},
	{
		id: "V056",
		name: "Bender",
		cls: "Zombie",
		kind: "Creature",
		cost: 5,
		atk: 5,
		hp: 3,
		keywords: [],
		text: "Play: Summon up to two 2-or-less from grave.",
		play: [{
			op: "summonGrave",
			maxCost: 2,
			n: 2
		}]
	},
	{
		id: "V057",
		name: "Gummy",
		cls: "Neutral",
		kind: "Creature",
		cost: 6,
		atk: 6,
		hp: 5,
		keywords: [],
		text: "Enemy cannot summon from grave.",
		flags: ["lockGrave"]
	},
	{
		id: "V058",
		name: "Shield",
		cls: "Crown",
		kind: "Creature",
		cost: 5,
		atk: 6,
		hp: 3,
		keywords: [],
		text: "Play: Add up to 2 creatures from grave to hand.",
		play: [{
			op: "addFromGrave",
			kind: "Creature",
			n: 2
		}]
	},
	{
		id: "V059",
		name: "Toot",
		cls: "Zombie",
		kind: "Creature",
		cost: 5,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Haunt: Deal 5 to the enemy Hero.",
		haunt: [{
			op: "damage",
			n: 5,
			who: "enemyHero"
		}]
	},
	{
		id: "V060",
		name: "Volt",
		cls: "Wizard",
		kind: "Creature",
		cost: 5,
		atk: 5,
		hp: 3,
		keywords: [],
		text: "Play: Add up to 2 traps from deck.",
		play: [{
			op: "addFromDeck",
			kind: "Trap",
			n: 2
		}]
	},
	{
		id: "V061",
		name: "Cookie",
		cls: "Neutral",
		kind: "Creature",
		cost: 5,
		atk: 3,
		hp: 6,
		keywords: ["Taunt"],
		text: "Taunt. When enemy draws extra, you draw.",
		flags: ["punishExtraDraw"]
	},
	{
		id: "V062",
		name: "Mama Bark",
		cls: "Bow",
		kind: "Creature",
		cost: 5,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Play: Add up to 2 creatures from grave to hand.",
		play: [{
			op: "addFromGrave",
			kind: "Creature",
			n: 2
		}]
	},
	{
		id: "V063",
		name: "Penny",
		cls: "Pirate",
		kind: "Creature",
		cost: 6,
		atk: 6,
		hp: 2,
		keywords: [],
		text: "Play: Summon a 4-or-less from grave.",
		play: [{
			op: "summonGrave",
			maxCost: 4,
			n: 1
		}]
	},
	{
		id: "V064",
		name: "Aria",
		cls: "Bow",
		kind: "Creature",
		cost: 7,
		atk: 7,
		hp: 4,
		keywords: [],
		text: "Play: Deal 7 to a target.",
		play: [{
			op: "damage",
			n: 7,
			who: "any"
		}]
	},
	{
		id: "V065",
		name: "Atlas",
		cls: "Crown",
		kind: "Creature",
		cost: 7,
		atk: 6,
		hp: 6,
		keywords: [],
		text: "Start: Deal 7 to the enemy Hero.",
		start: [{
			op: "damage",
			n: 7,
			who: "enemyHero"
		}]
	},
	{
		id: "V066",
		name: "Manic",
		cls: "Neutral",
		kind: "Creature",
		cost: 7,
		atk: 5,
		hp: 4,
		keywords: [],
		text: "Play: Destroy an enemy creature.",
		play: [{ op: "destroyTarget" }]
	},
	{
		id: "V067",
		name: "Wiggles",
		cls: "Wizard",
		kind: "Creature",
		cost: 7,
		atk: 5,
		hp: 5,
		keywords: [],
		text: "End: Deal 5 to the enemy Hero.",
		end: [{
			op: "damage",
			n: 5,
			who: "enemyHero"
		}]
	},
	{
		id: "V068",
		name: "Bamba",
		cls: "Neutral",
		kind: "Creature",
		cost: 8,
		atk: 8,
		hp: 8,
		keywords: [],
		text: "Enemy cannot summon or add from deck.",
		flags: ["lockDeck"]
	},
	{
		id: "V069",
		name: "Bark",
		cls: "Neutral",
		kind: "Creature",
		cost: 6,
		atk: 4,
		hp: 4,
		keywords: [],
		text: "Play: Shuffle a target into its owner's deck.",
		play: [{ op: "shuffleTargetDeck" }]
	},
	{
		id: "V070",
		name: "Barron",
		cls: "Pirate",
		kind: "Creature",
		cost: 8,
		atk: 7,
		hp: 5,
		keywords: [],
		text: "Play: Summon up to two 4-or-less from deck.",
		play: [{
			op: "summonDeck",
			maxCost: 4,
			n: 2
		}]
	},
	{
		id: "V071",
		name: "Gigatron",
		cls: "Neutral",
		kind: "Creature",
		cost: 10,
		atk: 10,
		hp: 10,
		keywords: [],
		text: "Play: Destroy all other cards in play.",
		play: [{ op: "destroyAllOther" }]
	},
	{
		id: "V072",
		name: "Boost",
		cls: "Neutral",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Play: Restore 8 HP.",
		play: [{
			op: "heal",
			n: 8
		}]
	},
	{
		id: "V073",
		name: "Frostbolt",
		cls: "Wizard",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Deal 1, or 3 if you control a Wizard.",
		play: [{
			op: "damage",
			n: 1,
			who: "any"
		}]
	},
	{
		id: "V074",
		name: "Quickdraw",
		cls: "Neutral",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Draw a card.",
		play: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V075",
		name: "Sacrifice",
		cls: "Zombie",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy a friendly creature, draw 2 (3 if Zombie).",
		play: [{ op: "destroyTarget" }, {
			op: "draw",
			n: 2
		}]
	},
	{
		id: "V076",
		name: "Snake Venom",
		cls: "Pirate",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Give a friendly Pirate Poison this turn.",
		play: [{ op: "poisonPirate" }]
	},
	{
		id: "V077",
		name: "Typhoon",
		cls: "Neutral",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy an enemy trap or lasting spell.",
		play: [{ op: "destroyBackrow" }]
	},
	{
		id: "V078",
		name: "Connection",
		cls: "Bow",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Add a Bow creature from deck.",
		play: [{
			op: "addFromDeck",
			kind: "Creature",
			cls: "Bow",
			n: 1
		}]
	},
	{
		id: "V079",
		name: "Cull",
		cls: "Neutral",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy a creature with 3 or less ATK.",
		play: [{
			op: "destroyAtkLte",
			n: 3
		}]
	},
	{
		id: "V080",
		name: "Feast",
		cls: "Crown",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Passive lasting: start of turn heal 2 (4 with Crown).",
		flags: ["lasting", "feast"]
	},
	{
		id: "V081",
		name: "Fireball",
		cls: "Neutral",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Deal 3 to a target.",
		play: [{
			op: "damage",
			n: 3,
			who: "any"
		}]
	},
	{
		id: "V082",
		name: "Haunted House",
		cls: "Zombie",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Lasting: end of turn, trigger Haunts you control.",
		flags: ["lasting", "hauntHouse"]
	},
	{
		id: "V083",
		name: "Love Bomb",
		cls: "Bow",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Restore 6, or 12 if you control a Bow.",
		play: [{
			op: "heal",
			n: 6
		}]
	},
	{
		id: "V084",
		name: "Love Shot",
		cls: "Bow",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Deal 2, or 4 if you control a Bow.",
		play: [{
			op: "damage",
			n: 2,
			who: "any"
		}]
	},
	{
		id: "V085",
		name: "Pact",
		cls: "Zombie",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy a friendly Zombie and an enemy creature.",
		play: [{ op: "destroyTarget" }]
	},
	{
		id: "V086",
		name: "Vanish",
		cls: "Neutral",
		kind: "Spell",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Return a creature to its owner's hand.",
		play: [{ op: "bounce" }]
	},
	{
		id: "V087",
		name: "Airdrop",
		cls: "Neutral",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Draw 2.",
		play: [{
			op: "draw",
			n: 2
		}]
	},
	{
		id: "V088",
		name: "Cauldron",
		cls: "Wizard",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Draw 1, or 3 if you control a Wizard.",
		play: [{
			op: "draw",
			n: 1
		}]
	},
	{
		id: "V089",
		name: "Chum The Water",
		cls: "Pirate",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Lasting: whenever a friendly Pirate dies, draw.",
		flags: ["lasting", "chum"]
	},
	{
		id: "V090",
		name: "Garden",
		cls: "Bow",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Lasting: Bow Play effects trigger twice.",
		flags: ["lasting", "garden"]
	},
	{
		id: "V091",
		name: "Judgement",
		cls: "Crown",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Deal 3, or 6 if you control a Crown.",
		play: [{
			op: "damage",
			n: 3,
			who: "any"
		}]
	},
	{
		id: "V092",
		name: "Meditation",
		cls: "Crown",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Lasting: Crown start effects trigger twice.",
		flags: ["lasting", "meditation"]
	},
	{
		id: "V093",
		name: "Reborn",
		cls: "Zombie",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Summon a Zombie from grave.",
		play: [{
			op: "summonGrave",
			maxCost: 99,
			n: 1,
			cls: "Zombie"
		}]
	},
	{
		id: "V094",
		name: "Scheme",
		cls: "Wizard",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Lasting: Wizard end effects trigger twice.",
		flags: ["lasting", "scheme"]
	},
	{
		id: "V095",
		name: "Spearfish",
		cls: "Pirate",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Bounce a creature, or destroy it if you control a Pirate.",
		play: [{ op: "bounce" }]
	},
	{
		id: "V096",
		name: "Takedown",
		cls: "Neutral",
		kind: "Spell",
		cost: 3,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy a creature with 4+ ATK.",
		play: [{
			op: "destroyAtkGte",
			n: 4
		}]
	},
	{
		id: "V097",
		name: "Swipe",
		cls: "Neutral",
		kind: "Spell",
		cost: 6,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Two creatures fight each other.",
		play: [{ op: "swapAttack" }]
	},
	{
		id: "V098",
		name: "Avenge",
		cls: "Crown",
		kind: "Spell",
		cost: 5,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Summon up to two 3-or-less Crown from grave.",
		play: [{
			op: "summonGrave",
			maxCost: 3,
			n: 2,
			cls: "Crown"
		}]
	},
	{
		id: "V099",
		name: "Booty Raid",
		cls: "Pirate",
		kind: "Spell",
		cost: 5,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Summon up to two 3-or-less Pirates from deck.",
		play: [{
			op: "summonDeck",
			maxCost: 3,
			n: 2,
			cls: "Pirate"
		}]
	},
	{
		id: "V100",
		name: "Siphon",
		cls: "Wizard",
		kind: "Spell",
		cost: 5,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy a creature. Heal 3 if you control a Wizard.",
		play: [{ op: "destroyTarget" }, {
			op: "heal",
			n: 3
		}]
	},
	{
		id: "V101",
		name: "Black Hole",
		cls: "Neutral",
		kind: "Spell",
		cost: 7,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Destroy all creatures.",
		play: [{ op: "destroyAllCreatures" }]
	},
	{
		id: "V109",
		name: "Intel",
		cls: "Neutral",
		kind: "Spell",
		cost: 1,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "Look at the opponent's hand.",
		play: [{ op: "lookHand" }]
	},
	{
		id: "V102",
		name: "Ambush",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When an enemy creature attacks, negate and destroy it.",
		trap: {
			trigger: "enemyAttack",
			fx: [{ op: "negateAttackDestroy" }]
		}
	},
	{
		id: "V103",
		name: "Blast",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When they would damage your Hero, reflect it.",
		trap: {
			trigger: "heroDamage",
			fx: [{ op: "reflectHeroDamage" }]
		}
	},
	{
		id: "V104",
		name: "Counterspell",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When the enemy plays a spell, negate it.",
		trap: {
			trigger: "enemySpell",
			fx: [{ op: "negateSpell" }]
		}
	},
	{
		id: "V105",
		name: "Divine Shield",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When they would destroy a friendly creature, negate it.",
		trap: {
			trigger: "friendlyDestroy",
			fx: [{ op: "saveCreature" }]
		}
	},
	{
		id: "V106",
		name: "Frost Lock",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When your Hero takes fatal damage, negate and become immune this turn.",
		trap: {
			trigger: "fatalHero",
			fx: [{ op: "negateFatalImmune" }]
		}
	},
	{
		id: "V107",
		name: "Landmine",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When they summon, destroy all creatures.",
		trap: {
			trigger: "enemySummon",
			fx: [{ op: "boardWipeOnSummon" }]
		}
	},
	{
		id: "V108",
		name: "Pitfall",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When they summon a 4+ ATK creature, destroy it.",
		trap: {
			trigger: "enemySummonAtk4",
			fx: [{ op: "destroyHighSummon" }]
		}
	},
	{
		id: "V110",
		name: "Spring Trap",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "When they summon, bounce it to hand.",
		trap: {
			trigger: "enemySummon",
			fx: [{ op: "bounceSummon" }]
		}
	},
	{
		id: "V111",
		name: "Tidal Wave",
		cls: "Neutral",
		kind: "Trap",
		cost: 2,
		atk: 0,
		hp: 0,
		keywords: [],
		text: "After an enemy creature attacks your Hero, destroy all creatures.",
		trap: {
			trigger: "afterFaceAttack",
			fx: [{ op: "wipeAfterFace" }]
		}
	}
];
var LEGAL_POOL = CARDS.filter((c) => !c.banned);
var CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));
function defOf(id) {
	return CARD_BY_ID[id] ?? {
		id,
		name: "Unknown",
		cls: "Neutral",
		kind: "Creature",
		cost: 0,
		atk: 0,
		hp: 1,
		keywords: [],
		text: ""
	};
}
var KEYWORDS = [
	{
		name: "Taunt",
		text: "Attacks must hit a Taunt first. Face and non-Taunt are closed."
	},
	{
		name: "Rush",
		text: "May attack creatures the turn it is played. Never the Hero that turn."
	},
	{
		name: "Poison",
		text: "Destroys the creature it fights even if ATK is lower. Does not ignore Hero HP."
	},
	{
		name: "Fury",
		text: "May attack twice per turn when ready."
	},
	{
		name: "Frozen",
		text: "Cannot attack. Lasts through the controller's next turn, then wears off."
	}
];
var RULES_TEXT = [
	{
		title: "Win",
		body: "Reduce the enemy Hero to 0 HP. Both 0 at once is a draw. Creatures have no life total that wins the game."
	},
	{
		title: "Open",
		body: "40 HP, 40-card deck, max 3 copies. Draw 4. Return every 5+ cost opener, shuffle, replace. Second player takes the Coin."
	},
	{
		title: "Mana",
		body: "Cap +1 each turn (max 10), refill to cap. Unspent mana does not bank. Coin pays +1 on one play and does not raise the cap."
	},
	{
		title: "Board",
		body: "Five creature lanes, one body each. Empty lanes stay empty. Five back-row slots for traps and lasting spells. Hand cap 10."
	},
	{
		title: "Kill-gate",
		body: "Creature fights are legal only if someone dies: ATK ≥ current HP, Poison, or a suicide trade. No chip. Stacking attackers is allowed. Heroes take numbered chip damage."
	},
	{
		title: "Traps",
		body: "Set face-down. Cannot spring the turn they are set. Next turn you may Spring or Hold when the trigger fires. Counters resolve left to right."
	},
	{
		title: "Fatigue",
		body: "Empty deck: 1, then 2, then 3… to the Hero each draw."
	}
];
var NAMES = CARDS.map((c) => c.name).sort((a, b) => b.length - a.length);
var BUTTONS = [
	"End Turn",
	"YOUR TURN",
	"New Game",
	"Resume",
	"Confirm",
	"Cancel",
	"Play Again",
	"Change decks",
	"Vs Bot",
	"Vs Pack",
	"Tutorial",
	"Hot Pack",
	"Graveyard",
	"How to Play",
	"Leaderboard",
	"Sign in"
];
function parseSight(raw) {
	const text = raw.replace(/\s+/g, " ").trim();
	const upper = text.toUpperCase();
	const turn = /YOUR TURN/.test(upper) ? "you" : /OPPONENT|ENEMY TURN/.test(upper) ? "opp" : "unknown";
	const hps = [...text.matchAll(/(\d{1,2})\s*\/\s*40/g)].map((m) => parseInt(m[1], 10));
	const youHP = hps[0] ?? null;
	const oppHP = hps[1] ?? null;
	const labels = BUTTONS.filter((b) => upper.includes(b.toUpperCase()));
	const cards = NAMES.filter((n) => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));
	const keywords = [
		"Taunt",
		"Rush",
		"Poison",
		"Fury",
		"Frozen"
	].filter((k) => new RegExp(`\\b${k}\\b`, "i").test(text));
	const bits = [];
	if (turn === "you") bits.push("It is your turn.");
	if (turn === "opp") bits.push("Opponent is acting — plan, do not click.");
	if (keywords.includes("Taunt")) bits.push("Taunt is visible — do not hit face.");
	if (keywords.includes("Rush")) bits.push("Rush cannot hit the Hero the turn it enters.");
	if (!bits.length) bits.push("Keep sharing the play tab. Pack Watch is reading labels and card names.");
	return {
		turn,
		youHP,
		oppHP,
		labels,
		cards: [...new Set(cards)].slice(0, 24),
		keywords,
		raw: text.slice(0, 2e3),
		advice: bits.join(" ")
	};
}
var seq = 1;
function uid() {
	seq += 1;
	return `c${seq}`;
}
function learn(g, kind, label, detail) {
	g.events.unshift({
		t: Date.now(),
		kind,
		label,
		detail
	});
	if (g.events.length > 400) g.events.length = 400;
}
function log(g, line) {
	g.log.unshift(line);
	if (g.log.length > 80) g.log.length = 80;
}
function fisher(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}
function mint(def) {
	return {
		uid: uid(),
		defId: def.id,
		atk: def.atk,
		hp: def.hp,
		maxHp: def.hp,
		exhausted: false,
		attacksLeft: 0,
		enteredThisTurn: false,
		frozenTurns: 0,
		poisonUntilEnd: false,
		faceDown: def.kind === "Trap",
		setThisTurn: false
	};
}
function emptyPlayer(id, list) {
	const deck = list.map(mint);
	fisher(deck);
	return {
		id,
		hp: 40,
		mana: 0,
		manaCap: 0,
		coin: false,
		deck,
		hand: [],
		grave: [],
		lanes: [
			null,
			null,
			null,
			null,
			null
		],
		back: [
			null,
			null,
			null,
			null,
			null
		],
		immuneHero: false,
		fatigue: 0
	};
}
function cardName(inst) {
	if (!inst) return "empty";
	return defOf(inst.defId).name;
}
function hasClass(p, cls) {
	return p.lanes.some((c) => {
		if (!c) return false;
		const d = defOf(c.defId);
		return d.cls === cls || d.cls === "All" || d.flags?.includes("allClass");
	});
}
function emptyLane(p) {
	return p.lanes.findIndex((l) => !l);
}
function emptyBack(p) {
	return p.back.findIndex((l) => !l);
}
function enemyOf(g, id) {
	return id === "you" ? g.bot : g.you;
}
function meOf(g, id) {
	return id === "you" ? g.you : g.bot;
}
function hasTaunt(p) {
	return p.lanes.some((c, i) => c && effectiveKeywords(p, i).includes("Taunt"));
}
function effectiveKeywords(p, lane) {
	const c = p.lanes[lane];
	if (!c) return [];
	const k = [...defOf(c.defId).keywords];
	if (c.poisonUntilEnd && !k.includes("Poison")) k.push("Poison");
	p.lanes.forEach((n, i) => {
		if (!n || Math.abs(i - lane) !== 1) return;
		const d = defOf(n.defId);
		if (d.flags?.includes("adjTaunt") && !k.includes("Taunt")) k.push("Taunt");
		if (d.flags?.includes("adjRush") && !k.includes("Rush")) k.push("Rush");
	});
	return k;
}
function effectiveAtk(p, lane) {
	const c = p.lanes[lane];
	if (!c) return 0;
	let atk = c.atk;
	if (defOf(c.defId).flags?.includes("stumpBuff") && p.lanes.filter(Boolean).length > 1) atk += 2;
	return atk;
}
function drawOne(g, p, extra = false) {
	if (p.hand.length >= 10) {
		log(g, `${p.id} hand is full — extra draw burns.`);
		return;
	}
	if (p.deck.length === 0) {
		p.fatigue += 1;
		damageHero(g, p, p.fatigue, "fatigue");
		log(g, `${p.id} fatigue ${p.fatigue}.`);
		return;
	}
	const c = p.deck.shift();
	p.hand.push(c);
	if (extra) {
		const opp = enemyOf(g, p.id);
		opp.lanes.forEach((n) => {
			if (n && defOf(n.defId).flags?.includes("punishExtraDraw")) drawOne(g, opp, false);
		});
	}
}
function damageHero(g, target, n, src) {
	if (n <= 0) return;
	if (target.immuneHero || target.lanes.some((c) => c && defOf(c.defId).flags?.includes("heroImmune"))) {
		log(g, `${target.id} Hero is immune — ${src} blocked.`);
		return;
	}
	if (springTraps(g, enemyOf(g, target.id), target.id === g.turn ? "waiting" : "active", "heroDamage") === "reflect") {
		const srcP = enemyOf(g, target.id);
		srcP.hp = Math.max(0, srcP.hp - n);
		log(g, `Blast reflects ${n} to ${srcP.id}.`);
		checkWin(g);
		return;
	}
	if (target.hp - n <= 0) {
		if (springTraps(g, target, "self", "fatalHero") === "immune") {
			target.immuneHero = true;
			log(g, `Frost Lock saves ${target.id}.`);
			return;
		}
	}
	target.hp = Math.max(0, target.hp - n);
	log(g, `${src} deals ${n} to ${target.id} Hero (${target.hp}).`);
	checkWin(g);
}
function healHero(g, p, n) {
	if (enemyOf(g, p.id).lanes.some((c) => c && defOf(c.defId).flags?.includes("antiHeal"))) {
		log(g, `Plague blocks healing.`);
		return;
	}
	p.hp = Math.min(40, p.hp + n);
	log(g, `${p.id} heals ${n} (${p.hp}).`);
}
function killCreature(g, owner, lane, reason) {
	const c = owner.lanes[lane];
	if (!c) return;
	if (springTraps(g, owner, "self", "friendlyDestroy") === "save") {
		log(g, `Divine Shield saves ${cardName(c)}.`);
		return;
	}
	owner.lanes[lane] = null;
	owner.grave.unshift(c);
	const d = defOf(c.defId);
	log(g, `${cardName(c)} dies (${reason}).`);
	learn(g, "card", d.name, `Died in ${owner.id} lane ${lane + 1}: ${reason}`);
	if (d.haunt) runEffects(g, owner, d.haunt, c);
	owner.lanes.forEach((n, i) => {
		if (n && Math.abs(i - lane) === 1 && defOf(n.defId).flags?.includes("adjDeathDraw")) drawOne(g, owner, true);
	});
	if (owner.back.some((b) => b && defOf(b.defId).flags?.includes("chum")) && d.cls === "Pirate") drawOne(g, owner, true);
	owner.lanes.forEach((n) => {
		if (n && defOf(n.defId).flags?.includes("deathFace2")) damageHero(g, enemyOf(g, owner.id), 2, cardName(n));
	});
}
function springTraps(g, owner, _side, trigger) {
	let result = null;
	owner.back.forEach((t, i) => {
		if (!t || t.setThisTurn) return;
		const d = defOf(t.defId);
		if (d.kind !== "Trap" || !d.trap) return;
		if (d.trap.trigger !== trigger) return;
		log(g, `${owner.id} springs ${d.name}.`);
		learn(g, "effect", d.name, `Trap ${d.trap.trigger}`);
		owner.back[i] = null;
		owner.grave.unshift(t);
		for (const fx of d.trap.fx) {
			if (fx.op === "negateAttackDestroy") result = "negateAttack";
			if (fx.op === "reflectHeroDamage") result = "reflect";
			if (fx.op === "negateSpell") result = "negateSpell";
			if (fx.op === "saveCreature") result = "save";
			if (fx.op === "negateFatalImmune") result = "immune";
			if (fx.op === "boardWipeOnSummon") result = "wipe";
			if (fx.op === "bounceSummon") result = "bounceSummon";
			if (fx.op === "destroyHighSummon") result = "killHigh";
			if (fx.op === "wipeAfterFace") result = "wipeFace";
		}
	});
	return result;
}
function firstEmpty(p) {
	return p.lanes.findIndex((x) => !x);
}
function runEffects(g, owner, fxs, source) {
	const opp = enemyOf(g, owner.id);
	for (const fx of fxs) {
		switch (fx.op) {
			case "draw":
				for (let i = 0; i < fx.n; i++) drawOne(g, owner, true);
				break;
			case "damage":
				if (fx.who === "enemyHero") damageHero(g, opp, scaledDamage(owner, source, fx.n), cardName(source));
				else if (fx.who === "selfHero") damageHero(g, owner, fx.n, cardName(source));
				else {
					const t = firstEnemyCreature(opp) ?? null;
					if (t) {
						const lane = opp.lanes.findIndex((x) => x?.uid === t.uid);
						t.hp -= scaledDamage(owner, source, fx.n);
						if (t.hp <= 0) killCreature(g, opp, lane, cardName(source));
					} else damageHero(g, opp, scaledDamage(owner, source, fx.n), cardName(source));
				}
				break;
			case "heal":
				healHero(g, owner, scaledHeal(owner, source, fx.n));
				break;
			case "destroyAllCreatures":
				wipeCreatures(g);
				break;
			case "destroyAllOther":
				wipeCreatures(g, source.uid);
				owner.back.forEach((_, i) => {
					const b = owner.back[i];
					if (b && b.uid !== source.uid) {
						owner.grave.unshift(b);
						owner.back[i] = null;
					}
				});
				opp.back.forEach((_, i) => {
					const b = opp.back[i];
					if (b) {
						opp.grave.unshift(b);
						opp.back[i] = null;
					}
				});
				break;
			case "destroyBackrow": {
				const idx = opp.back.findIndex(Boolean);
				if (idx >= 0) {
					const b = opp.back[idx];
					opp.grave.unshift(b);
					opp.back[idx] = null;
					log(g, `Back row ${cardName(b)} destroyed.`);
				}
				break;
			}
			case "bounce": {
				const idx = opp.lanes.findIndex(Boolean);
				if (idx >= 0) {
					const c = opp.lanes[idx];
					opp.lanes[idx] = null;
					if (hasClass(owner, "Pirate") && defOf(source.defId).id === "V095") {
						opp.grave.unshift(c);
						log(g, `Spearfish destroys ${cardName(c)}.`);
					} else {
						opp.hand.push(c);
						log(g, `${cardName(c)} bounced.`);
					}
				}
				break;
			}
			case "poisonPirate": {
				const idx = owner.lanes.findIndex((c) => c && (defOf(c.defId).cls === "Pirate" || defOf(c.defId).cls === "All"));
				if (idx >= 0) {
					owner.lanes[idx].poisonUntilEnd = true;
					log(g, `${cardName(owner.lanes[idx])} gains Poison this turn.`);
				}
				break;
			}
			case "lookHand":
				log(g, `Intel: ${opp.hand.map(cardName).join(", ") || "empty"}.`);
				break;
			case "millCreature": {
				const i = owner.deck.findIndex((c) => defOf(c.defId).kind === "Creature");
				if (i >= 0) {
					const [c] = owner.deck.splice(i, 1);
					owner.grave.unshift(c);
					log(g, `Milled ${cardName(c)}.`);
				}
				break;
			}
			case "shuffleHandRedraw": {
				const n = owner.hand.length;
				owner.deck.push(...owner.hand);
				owner.hand = [];
				fisher(owner.deck);
				for (let i = 0; i < n; i++) drawOne(g, owner, true);
				break;
			}
			case "banishGrave": {
				const pile = opp.grave.length ? opp.grave : owner.grave;
				if (pile.length) log(g, `Banished ${cardName(pile.shift())}.`);
				break;
			}
			case "addFromDeck": {
				let added = 0;
				for (let i = 0; i < owner.deck.length && added < fx.n; i++) {
					const d = defOf(owner.deck[i].defId);
					const kindOk = fx.kind === "any" || d.kind === fx.kind;
					const clsOk = !fx.cls || d.cls === fx.cls || d.cls === "All";
					if (kindOk && clsOk) {
						const [c] = owner.deck.splice(i, 1);
						owner.hand.push(c);
						added += 1;
						i -= 1;
						log(g, `Added ${cardName(c)} from deck.`);
					}
				}
				break;
			}
			case "addFromGrave": {
				let added = 0;
				for (let i = 0; i < owner.grave.length && added < fx.n; i++) {
					const d = defOf(owner.grave[i].defId);
					if (fx.kind !== "any" && d.kind !== fx.kind) continue;
					const [c] = owner.grave.splice(i, 1);
					owner.hand.push(c);
					added += 1;
					i -= 1;
					log(g, `Returned ${cardName(c)} from grave.`);
				}
				break;
			}
			case "summonGrave":
				summonFrom(g, owner, owner.grave, fx.maxCost, fx.n, fx.cls);
				break;
			case "summonDeck":
				summonFrom(g, owner, owner.deck, fx.maxCost, fx.n, fx.cls);
				break;
			case "summonCopies": {
				const name = defOf(source.defId).name;
				for (let i = 0; i < owner.deck.length; i++) {
					if (defOf(owner.deck[i].defId).name !== name) continue;
					const lane = firstEmpty(owner);
					if (lane < 0) break;
					const [c] = owner.deck.splice(i, 1);
					c.enteredThisTurn = true;
					owner.lanes[lane] = c;
					i -= 1;
					log(g, `Yang copies ${name} into L${lane + 1}.`);
				}
				break;
			}
			case "hauntAllOthers":
				owner.lanes.forEach((c) => {
					if (!c || c.uid === source.uid) return;
					const hd = defOf(c.defId);
					if (hd.haunt) runEffects(g, owner, hd.haunt, c);
				});
				break;
			case "destroyTaunt": {
				const idx = opp.lanes.findIndex((c, i) => c && effectiveKeywords(opp, i).includes("Taunt"));
				if (idx >= 0) killCreature(g, opp, idx, "Turbo");
				break;
			}
			case "destroyAtkLte": {
				const idx = opp.lanes.findIndex((c) => c && c.atk <= fx.n);
				if (idx >= 0) killCreature(g, opp, idx, "Cull");
				break;
			}
			case "destroyAtkGte": {
				const idx = opp.lanes.findIndex((c) => c && c.atk >= fx.n);
				if (idx >= 0) killCreature(g, opp, idx, "Takedown");
				break;
			}
			case "destroyTarget": {
				const idx = opp.lanes.findIndex(Boolean);
				if (idx >= 0) killCreature(g, opp, idx, cardName(source));
				break;
			}
			case "shuffleTargetDeck": {
				const idx = opp.lanes.findIndex(Boolean);
				if (idx >= 0) {
					const c = opp.lanes[idx];
					opp.lanes[idx] = null;
					opp.deck.push(c);
					fisher(opp.deck);
					log(g, `${cardName(c)} shuffled into deck.`);
				}
				break;
			}
		}
		learn(g, "effect", defOf(source.defId).name, fx.op);
	}
}
function scaledDamage(owner, source, n) {
	const id = defOf(source.defId).id;
	if (id === "V073" && hasClass(owner, "Wizard")) return 3;
	if (id === "V084" && hasClass(owner, "Bow")) return 4;
	if (id === "V091" && hasClass(owner, "Crown")) return 6;
	return n;
}
function scaledHeal(owner, source, n) {
	const id = defOf(source.defId).id;
	if (id === "V083" && hasClass(owner, "Bow")) return 12;
	if (id === "V088" && hasClass(owner, "Wizard")) return n;
	return n;
}
function firstEnemyCreature(p) {
	return p.lanes.find(Boolean) ?? null;
}
function wipeCreatures(g, exceptUid) {
	for (const p of [g.you, g.bot]) p.lanes.forEach((c, i) => {
		if (c && c.uid !== exceptUid) killCreature(g, p, i, "board wipe");
	});
}
function summonFrom(g, owner, pile, maxCost, n, cls) {
	let placed = 0;
	for (let i = 0; i < pile.length && placed < n; i++) {
		const d = defOf(pile[i].defId);
		if (d.kind !== "Creature" || d.cost > maxCost) continue;
		if (cls && d.cls !== cls && d.cls !== "All") continue;
		const lane = firstEmpty(owner);
		if (lane < 0) break;
		const [c] = pile.splice(i, 1);
		c.enteredThisTurn = true;
		c.attacksLeft = 0;
		owner.lanes[lane] = c;
		placed += 1;
		i -= 1;
		log(g, `Summoned ${d.name} to L${lane + 1}.`);
	}
}
function checkWin(g) {
	if (g.you.hp <= 0 && g.bot.hp <= 0) {
		g.winner = "draw";
		g.phase = "gameover";
	} else if (g.bot.hp <= 0) {
		g.winner = "you";
		g.phase = "gameover";
	} else if (g.you.hp <= 0) {
		g.winner = "bot";
		g.phase = "gameover";
	}
}
function buildList(prefer) {
	const pool = LEGAL_POOL.filter((c) => prefer.includes(c.cls) || c.cls === "Neutral" || c.cls === "All");
	const out = [];
	const count = {};
	const cheap = [...pool].sort((a, b) => a.cost - b.cost);
	for (const c of cheap) {
		if (out.length >= 40) break;
		const n = count[c.id] ?? 0;
		if (n >= 3) continue;
		out.push(c);
		count[c.id] = n + 1;
	}
	while (out.length < 40) {
		const c = pool[out.length % Math.max(pool.length, 1)];
		if (!c) break;
		out.push(c);
	}
	return out.slice(0, 40);
}
function newGame() {
	seq = 1;
	const you = emptyPlayer("you", buildList(["Pirate", "Neutral"]));
	const bot = emptyPlayer("bot", buildList(["Crown", "Wizard"]));
	const first = "you";
	bot.coin = true;
	const g = {
		you,
		bot,
		turn: first,
		turnNo: 1,
		phase: "main",
		winner: null,
		selectedUid: null,
		pending: null,
		log: [],
		events: []
	};
	for (const p of [you, bot]) {
		for (let i = 0; i < 4; i++) drawOne(g, p);
		const keep = [];
		const back = [];
		for (const c of p.hand) if (defOf(c.defId).cost >= 5) back.push(c);
		else keep.push(c);
		p.hand = keep;
		p.deck.push(...back);
		fisher(p.deck);
		for (let i = 0; i < back.length; i++) drawOne(g, p);
	}
	startTurn(g, first);
	log(g, `Match start. ${first} goes first. Second player holds the Coin.`);
	learn(g, "rule", "Match", "Practice table watching every click.");
	return g;
}
function readyAttacks(c, kws) {
	if (c.frozenTurns > 0) return 0;
	return kws.includes("Fury") ? 2 : 1;
}
function startTurn(g, who) {
	const p = meOf(g, who);
	p.manaCap = Math.min(10, p.manaCap + 1);
	p.mana = p.manaCap;
	p.immuneHero = false;
	p.lanes.forEach((c) => {
		if (!c) return;
		c.enteredThisTurn = false;
		c.poisonUntilEnd = false;
		if (c.frozenTurns > 0) c.frozenTurns -= 1;
		const lane = p.lanes.indexOf(c);
		c.attacksLeft = readyAttacks(c, effectiveKeywords(p, lane));
		c.exhausted = c.attacksLeft <= 0;
	});
	p.back.forEach((t) => {
		if (t) t.setThisTurn = false;
	});
	drawOne(g, p);
	p.lanes.forEach((c, i) => {
		if (!c) return;
		const d = defOf(c.defId);
		if (d.start) runEffects(g, p, d.start, c);
		if (p.back.some((b) => b && defOf(b.defId).flags?.includes("feast")) && i === 0) healHero(g, p, hasClass(p, "Crown") ? 4 : 2);
	});
	g.turn = who;
	g.phase = g.winner ? "gameover" : "main";
	g.selectedUid = null;
	g.pending = null;
}
function endTurn(g) {
	if (g.phase === "gameover") return g;
	const p = meOf(g, g.turn);
	p.lanes.forEach((c) => {
		if (!c) return;
		const d = defOf(c.defId);
		if (d.end) runEffects(g, p, d.end, c);
		if (d.flags?.includes("adjHauntEnd")) {
			const i = p.lanes.indexOf(c);
			[i - 1, i + 1].forEach((n) => {
				const adj = p.lanes[n];
				if (adj) {
					const hd = defOf(adj.defId);
					if (hd.haunt) runEffects(g, p, hd.haunt, adj);
				}
			});
		}
	});
	if (p.back.some((b) => b && defOf(b.defId).flags?.includes("hauntHouse"))) p.lanes.forEach((c) => {
		if (!c) return;
		const d = defOf(c.defId);
		if (d.haunt && (d.cls === "Zombie" || d.cls === "All")) runEffects(g, p, d.haunt, c);
	});
	const next = g.turn === "you" ? "bot" : "you";
	if (next === "you") g.turnNo += 1;
	startTurn(g, next);
	log(g, `${next}'s turn ${g.turnNo}. Mana ${meOf(g, next).mana}/${meOf(g, next).manaCap}.`);
	learn(g, "control", "End Turn", `${p.id} passed.`);
	if (g.turn === "bot" && !g.winner) botAct(g);
	return g;
}
function playFromHand(g, uidStr, lane) {
	if (g.phase === "gameover" || g.turn !== "you") return g;
	const p = g.you;
	const idx = p.hand.findIndex((c) => c.uid === uidStr);
	if (idx < 0) return g;
	const inst = p.hand[idx];
	const d = defOf(inst.defId);
	let cost = d.cost;
	if (p.mana < cost && p.coin && p.mana + 1 >= cost) {
		p.coin = false;
		p.mana += 1;
		log(g, "Coin spent for +1 mana.");
		learn(g, "rule", "Coin", "Second-player Coin spent.");
	}
	if (p.mana < cost) {
		learn(g, "illegal", d.name, "Not enough mana. Mana does not bank.");
		log(g, `Illegal: need ${cost} mana.`);
		return g;
	}
	if (d.kind === "Creature") {
		const slot = lane ?? emptyLane(p);
		if (slot < 0) {
			learn(g, "illegal", d.name, "No empty lane. Lanes do not slide.");
			return g;
		}
		const sprung = springTraps(g, g.bot, "opp", "enemySummon");
		p.mana -= cost;
		p.hand.splice(idx, 1);
		inst.enteredThisTurn = true;
		inst.attacksLeft = 0;
		p.lanes[slot] = inst;
		if (sprung === "wipe") wipeCreatures(g);
		else if (sprung === "bounceSummon") {
			p.lanes[slot] = null;
			p.hand.push(inst);
			log(g, "Spring Trap bounced the summon.");
		} else if (sprung === "killHigh" && inst.atk >= 4) killCreature(g, p, slot, "Pitfall");
		else {
			if (d.play) runEffects(g, p, d.play, inst);
			log(g, `Played ${d.name} on L${slot + 1}.`);
			learn(g, "card", d.name, `Summoned to lane ${slot + 1}`);
		}
		return g;
	}
	if (d.kind === "Trap") {
		const slot = emptyBack(p);
		if (slot < 0) {
			learn(g, "illegal", d.name, "Back row full.");
			return g;
		}
		p.mana -= cost;
		p.hand.splice(idx, 1);
		inst.setThisTurn = true;
		inst.faceDown = true;
		p.back[slot] = inst;
		log(g, `Set ${d.name}. Cannot spring this turn.`);
		learn(g, "card", d.name, "Trap set — Hold until next turn.");
		return g;
	}
	const sprung = springTraps(g, g.bot, "opp", "enemySpell");
	p.mana -= cost;
	p.hand.splice(idx, 1);
	if (sprung === "negateSpell") {
		p.grave.unshift(inst);
		log(g, `Counterspell negated ${d.name}.`);
		return g;
	}
	if (d.flags?.includes("lasting")) {
		const slot = emptyBack(p);
		if (slot >= 0) {
			inst.faceDown = false;
			p.back[slot] = inst;
		} else p.grave.unshift(inst);
	} else p.grave.unshift(inst);
	if (d.play) runEffects(g, p, d.play, inst);
	log(g, `Cast ${d.name}.`);
	learn(g, "card", d.name, d.text);
	return g;
}
function canAttackCreature(g, fromLane, toLane) {
	const atk = g.you.lanes[fromLane];
	const def = g.bot.lanes[toLane];
	if (!atk) return {
		ok: false,
		why: "Empty lane."
	};
	if (!def) return {
		ok: false,
		why: "No defender."
	};
	if (g.turn !== "you") return {
		ok: false,
		why: "Not your turn."
	};
	if (atk.attacksLeft <= 0) return {
		ok: false,
		why: "Already spent / summoning sickness."
	};
	if (atk.frozenTurns > 0) return {
		ok: false,
		why: "Frozen."
	};
	const kws = effectiveKeywords(g.you, fromLane);
	if (hasTaunt(g.bot) && !effectiveKeywords(g.bot, toLane).includes("Taunt")) return {
		ok: false,
		why: "Taunt is up — must attack a Taunt."
	};
	const a = effectiveAtk(g.you, fromLane) + (kws.includes("Poison") ? 99 : 0);
	const suicide = def.atk >= atk.hp;
	if (!(a >= def.hp || kws.includes("Poison") || suicide)) return {
		ok: false,
		why: "Kill-gate: nobody would die. No chip."
	};
	return {
		ok: true,
		why: "Legal fight."
	};
}
function canAttackHero(g, fromLane) {
	const atk = g.you.lanes[fromLane];
	if (!atk) return {
		ok: false,
		why: "Empty lane."
	};
	if (atk.attacksLeft <= 0) return {
		ok: false,
		why: "Not ready."
	};
	if (hasTaunt(g.bot)) return {
		ok: false,
		why: "Taunt closes face."
	};
	if (atk.enteredThisTurn) return {
		ok: false,
		why: "Cannot hit the Hero the turn a creature is played, even with Rush."
	};
	return {
		ok: true,
		why: "Legal face hit."
	};
}
function attackCreature(g, fromLane, toLane) {
	const chk = canAttackCreature(g, fromLane, toLane);
	if (!chk.ok) {
		learn(g, "illegal", "Attack", chk.why);
		log(g, `Illegal attack: ${chk.why}`);
		return g;
	}
	const sprung = springTraps(g, g.bot, "opp", "enemyAttack");
	const atk = g.you.lanes[fromLane];
	if (sprung === "negateAttack") {
		killCreature(g, g.you, fromLane, "Ambush");
		return g;
	}
	const def = g.bot.lanes[toLane];
	const kws = effectiveKeywords(g.you, fromLane);
	const a = effectiveAtk(g.you, fromLane);
	atk.attacksLeft -= 1;
	if (kws.includes("Poison") || a >= def.hp) killCreature(g, g.bot, toLane, cardName(atk));
	if (def.atk >= atk.hp) killCreature(g, g.you, fromLane, "counter");
	log(g, `${cardName(atk)} fights ${cardName(def)}.`);
	learn(g, "rule", "Kill-gate", `${cardName(atk)} vs ${cardName(def)}`);
	return g;
}
function attackHero(g, fromLane) {
	const chk = canAttackHero(g, fromLane);
	if (!chk.ok) {
		learn(g, "illegal", "Face", chk.why);
		log(g, `Illegal: ${chk.why}`);
		return g;
	}
	if (springTraps(g, g.bot, "opp", "enemyAttack") === "negateAttack") {
		killCreature(g, g.you, fromLane, "Ambush");
		return g;
	}
	const atk = g.you.lanes[fromLane];
	const dmg = effectiveAtk(g.you, fromLane);
	atk.attacksLeft -= 1;
	damageHero(g, g.bot, dmg, cardName(atk));
	if (springTraps(g, g.bot, "opp", "afterFaceAttack") === "wipeFace") wipeCreatures(g);
	return g;
}
function botAct(g) {
	const p = g.bot;
	const plays = [...p.hand].sort((a, b) => defOf(a.defId).cost - defOf(b.defId).cost);
	for (const c of plays) {
		const d = defOf(c.defId);
		if (p.mana < d.cost) continue;
		if (d.kind === "Creature" && emptyLane(p) >= 0) {
			p.mana -= d.cost;
			p.hand.splice(p.hand.indexOf(c), 1);
			const lane = emptyLane(p);
			c.enteredThisTurn = true;
			c.attacksLeft = 0;
			p.lanes[lane] = c;
			if (d.play) runEffects(g, p, d.play, c);
			log(g, `Bot played ${d.name}.`);
			learn(g, "card", d.name, "Bot summon");
		} else if (d.kind === "Trap" && emptyBack(p) >= 0) {
			p.mana -= d.cost;
			p.hand.splice(p.hand.indexOf(c), 1);
			c.setThisTurn = true;
			p.back[emptyBack(p)] = c;
			log(g, `Bot set a trap.`);
		} else if (d.kind === "Spell" && d.cost <= p.mana && !d.flags?.includes("lasting")) {
			p.mana -= d.cost;
			p.hand.splice(p.hand.indexOf(c), 1);
			p.grave.unshift(c);
			if (d.play) runEffects(g, p, d.play, c);
			log(g, `Bot cast ${d.name}.`);
		}
	}
	p.lanes.forEach((c, i) => {
		if (!c || c.attacksLeft <= 0 || g.winner) return;
		if (!hasTaunt(g.you) && !c.enteredThisTurn) {
			const dmg = effectiveAtk(p, i);
			c.attacksLeft = 0;
			damageHero(g, g.you, dmg, cardName(c));
			return;
		}
		const tIdx = g.you.lanes.findIndex((t, j) => t && canBotKill(p, i, g.you, j));
		if (tIdx >= 0) {
			const def = g.you.lanes[tIdx];
			const a = effectiveAtk(p, i);
			const kws = effectiveKeywords(p, i);
			c.attacksLeft = 0;
			if (kws.includes("Poison") || a >= def.hp) killCreature(g, g.you, tIdx, cardName(c));
			if (def.atk >= c.hp) killCreature(g, p, i, "counter");
		}
	});
	if (!g.winner) {
		const next = "you";
		p.lanes.forEach((c) => {
			if (c) {
				const d = defOf(c.defId);
				if (d.end) runEffects(g, p, d.end, c);
			}
		});
		g.turnNo += 1;
		startTurn(g, next);
		log(g, `Your turn ${g.turnNo}.`);
	}
}
function canBotKill(atkP, from, defP, to) {
	const atk = atkP.lanes[from];
	const def = defP.lanes[to];
	if (hasTaunt(defP) && !effectiveKeywords(defP, to).includes("Taunt")) return false;
	const a = effectiveAtk(atkP, from);
	return effectiveKeywords(atkP, from).includes("Poison") || a >= def.hp || def.atk >= atk.hp;
}
var FIVE = [
	"Do not swing into Taunt.",
	"Spend the mana — it does not bank.",
	"Do not spring a trap the turn you set it.",
	"Empty lanes stay empty. Place on purpose.",
	"Only take kill-gate fights (or Poison / a stack)."
];
function followSkill(g, lessons) {
	if (g.winner === "you") return {
		now: "You won. Log what they did that died.",
		why: "Hero 0.",
		dont: [],
		legal: []
	};
	if (g.winner === "bot") return {
		now: "Defeat. The lesson is on the board you left open.",
		why: "Your Hero 0.",
		dont: FIVE,
		legal: []
	};
	if (g.winner === "draw") return {
		now: "Draw. Both Heroes hit 0 together.",
		why: "",
		dont: [],
		legal: []
	};
	if (g.turn !== "you") return {
		now: "Their turn. Plan the crack. Do not click.",
		why: "Wait.",
		dont: FIVE,
		legal: []
	};
	const taunt = g.bot.lanes.some((c, i) => c && effectiveKeywords(g.bot, i).includes("Taunt"));
	const playable = g.you.hand.filter((c) => defOf(c.defId).cost <= g.you.mana);
	const empty = g.you.lanes.filter((x) => !x).length;
	const legal = [];
	const dont = [...FIVE];
	g.you.lanes.forEach((c, i) => {
		if (!c) return;
		if (c.enteredThisTurn) dont.unshift(`${defOf(c.defId).name} just entered — Rush hits bodies, never the Hero.`);
		if (canAttackHero(g, i).ok) legal.push(`L${i + 1} ${defOf(c.defId).name} can chip face for ${c.atk}.`);
		g.bot.lanes.forEach((d, j) => {
			if (!d) return;
			if (canAttackCreature(g, i, j).ok) legal.push(`L${i + 1} kill-gates ${defOf(d.defId).name}.`);
		});
	});
	if (empty && playable.some((c) => defOf(c.defId).kind === "Creature")) legal.push("Drop a creature on an empty lane.");
	const hits = lessons.filter((l) => {
		if (l.kind === "taunt" && taunt) return true;
		if (l.kind === "mana" && playable.length) return true;
		if (l.kind === "trap" && playable.some((c) => defOf(c.defId).kind === "Trap")) return true;
		if (l.kind === "lane" && empty === 0) return true;
		if (l.kind === "trade" || l.kind === "killgate") return true;
		if (l.kind === "rush" && g.you.lanes.some((c) => c?.enteredThisTurn)) return true;
		return false;
	});
	let now = "Spend the mana. Develop, then only legal fights.";
	if (taunt) now = "Crack Taunt first. You cannot win through a wall.";
	else if (g.bot.hp <= 10 && legal.some((l) => l.includes("chip face"))) now = "Close it. Chip the Hero if the math finishes the game.";
	else if (!playable.length && !legal.length) now = "Nothing left that wins this turn. End turn.";
	if (hits[0]) now = `${hits[0].title} — ${now}`;
	let why = "Win the Hero race. Every tap should raise that chance.";
	if (hasClass(g.you, "Pirate")) why = "Pirate: bodies now, Haunt later, close fast.";
	if (hasClass(g.you, "Crown")) why = "Crown: walls first, then they fold.";
	if (hasClass(g.you, "Wizard")) why = "Wizard: hold the answer, then end-step them.";
	if (hasClass(g.you, "Bow")) why = "Bow: play-effect chains. Keep the board yours.";
	if (hasClass(g.you, "Zombie")) why = "Zombie: graves are fuel. Trade now, Haunt later.";
	return {
		now,
		why,
		dont: dont.slice(0, 5),
		legal: legal.slice(0, 6)
	};
}
function lessonFromIllegal(detail) {
	const d = detail.toLowerCase();
	const kind = /taunt/.test(d) ? "taunt" : /mana/.test(d) ? "mana" : /trap|spring/.test(d) ? "trap" : /lane/.test(d) ? "lane" : /rush|hero/.test(d) ? "rush" : /kill|gate|chip/.test(d) ? "killgate" : "trade";
	const title = kind === "taunt" ? "You swung into Taunt before" : kind === "mana" ? "You banked mana before" : kind === "trap" ? "You mistimed a trap before" : kind === "lane" ? "Lanes were clogged before" : kind === "rush" ? "Rush hit face too early before" : "A bad trade cost you before";
	return {
		id: `ls-${Date.now()}`,
		t: Date.now(),
		kind,
		title,
		detail
	};
}
function coach(g, lessons = []) {
	return followSkill(g, lessons);
}
function answerQuestion(g, raw) {
	const q = raw.toLowerCase();
	const line = coach(g);
	if (q.includes("face") || q.includes("hero")) {
		const ready = g.you.lanes.map((c, i) => ({
			c,
			i,
			r: canAttackHero(g, i)
		})).filter((x) => x.c && x.r.ok);
		if (g.bot.lanes.some((c, i) => c && effectiveKeywords(g.bot, i).includes("Taunt"))) return "No. Taunt is up — face is closed until every Taunt is gone.";
		if (ready.length) return `Yes. ${ready.map((x) => cardName(x.c)).join(", ")} can chip the Hero. Rush bodies that entered this turn still cannot.`;
		return "Not with the current board. A creature cannot hit the Hero the turn it is played, even with Rush.";
	}
	if (q.includes("poison")) return KEYWORDS.find((k) => k.name === "Poison").text;
	if (q.includes("taunt")) return KEYWORDS.find((k) => k.name === "Taunt").text;
	if (q.includes("rush")) return KEYWORDS.find((k) => k.name === "Rush").text;
	if (q.includes("trap")) return "Set a trap face-down. It cannot spring the turn you set it. Next turn, Spring or Hold when the trigger fires.";
	if (q.includes("mana") || q.includes("coin")) return RULES_TEXT.find((r) => r.title === "Mana").body;
	if (q.includes("kill") || q.includes("attack") || q.includes("gate")) return RULES_TEXT.find((r) => r.title === "Kill-gate").body;
	if (q.includes("wayne") || q.includes("banned") || q.includes("ban")) return "Wayne is removed from online competitive play. A 2-mana 4/1 Rush was too strong. Pack Watch will not put Wayne in a constructed deck. Use legal cards only if you want the competitive edge.";
	if (q.includes("deck") || q.includes("build")) return "Open Cards and tap a class. Pack Watch builds a 40-card online-legal list (max 3 copies, no Wayne) from the current pool. Then play it — the coach’s job is to turn that list into wins.";
	if (q.includes("win") || q.includes("advantage") || q.includes("edge")) return "We play to win. Spend mana, crack Taunt, only take kill-gate fights, close the Hero when the path is open. That is the competitive edge — fewer illegal taps than they make.";
	return `${line.now} ${line.why}${line.legal.length ? " Legal: " + line.legal.join(" ") : ""}`;
}
function answerWatch(raw, scan) {
	const q = raw.toLowerCase();
	const text = (scan || "").toLowerCase();
	if (/wayne|banned|ban/.test(q)) return "Wayne is banned from online play. Do not register it.";
	if (/face|hero/.test(q)) {
		if (/taunt/.test(text)) return "No. Taunt is up — face is closed until every Taunt is gone.";
		return "A creature cannot hit the Hero the turn it is played, even with Rush. Chip face only with a ready body and no Taunt.";
	}
	if (/poison/.test(q)) return "Poison destroys the creature it fights even if ATK is lower. It does not ignore Hero HP.";
	if (/taunt/.test(q)) return "Attacks must hit Taunt first. Face and non-Taunt are closed.";
	if (/rush/.test(q)) return "Rush may hit creatures the turn it enters. Never the Hero that turn.";
	if (/trap/.test(q)) return "Set face-down. Cannot spring the turn you set it.";
	if (/mana|coin/.test(q)) return "Cap +1 each turn, refill to cap. Unspent mana does not bank. Coin pays +1 once.";
	if (/win|advantage|edge/.test(q)) return "Play to win. Spend mana, crack Taunt, only take fights that kill, close the Hero when the math is there.";
	if (scan.trim()) return scan;
	return "Share the play tab so I can see this match. I never touch the game page.";
}
var DECK_CLASSES = [
	"Pirate",
	"Crown",
	"Wizard",
	"Bow",
	"Zombie"
];
function score(c, cls) {
	let s = 12 - c.cost;
	if (c.cls === cls) s += 6;
	if (c.keywords.includes("Taunt") || c.keywords.includes("Rush") || c.keywords.includes("Poison")) s += 3;
	if (c.kind === "Spell" || c.kind === "Trap") s += 1;
	if (c.play || c.haunt || c.end || c.start) s += 2;
	if (c.cost <= 2 && c.kind === "Creature") s += 3;
	if (c.cost >= 7) s -= 2;
	return s;
}
function buildCompetitiveDeck(cls) {
	const ranked = [...LEGAL_POOL.filter((c) => c.cls === cls || c.cls === "Neutral" || c.cls === "All")].sort((a, b) => score(b, cls) - score(a, cls) || a.cost - b.cost);
	const list = [];
	const count = {};
	for (const c of ranked) {
		if (list.length >= 40) break;
		const copies = c.cost <= 3 ? 3 : c.cost <= 5 ? 2 : 1;
		for (let i = 0; i < copies && list.length < 40; i++) {
			if ((count[c.id] ?? 0) >= 3) break;
			list.push(c);
			count[c.id] = (count[c.id] ?? 0) + 1;
		}
	}
	const curve = [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	for (const c of list) curve[Math.min(6, c.cost)] += 1;
	return {
		cls,
		list,
		notes: `${cls} constructed. 40 cards, max 3 copies. Wayne is banned from online play and is not in this list. Curve 0–1:${curve[0] + curve[1]} · 2:${curve[2]} · 3:${curve[3]} · 4+:${curve[4] + curve[5] + curve[6]}. Play this list on ddltcg.com — Pack Watch’s job is to turn it into wins.`
	};
}
function groupDeck(list) {
	const map = /* @__PURE__ */ new Map();
	for (const c of list) {
		const hit = map.get(c.id);
		if (hit) hit.n += 1;
		else map.set(c.id, {
			def: c,
			n: 1
		});
	}
	return [...map.values()].sort((a, b) => a.def.cost - b.def.cost || a.def.name.localeCompare(b.def.name));
}
var SEED_CONTROLS = [
	{
		id: "hot-pack",
		label: "Hot Pack",
		where: "Lobby chrome",
		function: "Opens pack / promo surface.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "log",
		label: "Log",
		where: "Lobby chrome",
		function: "Match / system log.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "new-game",
		label: "New Game",
		where: "Match HUD",
		function: "Start a fresh match.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "end-turn",
		label: "End Turn",
		where: "Match HUD",
		function: "Pass after main. Runs End step, then opponent Gain/Draw/Start.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "resume",
		label: "Resume",
		where: "Unfinished match",
		function: "Reconnect a live bot game on the server.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "cancel",
		label: "Cancel",
		where: "Chooser",
		function: "Abort a card choice.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "confirm",
		label: "Confirm",
		where: "Chooser",
		function: "Lock the chosen card.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "play-again",
		label: "Play Again",
		where: "Post-match",
		function: "Queue another game with the same decks.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "change-decks",
		label: "Change decks",
		where: "Post-match",
		function: "Return to deck select.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "sign-in",
		label: "Sign in",
		where: "Lobby",
		function: "Hero account — Miles, streaks, badges persist.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "create-account",
		label: "Create account",
		where: "Lobby",
		function: "Free Hero Account.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "pvp",
		label: "Vs Pack",
		where: "Path picker",
		function: "PvP queue.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "bot",
		label: "Vs Bot",
		where: "Path picker",
		function: "Practice vs the server bot.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "boost",
		label: "Boost",
		where: "Path picker",
		function: "Boost mode.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "teach",
		label: "Tutorial",
		where: "Path picker",
		function: "Guided teach mode.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "how",
		label: "How to Play",
		where: "Lobby",
		function: "Rules primer.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "leaderboard",
		label: "Leaderboard",
		where: "Lobby",
		function: "Arena ranking.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "settings",
		label: "Settings",
		where: "HUD gear",
		function: "Volume, preferences.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "sound",
		label: "Sound",
		where: "HUD",
		function: "Mute / unmute.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "grave",
		label: "Graveyard",
		where: "Board",
		function: "Open face-up grave pile.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "l1",
		label: "L1–L5",
		where: "Board",
		function: "Creature lanes. One body each. Empty stays empty.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "s1",
		label: "S1–S5",
		where: "Board",
		function: "Spell / trap back row.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "hand",
		label: "Your hand",
		where: "Board",
		function: "Playable cards. Cap 10.",
		seen: 1,
		lastSeen: 0
	},
	{
		id: "end-btn",
		label: "YOUR TURN",
		where: "Banner",
		function: "Active player indicator.",
		seen: 1,
		lastSeen: 0
	}
];
function bump(g, lessons) {
	return coach(g, lessons);
}
var useBrain = create()(persist((set, get) => {
	const game = newGame();
	return {
		game,
		controls: SEED_CONTROLS.map((c) => ({
			...c,
			lastSeen: Date.now()
		})),
		watching: false,
		lastScan: "Learning from every match, scan, and overlay. Wayne is banned online.",
		lastDeck: null,
		lessons: [],
		tab: "home",
		coachLine: bump(game, []),
		ask: "",
		askReply: "",
		asking: false,
		notice: "Tap a card you can afford. One tap plays it.",
		selected: null,
		newMatch: () => {
			const g = newGame();
			set({
				game: g,
				coachLine: bump(g, get().lessons),
				selected: null,
				notice: "New match. Tap a card that you can afford."
			});
		},
		play: (uid, lane) => {
			const g = get().game;
			playFromHand(g, uid, lane);
			const lessons = [...get().lessons];
			const line = g.log[0] ?? "";
			if (/illegal/i.test(line)) {
				const L = lessonFromIllegal(line);
				if (L) lessons.unshift(L);
			}
			set({
				game: {
					...g,
					events: [...g.events],
					log: [...g.log]
				},
				coachLine: bump(g, lessons),
				selected: null,
				notice: line,
				lessons: lessons.slice(0, 40)
			});
		},
		hit: (from, to) => {
			const g = get().game;
			if (to === "hero") attackHero(g, from);
			else attackCreature(g, from, to);
			const lessons = [...get().lessons];
			const line = g.log[0] ?? "";
			if (/illegal/i.test(line)) {
				const L = lessonFromIllegal(line);
				if (L) lessons.unshift(L);
			}
			set({
				game: {
					...g,
					events: [...g.events],
					log: [...g.log]
				},
				coachLine: bump(g, lessons),
				selected: null,
				notice: line,
				lessons: lessons.slice(0, 40)
			});
		},
		pass: () => {
			const g = get().game;
			const leftover = g.you.hand.some((c) => defOf(c.defId).cost <= g.you.mana);
			const lessons = [...get().lessons];
			if (leftover && g.turn === "you") {
				const L = lessonFromIllegal("Illegal: mana left unspent.");
				if (L) lessons.unshift(L);
			}
			endTurn(g);
			set({
				game: {
					...g,
					events: [...g.events],
					log: [...g.log]
				},
				coachLine: bump(g, lessons),
				selected: null,
				notice: g.log[0] ?? "",
				lessons: lessons.slice(0, 40)
			});
		},
		pick: (sel) => set({ selected: sel }),
		mergeControls: (labels, where) => {
			const next = [...get().controls];
			const now = Date.now();
			for (const label of labels) {
				const hit = next.find((c) => c.label.toLowerCase() === label.toLowerCase());
				if (hit) {
					hit.seen += 1;
					hit.lastSeen = now;
				} else next.unshift({
					id: `l-${label.toLowerCase().replace(/\s+/g, "-")}`,
					label,
					where,
					function: "Observed on official client scan. Function still being classified.",
					seen: 1,
					lastSeen: now
				});
			}
			set({ controls: next.slice(0, 80) });
		},
		setWatching: (v) => set({ watching: v }),
		setTab: (t) => set({ tab: t }),
		setAsk: (v) => set({ ask: v }),
		setAskReply: (v) => set({ askReply: v }),
		setAsking: (v) => set({ asking: v }),
		setNotice: (v) => set({ notice: v }),
		noteScan: (summary) => {
			const g = get().game;
			const ev = {
				t: Date.now(),
				kind: "scan",
				label: "Learn",
				detail: summary
			};
			g.events.unshift(ev);
			set({
				lastScan: summary,
				game: { ...g }
			});
		},
		buildDeck: (cls) => {
			const deck = buildCompetitiveDeck(cls);
			set({
				lastDeck: deck,
				notice: deck.notes,
				lastScan: `Built a ${cls} list. Wayne excluded. 40 legal cards.`
			});
		}
	};
}, {
	name: "pack-watch-brain-v5",
	skipHydration: true,
	partialize: (s) => ({
		controls: s.controls,
		lastDeck: s.lastDeck,
		lessons: s.lessons
	}),
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			controls: Array.isArray(p.controls) && p.controls.length ? p.controls : current.controls,
			lastDeck: p.lastDeck ?? current.lastDeck,
			lessons: Array.isArray(p.lessons) ? p.lessons : current.lessons
		};
	}
}));
if (typeof window !== "undefined") useBrain.persist.rehydrate();
function shareOptions() {
	return {
		video: { frameRate: {
			ideal: 15,
			max: 20
		} },
		audio: false,
		preferCurrentTab: false,
		selfBrowserSurface: "exclude",
		systemAudio: "exclude",
		surfaceSwitching: "exclude",
		monitorTypeSurfaces: "exclude"
	};
}
function ScreenWatch({ compact = false }) {
	const b = useBrain();
	const videoRef = (0, import_react.useRef)(null);
	const detectorRef = (0, import_react.useRef)(null);
	const scanInFlightRef = (0, import_react.useRef)(false);
	const lastTextRef = (0, import_react.useRef)("");
	const [stream, setStream] = (0, import_react.useState)(null);
	const [sight, setSight] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const [learns, setLearns] = (0, import_react.useState)(0);
	const [ticks, setTicks] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		return () => stream?.getTracks().forEach((t) => t.stop());
	}, [stream]);
	(0, import_react.useEffect)(() => {
		if (!stream) return;
		const id = window.setInterval(() => void sample(false), 250);
		sample(false);
		return () => window.clearInterval(id);
	}, [stream]);
	function grabJpeg() {
		const video = videoRef.current;
		if (!video || video.videoWidth < 8) return null;
		const canvas = document.createElement("canvas");
		const scale = Math.min(1, 960 / video.videoWidth);
		canvas.width = Math.round(video.videoWidth * scale);
		canvas.height = Math.round(video.videoHeight * scale);
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .5);
	}
	async function sample(deep) {
		const video = videoRef.current;
		if (!video || video.videoWidth < 8 || scanInFlightRef.current) return;
		scanInFlightRef.current = true;
		setTicks((n) => n + 1);
		let text = "";
		try {
			const TD = window.TextDetector;
			if (TD) {
				detectorRef.current ??= new TD();
				const bmp = await createImageBitmap(video);
				text = (await detectorRef.current.detect(bmp)).map((h) => h.rawValue).join(" ").replace(/\s+/g, " ").trim();
				bmp.close();
			} else if (!deep) setErr("This browser cannot read shared-tab text locally. Use Chrome for live reading, or call the board here.");
		} catch {
			if (!deep) setErr("The local reader missed that frame. It will retry automatically.");
		}
		if (text && text !== lastTextRef.current) {
			lastTextRef.current = text;
			const s = parseSight(text);
			setSight(s);
			b.mergeControls([...s.labels, ...s.cards], "Shared window");
			b.noteScan(s.advice);
			b.setNotice(s.advice);
		}
		scanInFlightRef.current = false;
		if (!deep) return;
		if (learns >= 8) {
			setErr("That's enough deep reads for now. Keep the share on — I still watch the picture.");
			return;
		}
		const img = grabJpeg();
		if (!img) return;
		setBusy(true);
		setErr("");
		try {
			const res = await learnFrame({ data: { image: img } });
			if (!res.ok) {
				setErr(res.error);
				return;
			}
			setLearns((n) => n + 1);
			const parsed = res.parsed;
			const advice = parsed?.advice || parseSight(res.text).advice;
			b.setNotice(advice);
			b.noteScan(advice);
			if (parsed?.labels) b.mergeControls(parsed.labels.concat(parsed.cards ?? []), "Shared window");
			setSight({
				turn: parsed?.turn === "you" || parsed?.turn === "opp" ? parsed.turn : "unknown",
				youHP: parsed?.youHP ?? null,
				oppHP: parsed?.oppHP ?? null,
				labels: parsed?.labels ?? [],
				cards: parsed?.cards ?? [],
				keywords: parsed?.keywords ?? [],
				raw: res.text,
				advice
			});
		} catch {
			setErr("I couldn't deep-read that frame. Keep the share on — local watch still runs.");
		} finally {
			setBusy(false);
		}
	}
	async function startShare() {
		setErr("");
		if (!navigator.mediaDevices?.getDisplayMedia) {
			setErr("This window cannot share a screen. Open the companion from Chrome, not inside a locked preview.");
			return;
		}
		try {
			const media = await navigator.mediaDevices.getDisplayMedia(shareOptions());
			detectorRef.current = null;
			lastTextRef.current = "";
			setStream(media);
			b.setWatching(true);
			const v = videoRef.current;
			if (v) {
				v.srcObject = media;
				await v.play().catch(() => void 0);
			}
			media.getVideoTracks()[0]?.addEventListener("ended", () => stopShare());
		} catch {
			setErr("Share was cancelled. Tap Watch game, then pick the Chrome tab that has ddltcg.com/play — not this window, not your whole desktop.");
		}
	}
	function stopShare() {
		stream?.getTracks().forEach((t) => t.stop());
		setStream(null);
		b.setWatching(false);
		if (videoRef.current) videoRef.current.srcObject = null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			!stream && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Log into",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "underline",
							href: "https://ddltcg.com/play",
							target: "_blank",
							rel: "noreferrer",
							children: "ddltcg.com/play"
						}),
						" ",
						"in normal Chrome. Pack Watch is not installed there."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sit this window beside the game." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tap Watch game. Pick that Chrome tab only — never your whole screen (passwords live there)." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				className: `w-full rounded-xl border border-border bg-bg object-contain ${stream ? "aspect-video" : "hidden"}`,
				muted: true,
				playsInline: true
			}),
			stream && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-wide text-ok",
				children: [
					"LIVE · tick ",
					ticks,
					sight ? ` · turn ${sight.turn} · HP ${sight.youHP ?? "?"} / ${sight.oppHP ?? "?"}` : " · reading…"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: !stream ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: startShare,
					className: "min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg",
					children: "Watch game"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void sample(true),
					disabled: busy,
					className: "min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg disabled:opacity-40",
					children: busy ? "Reading…" : "Deep read"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: stopShare,
					className: "min-h-12 rounded-md border border-border px-5 text-sm",
					children: "Stop"
				})] })
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: err
			}),
			sight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed",
				children: sight.advice
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-faint",
				children: "Safety: Pack Watch never injects into DDL, never clicks, never reads cookies, and never sees a window you did not share. It does not require a Chrome extension."
			})
		]
	});
}
function openCompanion() {
	const url = `${window.location.origin}/desk`;
	const w = window.open(url, "packwatch-desk", "popup=yes,width=440,height=920,resizable=yes,scrollbars=yes");
	return Boolean(w);
}
//#endregion
export { answerQuestion as a, defOf as c, groupDeck as d, openCompanion as f, ScreenWatch as i, effectiveAtk as l, useBrain as m, DECK_CLASSES as n, answerWatch as o, parseSight as p, RULES_TEXT as r, canAttackCreature as s, CARDS as t, effectiveKeywords as u };
