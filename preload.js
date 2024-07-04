const { contextBridge, ipcRenderer, shell } = require('electron');

// Enable ipcRenderer to work in index.html
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(event, ...args)),
    once: (channel, callback) => ipcRenderer.once(channel, (event, ...args) => callback(event, ...args))
});

// Enable shell URL launching to work in index.html
contextBridge.exposeInMainWorld('shell', {
    openExternal: (url) => shell.openExternal(url)
});