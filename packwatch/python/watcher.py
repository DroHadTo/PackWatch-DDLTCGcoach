"""Read-only watcher.

Attaches to Chrome you already play in (CDP) or OCRs the screen.
Never opens ddltcg.com. Never clicks. Never types. Never stores passwords.
"""

from __future__ import annotations

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = ROOT / "data" / "live.json"


def write_live(payload: dict) -> None:
    LIVE.parent.mkdir(parents=True, exist_ok=True)
    payload["ts"] = datetime.now(timezone.utc).isoformat()
    LIVE.write_text(json.dumps(payload, indent=2), encoding="utf-8")


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
    ap = argparse.ArgumentParser(description="Pack Watch read-only watcher")
    ap.add_argument("--mode", choices=("attach", "screen"), default="attach")
    ap.add_argument("--cdp", default="http://127.0.0.1:9222")
    ap.add_argument("--interval", type=float, default=1.5)
    args = ap.parse_args()
    print(f"Pack Watch watcher {args.mode} → {LIVE}")
    print("Read only. Will not click, type, or open the play URL.")
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


if __name__ == "__main__":
    main()
