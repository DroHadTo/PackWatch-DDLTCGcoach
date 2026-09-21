"""DDL-specific coach. Short advice. Never recommends a click."""

from __future__ import annotations

FIVE = [
    "Do not swing into Taunt.",
    "Spend the mana — it does not bank.",
    "Do not spring a trap the turn you set it.",
    "Empty lanes stay empty. Place on purpose.",
    "Only take kill-gate fights (or Poison / a stack).",
]


def coach(raw: str, lessons: list[dict] | None = None, state: dict | None = None) -> dict:
    lessons = lessons or []
    state = state or {}
    text = (raw or "").replace("\n", " ")
    upper = text.upper()
    turn = "you" if "YOUR TURN" in upper else "opp" if "OPPONENT" in upper or "ENEMY TURN" in upper else "unknown"
    taunt = "TAUNT" in upper
    rush = "RUSH" in upper
    poison = "POISON" in upper

    mana = state.get("mana")
    mana_cap = state.get("mana_cap")
    opp_hp = state.get("opp_hp")
    if turn == "opp":
        now = "Their turn. Plan the crack. Do not click."
    elif taunt:
        now = "Crack Taunt first. You cannot win through a wall."
    elif rush:
        now = "Rush hits bodies this turn — never the Hero."
    elif mana == 0:
        now = "No mana remains. Review legal attacks, then end the turn when ready."
    elif isinstance(mana, int) and isinstance(mana_cap, int) and mana < mana_cap:
        now = f"Spend the {mana} available mana before ending the turn."
    elif isinstance(opp_hp, int) and opp_hp <= 10:
        now = "Opponent Hero is low. Check lethal first, then take only legal fights."
    else:
        now = "Spend the mana. Develop, then only legal fights."

    hit = next((l for l in lessons if l.get("kind") == "taunt" and taunt), None)
    if hit:
        now = f"{hit.get('title', 'Past miss')} — {now}"

    why = "Win the Hero race. Card text overrides memory."
    dont = list(FIVE)
    if rush:
        dont = ["Rush cannot hit the Hero the turn it enters."] + dont
    if poison:
        dont = ["Poison kills the body it fights, not Hero HP."] + dont

    return {
        "now": now,
        "why": why,
        "dont": dont[:5],
        "legal": ["Advice only. You click."] ,
        "turn": turn,
        "taunt": taunt,
        "decision_window": turn == "you",
        "face_open": not taunt,
        "mana_spend": mana if isinstance(mana, int) else None,
        "raw": text[:2000],
    }
