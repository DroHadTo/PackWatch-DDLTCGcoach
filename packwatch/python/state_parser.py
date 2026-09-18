"""Turn raw live text into a small board object. No clicks."""

from __future__ import annotations

import json
import re
from hashlib import sha256
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = ROOT / "data" / "live.json"


def parse_text(text: str) -> dict:
    raw = re.sub(r"\s+", " ", text or "").strip()
    upper = raw.upper()
    # Static chrome and the player's hand include turn, keyword and card text.
    # Restrict board inference to the game area before the hand, then use the
    # round-status sentence rather than a persistent "YOUR TURN" button.
    board_raw = re.split(r"\bYOUR\s+HAND\b", raw, maxsplit=1, flags=re.I)[0]
    board_upper = board_raw.upper()
    round_status = re.search(r"\b(YOUR|OPPONENT(?:'S)?|ENEMY)\s+TURN\s*(?:—|-)\s*ROUND\b", upper)
    if round_status:
        turn = "you" if round_status.group(1) == "YOUR" else "opp"
    elif "YOUR TURN · PLAY" in upper:
        turn = "you"
    elif "OPPONENT TURN · PLAY" in upper or "ENEMY TURN · PLAY" in upper:
        turn = "opp"
    else:
        turn = "unknown"
    hps = [int(m) for m in re.findall(r"(\d{1,2})\s*/\s*40", board_raw)]
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
        "you_hp": hps[1] if len(hps) > 1 else None,
        "opp_hp": hps[0] if hps else None,
        "taunt": "TAUNT" in board_upper,
        "rush": "RUSH" in board_upper,
        "poison": "POISON" in board_upper,
        "fury": "FURY" in board_upper,
        "frozen": "FROZEN" in board_upper or "FREEZE" in board_upper,
        "labels": labels,
        "raw": raw[:4000],
        "board_raw": board_raw[:2500],
        "fingerprint": sha256(board_raw.encode("utf-8")).hexdigest()[:16],
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
    parsed["ts"] = live.get("ts") or ""
    return parsed
