import { isDeepStrictEqual } from "node:util";
import log from "electron-log/main.js";
import path from "node:path";
import os from "node:os";

import { readFile, saveFile, mergeDeep } from "../utils/utils.js";
import { updateStatusCache } from "./tray.js";
import { getActiveUsers } from "./users.js";
import { globals } from "./shared.js";

// Get the settings from the settings file
async function getSettings() {
    try {
        const settings = await readFile(globals.config.settings);

        const data = {
            occurrence: settings?.occurrence ?? "day",
            folder: (settings?.folder ?? path.join(os.homedir(), "Bitwarden Backups")).replaceAll("\\", "/"),
            keeping: settings?.keeping ?? 50,
            users: settings?.users ?? [],
        };

        if (!isDeepStrictEqual(settings, data)) {
            await saveFile(globals.config.settings, data);
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

        const users = await getActiveUsers(false);
        if (users) {
            settings.users = settings.users.filter((user) => users.find((u) => u.uid === user.uid));
        }

        await saveFile(globals.config.settings, settings);
        await updateStatusCache(settings.users);

        return { success: true, data: settings };
    } catch (error) {
        log.error("[Main Process] Unable to update the settings file:", error);
        return { success: false, reason: error.toString() };
    }
}

export { getSettings, updateSettings };