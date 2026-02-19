import { app, BrowserWindow, Menu, Notification, Tray, ipcMain, shell, dialog } from "electron";
import { isDeepStrictEqual } from "node:util";
import log from "electron-log/main.js";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import { exportVault } from "./utils/vault/export.js"; // Exports a user vault from their Bitwarden Desktop configuration
import { restoreBackup } from "./utils/vault/restore.js"; // Restores a user vault from their KDF iteration and master password (w/ PBKDF2 only)
import { readFile, compareVersions, mergeDeep, fileExists, sanitizeString } from "./utils/utils.js";

let win = null; // Global variable to hold the window instance
let tray = null; // Global variable to hold the tray instance
let statusCache = null;
let config = {
    data: null, // User path to Bitwarden Desktop data.json file (will be defined later)
    settings: path.join(app.getPath("userData"), "settings.json"), // User app configuration file
};

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

    app.on("second-instance", () => {
        // Someone tried to run a second instance while this one is already open, focus the existing window
        if (win) {
            win.show();
            win.reload();
            win.focus();
        }
    });

    // Create the window when the app is ready
    app.whenReady().then(createWindow);
}

// Creates prompt window for input (used for master password input during restore)
function prompt(config) {
    return new Promise((resolve) => {
        const modal = new BrowserWindow({
            parent: win,
            modal: true,
            show: false,
            width: 420,
            height: 140 + (config?.fields?.length || 1) * 65,
            resizable: false,
            frame: false,
            webPreferences: {
                preload: path.join(import.meta.dirname, "src/components/prompt/preload.mjs"),
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        modal.loadFile(path.join(import.meta.dirname, "src/components/prompt/index.html"));

        modal.webContents.once("did-finish-load", () => {
            modal.webContents.send("init", config);
        });

        const onceResponse = (_, data) => {
            ipcMain.removeListener("response", onceResponse);

            modal.destroy();
            resolve(data);
        };

        ipcMain.once("response", onceResponse);
        modal.once("ready-to-show", () => modal.show());
    });
}

// Check for software updates via GitHub
async function checkForUpdates(window) {
    try {
        const req = await fetch("https://brianwalczak.github.io/Bitwarden-Auto-Backup-Manager/version.json");
        const res = await req.json();
        res.currentVersion = app.getVersion();

        if (compareVersions(res.currentVersion, "<", res.latestVersion) && res.requireUpdate) {
            dialog
                .showMessageBox({
                    type: "warning",
                    title: "Update Required",
                    message: `Update Required`,
                    detail: `A critical update has been released (v${res.latestVersion}). You must update to continue using Bitwarden Auto-Backup Manager.`,
                    buttons: ["Update Now", "Cancel", "Ignore (not recommended)"],
                    defaultId: 0,
                    cancelId: 1,
                    modal: true,
                })
                .then(async (response) => {
                    if (response.response === 0) {
                        await shell.openExternal(res.downloadUrl);
                        process.exit();
                    } else if (response.response === 1) {
                        process.exit();
                    } else if (response.response === 2) {
                        log.warn("[Main Process] User ignored critical update, danger.");
                    }
                })
                .catch((err) => {});
        } else {
            res.upToDate = compareVersions(res.currentVersion, "==", res.latestVersion);
            window.webContents.send("version", res);
        }
    } catch (error) {
        log.error("[Main Process] Unable to check for new updates (version information):", error);
    }
}

// Creates the system tray app icon
async function updateTray(statusText = null) {
    if (!tray) {
        tray = new Tray(app.isPackaged ? path.join(process.resourcesPath, "icon.ico") : path.join(import.meta.dirname, "build", "icon.ico"));
        tray.setToolTip("Bitwarden Auto-Backup Manager");

        tray.on("click", () => {
            win.show();
            win.reload();
            win.focus();
        });
    }

    const menu = Menu.buildFromTemplate([
        {
            label: statusText ?? "⚠️ Last automatic backup: Never",
            enabled: false,
        },
        { type: "separator" },
        {
            label: "Backup Now",
            click: () => {
                // already opens at home page
                win.reload();
                win.show();
                win.focus();
            },
        },
        {
            label: "Restore Backup",
            click: async () => await restoreHandler(),
        },
        { type: "separator" },
        {
            label: "Settings",
            click: () => {
                win.show();
                win.webContents.send("tray_click", { action: "settings" });
            },
        },
        {
            label: "View Logs",
            click: () => {
                win.show();
                win.webContents.send("tray_click", { action: "backups" });
            },
        },
        { type: "separator" },
        { label: "Exit", click: () => app.exit() },
    ]);

    return tray.setContextMenu(menu);
}

// Decrypts the file provided with a master password
async function decryptFile(backup, masterPassword) {
    try {
        const settings = await getSettings();

        const decBackup = await restoreBackup(backup, masterPassword);
        const folder = path.join(settings.folder, "Restored");
        const file = `Backup Restore (${Date.now()}).json`;

        await fs.mkdir(folder, { recursive: true }); // Create restore directory if doesn't exist
        await fs.writeFile(path.join(folder, file), JSON.stringify(decBackup, null, "  "), "utf8");
        return { success: true, location: path.join(folder, file) };
    } catch (error) {
        log.error("[Main Process] Unable to decrypt a backup file:", error);
        return { success: false, reason: error.toString() };
    }
}

// Get the users from the Bitwarden Desktop app
async function getActiveUsers(active = false) {
    const data = await readFile(config.data);
    if (!data || (!data.global_account_accounts && (!data.global_account_activeAccountId || !data?.[data.global_account_activeAccountId]?.profile))) return null;

    const searchable = data?.global_account_accounts ?? {
        [data.global_account_activeAccountId]: {
            name: data?.[data.global_account_activeAccountId]?.profile?.name ?? null,
            email: data?.[data.global_account_activeAccountId]?.profile?.email ?? null,
        },
    };
    let users = [];

    try {
        users = Object.entries(searchable)
            .filter(([uid, account]) => {
                return typeof uid === "string" && uid.trim() !== "" && typeof account?.email === "string" && account.email.trim() !== ""; // filter out deleted accounts or invalid ones (check if UID and email are both valid)
            })
            .map(([uid, account]) => ({
                name: account.name && account.name.trim() !== "" ? account.name : null,
                email: account.email, // already filtered above
                uid, // already filtered above
                region: data?.[`user_${uid}_environment_environment`]?.region?.trim() || "US",
            }));
    } catch (error) {
        log.error("[Main Process] Unable to fetch users from Bitwarden Desktop app:", error);
        return null;
    }

    if (!active) return users;

    try {
        const settings = await getSettings();
        if (!settings || !settings.users) return users;

        for (const user of users) {
            if (settings.users.some((u) => u.uid === user.uid)) {
                user.active = true;
            } else {
                user.active = false;
            }
        }
    } catch (error) {
        log.error("[Main Process] Unable to fetch active user status from settings:", error);

        for (const user of users) {
            user.active = false;
        }
    }

    return users;
}

// Get the settings from the settings file
async function getSettings() {
    try {
        const settings = await readFile(config.settings);

        if (settings?.users) {
            const users = await getActiveUsers(false);
            settings.users = settings.users.filter((user) => users.find((u) => u.uid === user.uid)); // If the user is not found in the Bitwarden Desktop app, remove them from the settings
        }

        const data = {
            occurrence: settings?.occurrence ?? "day",
            folder: (settings?.folder ?? path.join(os.homedir(), "Bitwarden Backups")).replaceAll("\\", "/"),
            keeping: settings?.keeping ?? 50,
            users: settings?.users ?? [],
        };

        if (!isDeepStrictEqual(settings, data)) {
            await fs.writeFile(config.settings, JSON.stringify(data, null, 2));
        }

        // Update the tray status with existing data (included here to prevent large I/O reads)
        let latestBackup = 0;
        let oldStatus = statusCache;

        for (const user of data.users) {
            if (user?.lastBackup && user.lastBackup > latestBackup) {
                latestBackup = user.lastBackup;
            }
        }

        statusCache = latestBackup > 0 ? `✅ Last automatic backup: ${new Date(latestBackup).toISOString().replace("T", " ").replace("Z", "").split(".")[0]}` : "⚠️ Last automatic backup: Never";

        if (oldStatus !== statusCache) {
            updateTray(statusCache);
        }

        return data;
    } catch (error) {
        log.warn("[Main Process] Unable to read the settings file, using generic settings configuration:", error);

        return {
            occurrence: "day",
            folder: path.join(os.homedir(), "Bitwarden Backups"),
            keeping: 50,
            users: [],
        };
    }
}

// Update the settings to the settings file
async function updateSettings(data) {
    const settings = await getSettings();
    if (!data || typeof data !== "object") return { success: false, reason: "Error: Unable to read settings data." };

    try {
        if (data.folder) data.folder = data.folder.replaceAll("\\", "/"); // Replace all "\" occurrences in the directory with "/"

        mergeDeep(settings, data);
        await fs.writeFile(config.settings, JSON.stringify(settings, null, 2));

        return { success: true, data: settings };
    } catch (error) {
        log.error("[Main Process] Unable to update the settings file:", error);
        return { success: false, reason: error.toString() };
    }
}

// Collects all backups from the user's backup folder
async function collectBackups(folder) {
    const backups = [];

    try {
        await fs.mkdir(folder, { recursive: true }); // Create requested directory if doesn't exist
        const fileList = await fs.readdir(folder, { withFileTypes: true });
        const folders = fileList.filter((file) => file.isDirectory() && file.name !== "Restored");
        const oldFiles = fileList.filter((file) => file.isFile() && file.name.endsWith(".json")); // add support for old backups (v1.3.0 and below)

        for (const dir of folders) {
            const dirPath = path.join(folder, dir.name);
            const files = (await fs.readdir(dirPath, { withFileTypes: true })).filter((file) => file.isFile() && file.name.endsWith(".json"));

            for (const file of files) {
                const filePath = path.join(dirPath, file.name);
                const stats = await fs.stat(filePath);

                backups.push({
                    id: dir.name,
                    name: file.name.replace(".json", ""),
                    createdAt: stats.birthtimeMs,
                    size: stats.size,
                    location: filePath,
                });
            }
        }

        for (const file of oldFiles) {
            const filePath = path.join(folder, file.name);
            const stats = await fs.stat(filePath);

            backups.push({
                id: "main directory",
                name: file.name.replace(".json", ""),
                createdAt: stats.birthtimeMs,
                size: stats.size,
                location: filePath,
            });
        }
    } catch (error) {
        log.error("[Main Process] Failed to read saved backups from " + folder + ":", error);
        return [];
    }

    return backups.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

async function restoreHandler(data = null) {
    try {
        if (typeof data === "string" && path.extname(data)) {
            data = await readFile(data);
        } else {
            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
                title: "Select a Backup",
                buttonLabel: "Restore",
                filters: [{ name: "Bitwarden Vault (.json)", extensions: ["json"] }],
                properties: ["openFile"],
            });

            if (canceled || filePaths.length === 0) return null;
            data = await readFile(filePaths[0]);
        }
    } catch (error) {
        log.error("[Main Process] Unable to read the requested backup file to restore:", error);
        return dialog.showErrorBox("Restore Failed", `Unable to read your backup file. Make sure it exists and is a valid vault backup.\n\n${error.toString()}`);
    }

    if (!data) {
        log.error("[Main Process] No data found to restore from the backup file.");
        return dialog.showErrorBox("Restore Failed", "Your backup file appears to be unreadable or in an unsupported format. Please select a valid vault backup.");
    }

    if (data.encrypted === false) {
        log.warn("[Main Process] Unencrypted backup file detected, skipping decryption and warning.");
        return dialog.showErrorBox("Restore Skipped", "The backup file you selected is already unencrypted.");
    }

    prompt({
        title: "Restore from Backup",
        fields: [{ label: "Master Password", attributes: { type: "password", required: true } }],
        cancelLabel: "Cancel",
        confirmLabel: "Restore Vault",
    })
        .then(async (input) => {
            if (!input?.[0]) return;
            const password = input[0];

            const decryption = await decryptFile(data, password);
            if (!decryption.success) {
                log.error("[Main Process] Unable to decrypt the backup file with the provided master password:", decryption);
                return dialog.showErrorBox("Decryption Failed", `Could not decrypt your backup file. Please verify your master password and that the file isn't corrupted.\n\n${decryption.reason}`);
            }

            shell.showItemInFolder(decryption.location);
            dialog.showMessageBox({
                type: "info",
                title: "Restore Complete",
                message: `Vault Restored Successfully`,
                detail: `Your vault has been decrypted and saved locally. Keep this file safe - it contains all of your unencrypted vault data.`,
                buttons: ["OK"],
            });

            return true;
        })
        .catch((err) => {
            log.error("[Main Process] Unknown error while restoring from backup:", err);
            return dialog.showErrorBox("Restore Failed", `An unknown error occurred during the restore process.\n\n${err.toString()}`);
        });
}

async function createWindow() {
    win = new BrowserWindow({
        width: 750,
        height: 600,
        resizable: false,
        show: !process.argv.includes("--quiet"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(import.meta.dirname, "src/preload.mjs"),
        },
    });

    win.loadFile(path.join(import.meta.dirname, "src/index.html"));

    if (process.platform === "win32") {
        app.setAppUserModelId(app.name); // Set the app name for notifications
    }

    // Top navigation menu buttons and functions
    const menu = Menu.buildFromTemplate([
        {
            label: "About",
            click() {
                dialog
                    .showMessageBox({
                        type: "info",
                        title: "Bitwarden Auto-Backup Manager",
                        message: `Software Details`,
                        detail: `Bitwarden Auto-Backup Manager v${app.getVersion()}\nDeveloped by Brian Walczak\nIf you find this software useful, please consider supporting its development.\n\n© ${new Date().getFullYear()} Brian Walczak`,
                        buttons: ["Support Me", "GitHub Repository", "OK"],
                        cancelId: 2,
                    })
                    .then((response) => {
                        switch (response.response) {
                            case 0: // Support button clicked
                                shell.openExternal("https://ko-fi.com/brianwalczak");
                                break;
                            case 1: // Learn More button clicked
                                shell.openExternal("https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager");
                                break;
                            default:
                                break;
                        }
                    })
                    .catch((err) => {});
            },
        },
        {
            label: "Help",
            click() {
                shell.openExternal("https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager");
            },
        },
        {
            label: "Restart",
            click() {
                win.reload();
            },
        },
        {
            label: "Quit",
            click() {
                win.hide();
            },
        },
    ]);
    Menu.setApplicationMenu(menu);

    win.on("close", (event) => {
        event.preventDefault();
        win.hide(); // Hide the window instead to keep it running in the background
    });

    win.webContents.on("did-finish-load", async () => {
        checkForUpdates(win); // Check for updates to inform user
        const settings = await getSettings();
        const backups = await collectBackups(settings.folder);

        try {
            const users = await getActiveUsers(true);
            if (users) win.webContents.send("users", users);

            win.webContents.send("settings", settings);
            win.webContents.send("backups", backups);
        } catch (error) {
            return log.error("[Main Process] Error while loading the window page:", error);
        }
    });

    ipcMain.on("backup", async (event, user) => {
        const users = await getActiveUsers(false);
        const isUser = users.some((u) => u.uid === user.uid);

        if (!isUser) {
            log.error(`[Main Process] User not found in Bitwarden Desktop app during backup attempt (user ${user.uid || "unknown"}).`);
            return dialog.showErrorBox("User Not Found", "This account was not found in Bitwarden Desktop. Make sure you've logged in with this account at least once.");
        }

        const backup = await performBackup(user.uid);
        if (!backup.success) {
            log.error(`[Main Process] Error, backup failed for user (${user.uid || "unknown"}):`, backup.reason);
            return dialog.showErrorBox("Backup Failed", `Could not back up your vault. Ensure Bitwarden Desktop is installed and you have an active internet connection.\n\n${backup.reason}`);
        }

        const notification = new Notification({
            title: "Backup Completed",
            body: `Your backup has been successfully completed for your Bitwarden vault. Click to open.`,
        });

        notification.show();
        notification.on("click", (event, arg) => {
            shell.showItemInFolder(backup.location);
        });
    });

    ipcMain.on("settings", async (event, settings) => {
        const update = await updateSettings(settings);
        if (!update.success) {
            log.error("[Main Process] Failed to update settings with data:", settings);
            return dialog.showErrorBox("Settings Update Failed", `Could not save your settings. Check that your configuration file isn't corrupted and you have write permissions.\n\n${update.reason}`);
        }

        win.webContents.send("settings", update.data); // Send the updated settings to the renderer process
        return new Notification({ title: "Settings Updated", body: "Your settings have been updated successfully." }).show();
    });

    ipcMain.on("toggle", async (event, user) => {
        const users = await getActiveUsers(true);
        const isUser = users.find((u) => u.uid === user.uid);

        if (!isUser) {
            log.error(`[Main Process] User not found in Bitwarden Desktop app during toggle attempt (user ${user.uid || "unknown"}).`);
            return dialog.showErrorBox("User Not Found", "This account was not found in Bitwarden Desktop. Make sure you've logged in with this account at least once.");
        }

        const settings = await getSettings();
        const index = settings.users.findIndex((u) => u.uid === user.uid);

        if (index !== -1) {
            // User already exists, disable backups
            settings.users.splice(index, 1);
            isUser.active = false;
        } else {
            // User doesn't exist, enable backups
            settings.users.push({
                uid: user.uid,
                lastBackup: null,
                nextDate: Date.now(),
            });
            isUser.active = true;
        }

        const update = await updateSettings(settings);
        if (!update.success) {
            log.error("[Main Process] Failed to update settings with data:", settings);
            return dialog.showErrorBox("Settings Update Failed", `Could not save your settings. Check that your configuration file isn't corrupted and you have write permissions.\n\n${update.reason}`);
        }

        new Notification({ title: `Backups ${isUser.active ? "Enabled" : "Disabled"}`, body: `You have successfully ${isUser.active ? "enabled" : "disabled"} backups for your Bitwarden account.` }).show();
        win.webContents.send("users", users); // Send the updated users to the renderer process
    });

    ipcMain.on("restore", async (event, data = null) => {
        return restoreHandler(data);
    });

    await updateTray();
}

// Get the next backup date in Epoch time based on settings
async function getNextBackup() {
    const settings = await getSettings();

    let currentTime = Date.now();
    let equationInMs = 0;

    switch (settings.occurrence) {
        case "day":
            equationInMs = 24 * 60 * 60 * 1000;
            break;
        case "week":
            equationInMs = 7 * 24 * 60 * 60 * 1000;
            break;
        case "month":
            equationInMs = 30 * 24 * 60 * 60 * 1000;
            break;
        default:
            equationInMs = 24 * 60 * 60 * 1000;
    }

    return currentTime + equationInMs;
}

// Deletes old backups if they are more than the user specified to hold at once
async function checkOldBackups() {
    const settings = await getSettings();

    for (const user of settings.users) {
        try {
            const folder = path.join(settings.folder, user.uid);
            const files = await fs.readdir(folder);
            if (files.length <= Number(settings.keeping)) continue; // Don't continue if the limit hasn't yet been exceeded

            let oldestFile = null;
            let oldestBirthtime = Infinity;

            for (const file of files) {
                const filePath = path.join(folder, file);
                const stats = await fs.stat(filePath);

                if (stats.birthtimeMs < oldestBirthtime) {
                    oldestFile = filePath;
                    oldestBirthtime = stats.birthtimeMs;
                }
            }

            if (oldestFile) await fs.unlink(oldestFile); // Delete the oldest file to free up space
        } catch (error) {
            continue;
        }
    }

    return true;
}

// Performs a backup of the user's vault and saves to backup directory
async function performBackup(uid) {
    const settings = await getSettings();

    try {
        const encBackup = await exportVault(config.data, uid);
        const formattedDate = new Date()
            .toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, "-");
        const file = `${formattedDate} (${Date.now()}).json`;
        const folder = path.join(settings.folder, uid);

        await fs.mkdir(folder, { recursive: true }); // Create backup directory if doesn't exist
        await fs.writeFile(path.join(folder, file), JSON.stringify(encBackup, null, 2), "utf8");
        await checkOldBackups(); // Check all old backups to see if the configuration by the user exceeded

        const backups = await collectBackups(settings.folder);
        win.webContents.send("backups", backups);

        return { success: true, location: path.join(folder, file) };
    } catch (error) {
        log.error("[Main Process] Unable to perform backup for user " + uid + ":", error);
        return { success: false, reason: error.toString() };
    }
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
        dialog.showErrorBox("Bitwarden Not Found", "Could not locate the neccessary app data for the Bitwarden Desktop app. Please install Bitwarden Desktop and sync your vault first.");
        process.exit();
    } else if (isStandard) {
        config.data = bitwardenData.standard;
    } else if (isMicrosoft) {
        config.data = bitwardenData.microsoft;
    }
}

