import { ipcMain, dialog, shell } from "electron";
import log from "electron-log/main.js";

import { getSettings, updateSettings } from "./settings.js";
import { restoreHandler } from "./restore.js";
import { performBackup } from "./backup.js";
import { getActiveUsers } from "./users.js";
import { getWindow } from "./window.js";

async function injectIpcHandlers() {
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

        getWindow().webContents.send("toast", {
            title: "Backup Completed",
            body: "Your backup has been successfully completed for your Bitwarden vault.",
            link: { label: "Show in folder", channel: "open-path", data: backup.location, closeOnClick: true },
        });
    });

    ipcMain.on("settings", async (event, settings) => {
        const update = await updateSettings(settings);
        if (!update.success) {
            log.error("[Main Process] Failed to update settings with data:", settings);
            return dialog.showErrorBox("Settings Update Failed", `Could not save your settings. Check that your configuration file isn't corrupted and you have write permissions.\n\n${update.reason}`);
        }

        getWindow().webContents.send("settings", update.data); // Send the updated settings to the renderer process
        return getWindow().webContents.send("toast", { title: "Settings Updated", body: "Your settings have been updated successfully." });
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

        getWindow().webContents.send("toast", { title: `Backups ${isUser.active ? "Enabled" : "Disabled"}`, body: `You have successfully ${isUser.active ? "enabled" : "disabled"} backups for your Bitwarden account.` });
        getWindow().webContents.send("users", users); // Send the updated users to the renderer process
    });

    ipcMain.on("restore", async (event, data = null) => {
        return restoreHandler(data);
    });

    ipcMain.on("open-path", (event, filePath) => {
        shell.showItemInFolder(filePath);
    });
}

export { injectIpcHandlers };