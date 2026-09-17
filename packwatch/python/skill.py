"""DDL-specific coach. Short advice. Never recommends a click."""

from __future__ import annotations

FIVE = [
    "Do not swing into Taunt.",
    "Spend the mana — it does not bank.",
    "Do not spring a trap the turn you set it.",
    "Empty lanes stay empty. Place on purpose.",
    "Only take kill-gate fights (or Poison / a stack).",
]


def coach(raw: str, lessons: list[dict] | None = None) -> dict:
    lessons = lessons or []
    text = (raw or "").replace("\n", " ")
    upper = text.upper()
    turn = "you" if "YOUR TURN" in upper else "opp" if "OPPONENT" in upper or "ENEMY TURN" in upper else "unknown"
    taunt = "TAUNT" in upper
    rush = "RUSH" in upper
    poison = "POISON" in upper

    if turn == "opp":
        now = "Their turn. Plan the crack. Do not click."
    elif taunt:
        now = "Crack Taunt first. You cannot win through a wall."
    elif rush:
        now = "Rush hits bodies this turn — never the Hero."
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
        "raw": text[:2000],
    }