// Checks for upcoming backups in the background
async function backgroundBackupCheck() {
    try {
        const settings = await getSettings();

        for (const user of settings.users) {
            if (user.nextDate && Date.now() >= user.nextDate) {
                const backup = await performBackup(user.uid); // Perform and save the backup

                user.nextDate = await getNextBackup(); // Schedule the next backup time
                if (backup.success) user.lastBackup = Date.now(); // Set the last backup time
                await updateSettings(settings);

                win.webContents.send("settings", settings); // Send the updated settings to the renderer process
            }

            continue;
        }
    } catch (error) {
        log.error("[Main Process] Unable to perform background backup check:", error);
        dialog.showErrorBox("Background Backup Error", `Failed to check for upcoming scheduled backups.\n\n${error.toString()}`);
        process.exit();
    }

    return true;
}

app.on("window-all-closed", () => {
    // Prevent the app from quitting on all windows closed, leave
});

// Run when the app is ready and started
app.on("ready", async () => {
    // Enable auto-backup to run in the background at startup
    app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath("exe"),
        args: ["--quiet"],
    });

    // Simple check if the user has the Bitwarden Desktop app and proper data installed.
    await checkRequirements();
});

// Create a window when the app is activated (if one doesn't exist)
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Run backup check every minute **at all times**
// This can run like this, because whenever a user closes the software, it will always run in the background
// Don't worry, it takes up little memory, whilelist ensuring that your vault is always backed up! :)
setInterval(backgroundBackupCheck, 60000);
