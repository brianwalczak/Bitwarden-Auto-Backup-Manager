import { app, Menu, Tray } from "electron";
import path from "node:path";

import { restoreHandler } from "./restore.js";
import { showWindow } from "./window.js";

let tray = null; // holds the tray instance
let statusCache = null; // holds cached status to prevent unnecessary tray updates

function spawnTray() {
    if (tray) return; // prevent multiple tray instances
    
    tray = new Tray(app.isPackaged ? path.join(process.resourcesPath, "icon.ico") : path.join(import.meta.dirname, "..", "build", "icon.ico"));
    tray.setToolTip("Bitwarden Auto-Backup Manager");
    tray.on("click", showWindow);
}

// Creates the system tray app icon
async function updateTray(statusText = null) {
    if (!tray) spawnTray();

    const menu = Menu.buildFromTemplate([
        {
            label: statusText ?? "⚠️ Last automatic backup: Never",
            enabled: false,
        },
        { type: "separator" },
        {
            label: "Backup Now",
            click: showWindow,
        },
        {
            label: "Restore Backup",
            click: async () => await restoreHandler(),
        },
        { type: "separator" },
        {
            label: "Settings",
            click: async () => {
                const win = await showWindow();
                win.webContents.send("tray_click", { action: "settings" });
            },
        },
        {
            label: "View Logs",
            click: async () => {
                const win = await showWindow();
                win.webContents.send("tray_click", { action: "backups" });
            },
        },
        { type: "separator" },
        { label: "Exit", click: () => app.exit() },
    ]);

    return tray.setContextMenu(menu);
}

async function updateStatusCache(users) {
    // Update the tray status with existing data (included here to prevent large I/O reads)
    let latestBackup = 0;
    let oldStatus = statusCache;

    for (const user of users) {
        if (user?.lastBackup && user.lastBackup > latestBackup) {
            latestBackup = user.lastBackup;
        }
    }

    statusCache = latestBackup > 0 ? `✅ Last automatic backup: ${new Date(latestBackup).toLocaleString()}` : "⚠️ Last automatic backup: Never";

    if (oldStatus !== statusCache) {
        updateTray(statusCache);
    }
}

export { updateTray, updateStatusCache };