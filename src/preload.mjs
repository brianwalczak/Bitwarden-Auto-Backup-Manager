import { contextBridge, ipcRenderer, shell } from "electron";
import log from "electron-log/renderer.js";

contextBridge.exposeInMainWorld("log", {
    info: (...args) => log.info(...args),
    warn: (...args) => log.warn(...args),
    error: (...args) => log.error(...args),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
    once: (channel, callback) => ipcRenderer.once(channel, (event, ...args) => callback(event, ...args)),
});

contextBridge.exposeInMainWorld("shell", {
    openExternal: (url) => shell.openExternal(url),
});
