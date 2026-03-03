import { app, BrowserWindow, dialog } from "electron";
import { globals } from "./shared.js";
import log from "electron-log/main.js";
import path from "node:path";
import os from "node:os";

import { fileExists, sanitizeString } from "../utils/utils.js";
import { showWindow, createWindow } from "./window.js";
import { backgroundBackupCheck } from "./backup.js";

log.initialize();

["log", "info", "warn", "error", "debug"].forEach((method) => {
    const original = log[method]; // save the original

    log[method] = (...args) => {
        if (args.length > 0) {
            args[0] = sanitizeString(args[0]); // sanitize before logging
        }

        original(...args);
    };
});

// The code below is used so that there's never more than one process of the app running
// It also ensures that, at the same time, it's always running, whether in the foreground or as a background process
// This is required so that the app can periodically check if it's time for a backup

if (!app.requestSingleInstanceLock()) {
    // Check if this instance is the first instance or a second instance
    // If this process not the first instance, force quit
    log.warn("[Main Process] A new instance was launched, but Bitwarden Auto-Backup Manager is already running.");
    process.exit();
} else {
    // If we are the first instance, create the window and detect for other instances

    app.on("second-instance", showWindow); // Someone tried to run a second instance while this one is already open, focus the existing window
    app.whenReady().then(async () => {
        await checkRequirements();
        createWindow();
    });
}

// Checks if the user has the Bitwarden Desktop app and proper data installed.
async function checkRequirements() {
    const bitwardenData = {
        standard: path.join(os.homedir(), "AppData/Roaming/Bitwarden", "data.json"),
        microsoft: path.join(os.homedir(), "AppData/Local/Packages/8bitSolutionsLLC.bitwardendesktop_h4e712dmw3xyy/LocalCache/Roaming/Bitwarden", "data.json"),
    };

    const isStandard = await fileExists(bitwardenData.standard); // Standard app installation (bw desktop)
    const isMicrosoft = await fileExists(bitwardenData.microsoft); // Microsoft Store app installation (bw desktop)

    if (process.platform !== "win32") {
        // Check operating system (in case somebody re-deploys)
        dialog.showErrorBox("Unsupported OS", "Sorry, your operating system is unsupported for Bitwarden Auto-Backup Manager.");
        process.exit();
    }

    if (!isStandard && !isMicrosoft) {
        dialog.showErrorBox("Bitwarden Not Found", "Could not locate the necessary app data for the Bitwarden Desktop app. Please install Bitwarden Desktop and sync your vault first.");
        process.exit();
    } else if (isStandard) {
        globals.config.data = bitwardenData.standard;
    } else if (isMicrosoft) {
        globals.config.data = bitwardenData.microsoft;
    }
}

app.on("window-all-closed", () => {
    // Prevent the app from quitting on all windows closed, leave
});

app.on("before-quit", () => {
    globals.isQuitting = true;
});

// Run when the app is ready and started
app.on("ready", () => {
    // Enable auto-backup to run in the background at startup
    if (app.isPackaged) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath("exe"),
            args: ["--quiet"],
        });
    }
});

// Create a window when the app is activated (if one doesn't exist)
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Run backup check every minute **at all times**
// This can run like this, because whenever a user closes the software, it will always run in the background
// Don't worry, it takes up little memory, while ensuring that your vault is always backed up! :)
setInterval(backgroundBackupCheck, 60000);
