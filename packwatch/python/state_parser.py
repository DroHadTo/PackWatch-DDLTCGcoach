"""Turn raw live text into a small board object. No clicks."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = ROOT / "data" / "live.json"


def parse_text(text: str) -> dict:
    raw = re.sub(r"\s+", " ", text or "").strip()
    upper = raw.upper()
    turn = (
        "you"
        if "YOUR TURN" in upper
        else "opp"
        if "OPPONENT" in upper or "ENEMY TURN" in upper
        else "unknown"
    )
    hps = [int(m) for m in re.findall(r"(\d{1,2})\s*/\s*40", raw)]
    labels = [
        b
        for b in (
            "End Turn",
            "YOUR TURN",
            "Graveyard",
            "Vs Bot",
            "Confirm",
            "How to Play",
        )
        if b.upper() in upper
    ]
    return {
        "turn": turn,
        "you_hp": hps[0] if hps else None,
        "opp_hp": hps[1] if len(hps) > 1 else None,
        "taunt": "TAUNT" in upper,
        "rush": "RUSH" in upper,
        "poison": "POISON" in upper,
        "fury": "FURY" in upper,
        "frozen": "FROZEN" in upper or "FREEZE" in upper,
        "labels": labels,
        "raw": raw[:4000],
    }


def parse_live() -> dict:
    if not LIVE.exists():
        return parse_text("")
    try:
        live = json.loads(LIVE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return parse_text("")
    parsed = parse_text(live.get("text") or "")
    parsed["ok"] = bool(live.get("ok"))
    parsed["error"] = live.get("error") or ""
    parsed["mode"] = live.get("mode") or ""
    return parsed
