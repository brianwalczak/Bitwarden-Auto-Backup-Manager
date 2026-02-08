const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("promptAPI", {
    init: (config) => ipcRenderer.once("init", config),
    submit: (data) => ipcRenderer.send("response", data),
    cancel: () => ipcRenderer.send("response", null),
});
