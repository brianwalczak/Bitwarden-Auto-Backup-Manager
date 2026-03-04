import { app, dialog } from "electron";
import log from "electron-log/main.js";

import { sanitizeString } from "../utils/utils.js";
import { showWindow } from "./window.js";
import { backgroundBackupCheck } from "./backup.js";
import { getPlatformPath } from "./platforms.js";
import { globals } from "./shared.js";

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
        
        return showWindow();
    });
}

// Checks if the user has the Bitwarden Desktop app and proper data installed.
// https://bitwarden.com/help/data-storage/
async function checkRequirements() {
    const platformPath = await getPlatformPath();

    if (!platformPath) {
        dialog.showErrorBox("Bitwarden Not Found", "Could not locate the necessary app data for the Bitwarden Desktop app. Please install Bitwarden Desktop and sync your vault first.");
        process.exit();
    }

    globals.config.data = platformPath;
    return true;
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
            args: ["--quiet"],
        });
    }
});

app.on("activate", showWindow);

// Run backup check every minute **at all times**
// This can run like this, because whenever a user closes the software, it will always run in the background
// Don't worry, it takes up little memory, while ensuring that your vault is always backed up! :)
setInterval(backgroundBackupCheck, 60000);
