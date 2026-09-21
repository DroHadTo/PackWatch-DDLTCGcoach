"""Loop: live.json → parser → SKILL → advice.json. Never touches the game."""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from lessons import record_observations
from skill import coach
from state_parser import parse_live

ROOT = Path(__file__).resolve().parents[1]
ADVICE = ROOT / "data" / "advice.json"
LESSONS = ROOT / "data" / "lessons.json"


def load_json(path: Path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return fallback


def tick() -> dict:
    parsed = parse_live()
    lessons = load_json(LESSONS, [])
    observations = record_observations(parsed)
    if parsed.get("error") and not parsed.get("raw"):
        advice = {
            "now": parsed["error"],
            "why": "Watcher is waiting. You open the match.",
            "dont": [],
            "legal": [],
            "turn": "unknown",
            "taunt": False,
        }
    else:
        advice = coach(parsed.get("board_raw") or parsed.get("raw") or "", lessons, parsed)
        advice["you_hp"] = parsed.get("you_hp")
        advice["opp_hp"] = parsed.get("opp_hp")
        advice["mode"] = parsed.get("mode")
        advice["board_state"] = {
            key: parsed.get(key)
            for key in (
                "turn",
                "round",
                "you_hp",
                "opp_hp",
                "mana",
                "mana_cap",
                "threats",
                "labels",
            )
        }
    advice["observations"] = observations
    advice["updated_at"] = parsed.get("ts")
    advice["fingerprint"] = parsed.get("fingerprint")
    ADVICE.parent.mkdir(parents=True, exist_ok=True)
    ADVICE.write_text(json.dumps(advice, indent=2), encoding="utf-8")
    return advice


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--loop", action="store_true")
    ap.add_argument("--interval", type=float, default=1.0)
    args = ap.parse_args()
    print(f"Pack Watch brain → {ADVICE}")
    while True:
        advice = tick()
        print(advice.get("now", ""))
        if not args.loop:
            break
        time.sleep(args.interval)


if __name__ == "__main__":
    main()
