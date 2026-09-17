const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

const ADVICE = path.join(__dirname, "..", "data", "advice.json");

let win;
let clickThrough = true;

function readAdvice() {
  try {
    return JSON.parse(fs.readFileSync(ADVICE, "utf8"));
  } catch {
    return { now: "Waiting for brain.py", why: "", dont: [], legal: [], turn: "unknown" };
  }
}

function create() {
  win = new BrowserWindow({
    width: 380,
    height: 740,
    x: 24,
    y: 48,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.setAlwaysOnTop(true, "screen-saver");
  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile(path.join(__dirname, "renderer", "index.html"));
  win.webContents.on("did-finish-load", () => win.webContents.send("advice", readAdvice()));
  setInterval(() => {
    if (win && !win.isDestroyed()) win.webContents.send("advice", readAdvice());
  }, 400);
}

function setClickThrough(value) {
  clickThrough = value;
  if (win && !win.isDestroyed()) win.setIgnoreMouseEvents(clickThrough, { forward: true });
}

app.whenReady().then(() => {
  create();
  globalShortcut.register("CommandOrControl+Shift+F", () => setClickThrough(!clickThrough));
});

app.on("window-all-closed", () => app.quit());
ipcMain.on("ping", () => {});
