import { LEGAL_POOL, defOf } from "./cards";
import type { CardDef, CardInst, Effect, GameState, LearnEvent, PlayerState } from "./types";

let seq = 1;
function uid() {
  seq += 1;
  return `c${seq}`;
}

export function learn(g: GameState, kind: LearnEvent["kind"], label: string, detail: string) {
  g.events.unshift({ t: Date.now(), kind, label, detail });
  if (g.events.length > 400) g.events.length = 400;
}

function log(g: GameState, line: string) {
  g.log.unshift(line);
  if (g.log.length > 80) g.log.length = 80;
}

function clone<T>(v: T): T {
  return structuredClone(v);
}

function fisher(arr: CardInst[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function mint(def: CardDef): CardInst {
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
    setThisTurn: false,
  };
}

function emptyPlayer(id: PlayerState["id"], list: CardDef[]): PlayerState {
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
    lanes: [null, null, null, null, null],
    back: [null, null, null, null, null],
    immuneHero: false,
    fatigue: 0,
  };
}

export function cardName(inst: CardInst | null | undefined) {
  if (!inst) return "empty";
  return defOf(inst.defId).name;
}

export function hasClass(p: PlayerState, cls: string) {
  return p.lanes.some((c) => {
    if (!c) return false;
    const d = defOf(c.defId);
    return d.cls === cls || d.cls === "All" || d.flags?.includes("allClass");
  });
}

function emptyLane(p: PlayerState) {
  return p.lanes.findIndex((l) => !l);
}

function emptyBack(p: PlayerState) {
  return p.back.findIndex((l) => !l);
}

function enemyOf(g: GameState, id: PlayerState["id"]): PlayerState {
  return id === "you" ? g.bot : g.you;
}

function meOf(g: GameState, id: PlayerState["id"]): PlayerState {
  return id === "you" ? g.you : g.bot;
}

function hasTaunt(p: PlayerState) {
  return p.lanes.some((c, i) => c && effectiveKeywords(p, i).includes("Taunt"));
}

export function effectiveKeywords(p: PlayerState, lane: number): string[] {
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

export function effectiveAtk(p: PlayerState, lane: number) {
  const c = p.lanes[lane];
  if (!c) return 0;
  let atk = c.atk;
  const d = defOf(c.defId);
  if (d.flags?.includes("stumpBuff") && p.lanes.filter(Boolean).length > 1) atk += 2;
  return atk;
}

function drawOne(g: GameState, p: PlayerState, extra = false) {
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
  const c = p.deck.shift()!;
  p.hand.push(c);
  if (extra) {
    const opp = enemyOf(g, p.id);
    opp.lanes.forEach((n) => {
      if (n && defOf(n.defId).flags?.includes("punishExtraDraw")) {
        drawOne(g, opp, false);
      }
    });
  }
}

function damageHero(g: GameState, target: PlayerState, n: number, src: string) {
  if (n <= 0) return;
  if (target.immuneHero || target.lanes.some((c) => c && defOf(c.defId).flags?.includes("heroImmune"))) {
    log(g, `${target.id} Hero is immune — ${src} blocked.`);
    return;
  }
  const trap = springTraps(g, enemyOf(g, target.id), target.id === g.turn ? "waiting" : "active", "heroDamage");
  if (trap === "reflect") {
    const srcP = enemyOf(g, target.id);
    srcP.hp = Math.max(0, srcP.hp - n);
    log(g, `Blast reflects ${n} to ${srcP.id}.`);
    checkWin(g);
    return;
  }
  if (target.hp - n <= 0) {
    const fatal = springTraps(g, target, "self", "fatalHero");
    if (fatal === "immune") {
      target.immuneHero = true;
      log(g, `Frost Lock saves ${target.id}.`);
      return;
    }
  }
  target.hp = Math.max(0, target.hp - n);
  log(g, `${src} deals ${n} to ${target.id} Hero (${target.hp}).`);
  checkWin(g);
}

function healHero(g: GameState, p: PlayerState, n: number) {
  const opp = enemyOf(g, p.id);
  if (opp.lanes.some((c) => c && defOf(c.defId).flags?.includes("antiHeal"))) {
    log(g, `Plague blocks healing.`);
    return;
  }
  p.hp = Math.min(40, p.hp + n);
  log(g, `${p.id} heals ${n} (${p.hp}).`);
}

function killCreature(g: GameState, owner: PlayerState, lane: number, reason: string) {
  const c = owner.lanes[lane];
  if (!c) return;
  const save = springTraps(g, owner, "self", "friendlyDestroy");
  if (save === "save") {
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
  if (owner.back.some((b) => b && defOf(b.defId).flags?.includes("chum")) && d.cls === "Pirate") {
    drawOne(g, owner, true);
  }
  owner.lanes.forEach((n) => {
    if (n && defOf(n.defId).flags?.includes("deathFace2")) {
      damageHero(g, enemyOf(g, owner.id), 2, cardName(n));
    }
  });
}

function springTraps(
  g: GameState,
  owner: PlayerState,
  _side: string,
  trigger: string,
): string | null {
  let result: string | null = null;
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

function firstEmpty(p: PlayerState) {
  return p.lanes.findIndex((x) => !x);
}

function runEffects(g: GameState, owner: PlayerState, fxs: Effect[], source: CardInst) {
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
          const b = opp.back[idx]!;
          opp.grave.unshift(b);
          opp.back[idx] = null;
          log(g, `Back row ${cardName(b)} destroyed.`);
        }
        break;
      }
      case "bounce": {
        const idx = opp.lanes.findIndex(Boolean);
        if (idx >= 0) {
          const c = opp.lanes[idx]!;
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
          owner.lanes[idx]!.poisonUntilEnd = true;
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
        if (pile.length) {
          const gone = pile.shift()!;
          log(g, `Banished ${cardName(gone)}.`);
        }
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
          const c = opp.lanes[idx]!;
          opp.lanes[idx] = null;
          opp.deck.push(c);
          fisher(opp.deck);
          log(g, `${cardName(c)} shuffled into deck.`);
        }
        break;
      }
      default:
        break;
    }
    learn(g, "effect", defOf(source.defId).name, fx.op);
  }
}

