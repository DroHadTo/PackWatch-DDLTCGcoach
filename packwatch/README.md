# Pack Watch — desktop HUD

Advice only. You click every card. This process never types, never clicks, never stores passwords.

It attaches to the Chrome window you already play in. It does not open ddltcg.com itself.

## Safe mode: recommended

Use the Pack Watch browser companion's **Watch game** button and select only the
DDL Chrome tab. It uses Chrome's explicit tab-sharing permission; no browser
extension, remote-debugging port, background page attachment, or local screen
capture service is needed. This is the recommended option when endpoint
security blocks automation-like tools.

## 1. Chrome attach mode (optional)

This is an optional compatibility mode, not required for Pack Watch. It uses a
dedicated profile so your daily Chrome stays untouched.

**Windows** (Command Prompt):

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%USERPROFILE%\packwatch-chrome-profile"
```

**macOS:**

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="$HOME/packwatch-chrome-profile"
```

In that window: open https://ddltcg.com/play, log in, queue. Human session.

If that profile ever gets flagged, skip CDP. Play in normal Chrome and use `--mode screen` (OCR). Accuracy drops; Chrome stays a normal client.

## 2. Python watcher + brain

```
cd packwatch
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
python -m playwright install chromium

python python/watcher.py --mode attach
python python/brain.py --loop
```

`watcher.py` writes `data/live.json` every 1.5s. `brain.py` writes `data/advice.json`.

Screen fallback (no CDP):

```
python python/watcher.py --mode screen
```

Keep the play window visible. Needs Tesseract for OCR (`tesseract-ocr` on the PATH).

## 3. Overlay

```
cd overlay
npm install
npm start
```

Five click-through panels. `Ctrl+Shift+F` toggles click-through so you can drag the window.

## Hard rules

- No `page.click`, no `page.type`, no extension, no credentials file.
- If there is no ddltcg tab, the watcher waits. It does **not** open one.
- Wayne (V029) is banned online. Do not register it.

Zero-install path: in the Pack Watch web app, **Coach my live game** — paste the board.
