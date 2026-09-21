chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "pw-snapshot" && msg.snapshot) {
    chrome.storage.local.set({ lastSnapshot: msg.snapshot });
    sendResponse({ ok: true });
    return;
  }
  if (!msg || msg.type !== "pw-capture") return;
  const windowId = sender.tab && sender.tab.windowId;
  if (windowId == null) {
    sendResponse({ ok: false });
    return;
  }
  chrome.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 32 }, (url) => {
    if (chrome.runtime.lastError || !url) {
      sendResponse({ ok: false });
      return;
    }
    sendResponse({ ok: true, url });
  });
  return true;
});