function scaledDamage(owner: PlayerState, source: CardInst, n: number) {
  const id = defOf(source.defId).id;
  if (id === "V073" && hasClass(owner, "Wizard")) return 3;
  if (id === "V084" && hasClass(owner, "Bow")) return 4;
  if (id === "V091" && hasClass(owner, "Crown")) return 6;
  return n;
}

function scaledHeal(owner: PlayerState, source: CardInst, n: number) {
  const id = defOf(source.defId).id;
  if (id === "V083" && hasClass(owner, "Bow")) return 12;
  if (id === "V088" && hasClass(owner, "Wizard")) return n;
  return n;
}

function firstEnemyCreature(p: PlayerState) {
  return p.lanes.find(Boolean) ?? null;
}

function wipeCreatures(g: GameState, exceptUid?: string) {
  for (const p of [g.you, g.bot]) {
    p.lanes.forEach((c, i) => {
      if (c && c.uid !== exceptUid) killCreature(g, p, i, "board wipe");
    });
  }
}

function summonFrom(
  g: GameState,
  owner: PlayerState,
  pile: CardInst[],
  maxCost: number,
  n: number,
  cls?: string,
) {
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

function checkWin(g: GameState) {
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

function buildList(prefer: string[]) {
  const pool = LEGAL_POOL.filter((c) => prefer.includes(c.cls) || c.cls === "Neutral" || c.cls === "All");
  const out: CardDef[] = [];
  const count: Record<string, number> = {};
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

export function newGame(): GameState {
  seq = 1;
  const you = emptyPlayer("you", buildList(["Pirate", "Neutral"]));
  const bot = emptyPlayer("bot", buildList(["Crown", "Wizard"]));
  const first: "you" | "bot" = "you";
  bot.coin = true;
  const g: GameState = {
    you,
    bot,
    turn: first,
    turnNo: 1,
    phase: "main",
    winner: null,
    selectedUid: null,
    pending: null,
    log: [],
    events: [],
  };
  for (const p of [you, bot]) {
    for (let i = 0; i < 4; i++) drawOne(g, p);
    const keep: CardInst[] = [];
    const back: CardInst[] = [];
    for (const c of p.hand) {
      if (defOf(c.defId).cost >= 5) back.push(c);
      else keep.push(c);
    }
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

function readyAttacks(c: CardInst, kws: string[]) {
  if (c.frozenTurns > 0) return 0;
  const fury = kws.includes("Fury") ? 2 : 1;
  return fury;
}

export function startTurn(g: GameState, who: "you" | "bot") {
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
    if (
      p.back.some((b) => b && defOf(b.defId).flags?.includes("feast")) &&
      i === 0
    ) {
      healHero(g, p, hasClass(p, "Crown") ? 4 : 2);
    }
  });
  g.turn = who;
  g.phase = g.winner ? "gameover" : "main";
  g.selectedUid = null;
  g.pending = null;
}

export function endTurn(g: GameState) {
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
  if (p.back.some((b) => b && defOf(b.defId).flags?.includes("hauntHouse"))) {
    p.lanes.forEach((c) => {
      if (!c) return;
      const d = defOf(c.defId);
      if (d.haunt && (d.cls === "Zombie" || d.cls === "All")) runEffects(g, p, d.haunt, c);
    });
  }
  const next = g.turn === "you" ? "bot" : "you";
  if (next === "you") g.turnNo += 1;
  startTurn(g, next);
  log(g, `${next}'s turn ${g.turnNo}. Mana ${meOf(g, next).mana}/${meOf(g, next).manaCap}.`);
  learn(g, "control", "End Turn", `${p.id} passed.`);
  if (g.turn === "bot" && !g.winner) botAct(g);
  return g;
}

export function playFromHand(g: GameState, uidStr: string, lane?: number): GameState {
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
    } else if (sprung === "killHigh" && inst.atk >= 4) {
      killCreature(g, p, slot, "Pitfall");
    } else {
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
  } else {
    p.grave.unshift(inst);
  }
  if (d.play) runEffects(g, p, d.play, inst);
  log(g, `Cast ${d.name}.`);
  learn(g, "card", d.name, d.text);
  return g;
}

export function canAttackCreature(
  g: GameState,
  fromLane: number,
  toLane: number,
): { ok: boolean; why: string } {
  const atk = g.you.lanes[fromLane];
  const def = g.bot.lanes[toLane];
  if (!atk) return { ok: false, why: "Empty lane." };
  if (!def) return { ok: false, why: "No defender." };
  if (g.turn !== "you") return { ok: false, why: "Not your turn." };
  if (atk.attacksLeft <= 0) return { ok: false, why: "Already spent / summoning sickness." };
  if (atk.frozenTurns > 0) return { ok: false, why: "Frozen." };
  const kws = effectiveKeywords(g.you, fromLane);
  if (hasTaunt(g.bot) && !effectiveKeywords(g.bot, toLane).includes("Taunt")) {
    return { ok: false, why: "Taunt is up — must attack a Taunt." };
  }
  const a = effectiveAtk(g.you, fromLane) + (kws.includes("Poison") ? 99 : 0);
  const suicide = def.atk >= atk.hp;
  const lethal = a >= def.hp || kws.includes("Poison") || suicide;
  if (!lethal) return { ok: false, why: "Kill-gate: nobody would die. No chip." };
  return { ok: true, why: "Legal fight." };
}

export function canAttackHero(g: GameState, fromLane: number): { ok: boolean; why: string } {
  const atk = g.you.lanes[fromLane];
  if (!atk) return { ok: false, why: "Empty lane." };
  if (atk.attacksLeft <= 0) return { ok: false, why: "Not ready." };
  if (hasTaunt(g.bot)) return { ok: false, why: "Taunt closes face." };
  if (atk.enteredThisTurn) return { ok: false, why: "Cannot hit the Hero the turn a creature is played, even with Rush." };
  return { ok: true, why: "Legal face hit." };
}

export function attackCreature(g: GameState, fromLane: number, toLane: number): GameState {
  const chk = canAttackCreature(g, fromLane, toLane);
  if (!chk.ok) {
    learn(g, "illegal", "Attack", chk.why);
    log(g, `Illegal attack: ${chk.why}`);
    return g;
  }
  const sprung = springTraps(g, g.bot, "opp", "enemyAttack");
  const atk = g.you.lanes[fromLane]!;
  if (sprung === "negateAttack") {
    killCreature(g, g.you, fromLane, "Ambush");
    return g;
  }
  const def = g.bot.lanes[toLane]!;
  const kws = effectiveKeywords(g.you, fromLane);
  const a = effectiveAtk(g.you, fromLane);
  atk.attacksLeft -= 1;
  const poison = kws.includes("Poison");
  if (poison || a >= def.hp) killCreature(g, g.bot, toLane, cardName(atk));
  if (def.atk >= atk.hp) killCreature(g, g.you, fromLane, "counter");
  log(g, `${cardName(atk)} fights ${cardName(def)}.`);
  learn(g, "rule", "Kill-gate", `${cardName(atk)} vs ${cardName(def)}`);
  return g;
}

export function attackHero(g: GameState, fromLane: number): GameState {
  const chk = canAttackHero(g, fromLane);
  if (!chk.ok) {
    learn(g, "illegal", "Face", chk.why);
    log(g, `Illegal: ${chk.why}`);
    return g;
  }
  const sprung = springTraps(g, g.bot, "opp", "enemyAttack");
  if (sprung === "negateAttack") {
    killCreature(g, g.you, fromLane, "Ambush");
    return g;
  }
  const atk = g.you.lanes[fromLane]!;
  const dmg = effectiveAtk(g.you, fromLane);
  atk.attacksLeft -= 1;
  damageHero(g, g.bot, dmg, cardName(atk));
  const after = springTraps(g, g.bot, "opp", "afterFaceAttack");
  if (after === "wipeFace") wipeCreatures(g);
  return g;
}

function botAct(g: GameState) {
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
      const def = g.you.lanes[tIdx]!;
      const a = effectiveAtk(p, i);
      const kws = effectiveKeywords(p, i);
      c.attacksLeft = 0;
      if (kws.includes("Poison") || a >= def.hp) killCreature(g, g.you, tIdx, cardName(c));
      if (def.atk >= c.hp) killCreature(g, p, i, "counter");
    }
  });
  if (!g.winner) {
    const next = "you" as const;
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

function canBotKill(atkP: PlayerState, from: number, defP: PlayerState, to: number) {
  const atk = atkP.lanes[from]!;
  const def = defP.lanes[to]!;
  if (hasTaunt(defP) && !effectiveKeywords(defP, to).includes("Taunt")) return false;
  const a = effectiveAtk(atkP, from);
  const kws = effectiveKeywords(atkP, from);
  return kws.includes("Poison") || a >= def.hp || def.atk >= atk.hp;
}

export function snapshot(g: GameState) {
  return clone(g);
}
