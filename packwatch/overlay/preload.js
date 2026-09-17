const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("packwatch", {
  onAdvice: (fn) => {
    ipcRenderer.on("advice", (_e, data) => fn(data));
  },
});
