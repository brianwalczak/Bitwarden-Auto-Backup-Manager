import { dialog } from "electron";
import log from "electron-log/main.js";
import fs from "node:fs/promises";
import path from "node:path";

import { exportVault } from "../utils/vault/export.js"; // Exports a user vault from their Bitwarden Desktop configuration
import { getSettings, updateSettings } from "./settings.js";
import { getFileName, saveFile } from "../utils/utils.js";
import { getWindow } from "./window.js";
import { globals } from "./shared.js";

// Performs a backup of the user's vault and saves to backup directory
async function performBackup(uid) {
    const settings = await getSettings();

    try {
        const encBackup = await exportVault(globals.config.data, uid);
        const file = getFileName({ encrypted: true });
        const folder = path.join(settings.folder, uid);

        await saveFile(path.join(folder, file), encBackup, { recursive: true });
        await checkOldBackups(); // Check all old backups to see if the configuration by the user exceeded

        const backups = await collectBackups(settings.folder);
        getWindow()?.webContents.send("backups", backups);

        return { success: true, location: path.join(folder, file) };
    } catch (error) {
        log.error("[Main Process] Unable to perform backup for user " + uid + ":", error);
        return { success: false, reason: error.toString() };
    }
}

// Deletes old backups if they are more than the user specified to hold at once
async function checkOldBackups() {
    const settings = await getSettings();

    for (const user of settings.users) {
        try {
            const folder = path.join(settings.folder, user.uid);
            const files = await fs.readdir(folder);
            const keeping = Number(settings.keeping);
            if (files.length <= keeping) continue; // Don't continue if the limit hasn't yet been exceeded

            const fileStats = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(folder, file);
                    const stats = await fs.stat(filePath);
                    return { filePath, birthtimeMs: stats.birthtimeMs };
                })
            );

            fileStats.sort((a, b) => a.birthtimeMs - b.birthtimeMs); // Sort oldest first
            const toDelete = fileStats.slice(0, fileStats.length - keeping);

            for (const file of toDelete) {
                await fs.unlink(file.filePath);
            }
        } catch {
            continue;
        }
    }

    return true;
}

// Checks for upcoming backups in the background
async function backgroundBackupCheck() {
    try {
        const settings = await getSettings();

        for (const user of settings.users) {
            if (user.nextDate && Date.now() >= user.nextDate) {
                const backup = await performBackup(user.uid); // Perform and save the backup

                user.nextDate = getNextBackup(settings.occurrence); // Schedule the next backup time
                if (backup.success) user.lastBackup = Date.now(); // Set the last backup time
                await updateSettings(settings);

                getWindow()?.webContents.send("settings", settings); // Send the updated settings to the renderer process
            }
        }

        globals.silentBgError = false; // it was successful, remove the silent error flag
    } catch (error) {
        if (!globals.silentBgError) {
            log.error("[Main Process] Unable to perform background backup check:", error);
            dialog.showErrorBox("Background Backup Error", `Failed to check for upcoming scheduled backups.\n\n${error.toString()}`);
            globals.silentBgError = true; // set flag to true to prevent multiple error popups
        }
    }

    return true;
}

// Get the next backup date in Epoch time based on occurrence
function getNextBackup(occurrence) {
    let now = new Date();

    switch (occurrence) {
        case "day":
            now.setDate(now.getDate() + 1);
            break;
        case "week":
            now.setDate(now.getDate() + 7);
            break;
        case "month":
            now.setMonth(now.getMonth() + 1);
            break;
        default: // day
            now.setDate(now.getDate() + 1);
    }

    return now.getTime();
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

export { performBackup, backgroundBackupCheck, collectBackups };