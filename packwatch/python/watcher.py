"""Read-only watcher.

Attaches to Chrome you already play in (CDP) or OCRs the screen.
Never opens ddltcg.com. Never clicks. Never types. Never stores passwords.
"""

from __future__ import annotations

import argparse
import json
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = ROOT / "data" / "live.json"
ADVICE = ROOT / "data" / "advice.json"


def write_live(payload: dict) -> None:
    LIVE.parent.mkdir(parents=True, exist_ok=True)
    payload["ts"] = datetime.now(timezone.utc).isoformat()
    LIVE.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def read_data(path: Path, fallback: dict) -> dict:
    if not path.exists():
        return fallback
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return fallback
    return value if isinstance(value, dict) else fallback


class BridgeHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        if self.path == "/live":
            payload = read_data(LIVE, {"ok": False, "error": "Watcher has not produced a reading yet.", "text": ""})
        elif self.path == "/advice":
            payload = read_data(ADVICE, {"now": "Advice is waiting for the first board read."})
        else:
            self.send_error(404, "Pack Watch bridge exposes /live and /advice only")
            return
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, _format: str, *_args: object) -> None:
        return


def start_bridge(port: int) -> ThreadingHTTPServer:
    server = ThreadingHTTPServer(("127.0.0.1", port), BridgeHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def read_play_tab(browser) -> dict:
    pages = [pg for ctx in browser.contexts for pg in ctx.pages]
    play = next((pg for pg in pages if "ddltcg.com" in (pg.url or "")), None)
    if play is None:
        return {
            "ok": False,
            "mode": "attach",
            "error": "No ddltcg tab in this Chrome. Open the match yourself — Pack Watch will not open it.",
            "text": "",
        }
    text = play.locator("body").inner_text(timeout=4000)
    return {
        "ok": True,
        "mode": "attach",
        "url": play.url,
        "title": play.title(),
        "text": text,
        "error": "",
    }


def attach_loop(cdp: str, interval: float) -> None:
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = None
        while True:
            try:
                if browser is None:
                    browser = p.chromium.connect_over_cdp(cdp)
                state = read_play_tab(browser)
            except Exception as exc:
                browser = None
                state = {
                    "ok": False,
                    "mode": "attach",
                    "error": f"CDP not ready ({exc}). Start Chrome with --remote-debugging-port=9222 or use --mode screen.",
                    "text": "",
                }
            write_live(state)
            err = state.get("error")
            print(err if err else f"ok {len(state.get('text') or '')} chars")
            time.sleep(interval)


def screen() -> dict:
    try:
        import mss
        from PIL import Image
    except ImportError:
        return {"ok": False, "mode": "screen", "error": "Install mss and Pillow.", "text": ""}

    with mss.mss() as sct:
        shot = sct.grab(sct.monitors[1])
        img = Image.frombytes("RGB", shot.size, shot.rgb)
    try:
        import pytesseract

        ocr = pytesseract.image_to_string(img)
    except Exception as exc:
        return {
            "ok": False,
            "mode": "screen",
            "error": f"OCR unavailable ({exc}). Install Tesseract or use --mode attach.",
            "text": "",
        }
    return {"ok": True, "mode": "screen", "text": ocr, "error": "", "url": "", "title": "screen"}


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Pack Watch read-only watcher")
    ap.add_argument("--mode", choices=("attach", "screen"), default="attach")
    ap.add_argument("--cdp", default="http://127.0.0.1:9222")
    ap.add_argument("--interval", type=float, default=1.5)
    ap.add_argument("--http-port", type=int, default=8765)
    args = ap.parse_args()
    print(f"Pack Watch watcher {args.mode} → {LIVE}")
    print("Read only. Will not click, type, or open the play URL.")
    bridge = start_bridge(args.http_port)
    print(f"Read-only bridge → http://127.0.0.1:{args.http_port}/live and /advice")
    try:
        if args.mode == "attach":
            attach_loop(args.cdp, args.interval)
            return
        while True:
            try:
                state = screen()
            except Exception as exc:
                state = {"ok": False, "mode": "screen", "error": str(exc), "text": ""}
            write_live(state)
            err = state.get("error")
            print(err if err else f"ok {len(state.get('text') or '')} chars")
            time.sleep(args.interval)
    finally:
        bridge.shutdown()


if __name__ == "__main__":
    main()
