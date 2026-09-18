"""Local observations for a context-aware next coaching beat."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "data" / "lessons.json"
LAST = ROOT / "data" / "last_state.json"


def read_json(path: Path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return fallback


def record_observations(current: dict) -> list[dict]:
    """Record only visible state changes; do not label them as player mistakes."""
    previous = read_json(LAST, {})
    history = read_json(LESSONS, [])
    changes: list[dict] = []

    def add(title: str, detail: str) -> None:
        changes.append({
            "kind": "observation",
            "title": title,
            "detail": detail,
            "at": datetime.now(timezone.utc).isoformat(),
        })

    if previous:
        if previous.get("turn") != current.get("turn") and current.get("turn") in {"you", "opp"}:
            add("Turn changed", "Your decision window is open." if current["turn"] == "you" else "Opponent is acting.")
        for key, label in (("opp_hp", "Enemy Hero"), ("you_hp", "Your Hero")):
            before, after = previous.get(key), current.get(key)
            if isinstance(before, int) and isinstance(after, int) and before != after:
                verb = "lost" if after < before else "recovered"
                add(f"{label} {verb} {abs(after - before)} HP", "Recheck lethal, Taunt and mana before the next action.")
        if previous.get("taunt") != current.get("taunt"):
            add("Taunt appeared" if current.get("taunt") else "Taunt cleared", "Face is closed." if current.get("taunt") else "Face may now be open.")
        if previous.get("fingerprint") != current.get("fingerprint") and not changes:
            add("Board changed", "Read the new board before committing mana or attacks.")

    snapshot = {key: current.get(key) for key in ("turn", "you_hp", "opp_hp", "taunt", "fingerprint")}
    LAST.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    if changes:
        LESSONS.write_text(json.dumps((changes + history)[:80], indent=2), encoding="utf-8")
    return changes
