const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
    once: (channel, callback) => ipcRenderer.once(channel, (event, ...args) => callback(event, ...args))
});

contextBridge.exposeInMainWorld('shell', {
    openExternal: (url) => shell.openExternal(url)
});