"""Read-only HTTP bridge for Packwatch.

Serves GET /live and GET /advice from local JSON. Never clicks. CORS open so
the hosted coach can poll from the user's browser.
"""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
LIVE = DATA / "live.json"
ADVICE = DATA / "advice.json"
HOST = "127.0.0.1"
PORT = 8765


def read_json(path: Path, fallback: dict) -> dict:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return fallback


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        print("bridge", fmt % args)

    def _send(self, payload: dict, code: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Accept, Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._send({"ok": True})

    def do_GET(self) -> None:  # noqa: N802
        path = self.path.split("?", 1)[0]
        if path in ("/live", "/"):
            live = read_json(LIVE, {"ok": False, "error": "Watcher has not written live.json yet.", "text": ""})
            text = live.get("text") or live.get("error") or ""
            self._send(
                {
                    "board": text,
                    "text": text,
                    "ok": bool(live.get("ok")),
                    "mode": live.get("mode") or "",
                    "error": live.get("error") or "",
                    "source": "Local Packwatch watcher",
                }
            )
            return
        if path == "/advice":
            advice = read_json(
                ADVICE,
                {
                    "now": "Waiting for brain.py",
                    "why": "",
                    "dont": [],
                    "legal": [],
                },
            )
            self._send(
                {
                    "observed": advice.get("why") or advice.get("raw") or "Local board read",
                    "recommendation": advice.get("now") or advice.get("advice") or "",
                    "confidence": "High for printed rules. Unknown until the board is complete.",
                    "source": "Local Packwatch watcher",
                    "steps": advice.get("dont") or [],
                    "legal": advice.get("legal") or [],
                }
            )
            return
        self._send({"error": "Not found. Use /live or /advice."}, 404)


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    print(f"Packwatch bridge http://{HOST}:{PORT}/live  (read only)")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
