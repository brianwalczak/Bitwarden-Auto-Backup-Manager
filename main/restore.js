import { dialog } from "electron";
import log from "electron-log/main.js";
import fs from "node:fs/promises";
import path from "node:path";

import { restoreBackup } from "../utils/vault/restore.js"; // Restores a user vault from their KDF iteration and master password (w/ PBKDF2 only)
import { readFile, getFileName, saveFile } from "../utils/utils.js";
import { getWindow, prompt } from "./window.js";
import { getSettings } from "./settings.js";

async function restoreHandler(data = null) {
    let meta = { date: new Date(), path: null };
    
    try {
        if (typeof data === "string" && path.isAbsolute(data)) {
            const stat = await fs.stat(data);

            meta.path = data;
            meta.date = stat.birthtime;
            data = await readFile(data);
        } else {
            const { canceled, filePaths } = await dialog.showOpenDialog(getWindow() ?? undefined, {
                title: "Select a Backup",
                buttonLabel: "Restore",
                filters: [{ name: "Bitwarden Vault (.json)", extensions: ["json"] }],
                properties: ["openFile"],
            });

            if (canceled || filePaths.length === 0) return null;
            const stat = await fs.stat(filePaths[0]);
            
            meta.path = filePaths[0];
            meta.date = stat.birthtime;
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

            const decryption = await decryptFile(data, password, meta);
            if (!decryption.success) {
                log.error("[Main Process] Unable to decrypt the backup file with the provided master password:", decryption);
                return dialog.showErrorBox("Decryption Failed", `Could not decrypt your backup file. Please verify your master password and that the file isn't corrupted.\n\n${decryption.reason}`);
            }

            getWindow()?.webContents.send("toast", {
                title: "Restore Completed",
                body: "Your vault has been decrypted and saved locally. Keep this file safe - it contains all of your unencrypted vault data.",
                link: { label: "Show in folder", channel: "open-path", data: decryption.location, closeOnClick: true },
            });

            return true;
        })
        .catch((err) => {
            log.error("[Main Process] Unknown error while restoring from backup:", err);
            return dialog.showErrorBox("Restore Failed", `An unknown error occurred during the restore process.\n\n${err.toString()}`);
        });
}

// Decrypts the file provided with a master password
async function decryptFile(backup, masterPassword, meta = {}) {
    try {
        const decBackup = await restoreBackup(backup, masterPassword);
        const file = getFileName({ encrypted: false, date: meta?.date });
        const folder = meta.path ? path.dirname(meta.path) : (await getSettings()).folder;

        await saveFile(path.join(folder, file), decBackup, { recursive: true });
        return { success: true, location: path.join(folder, file) };
    } catch (error) {
        log.error("[Main Process] Unable to decrypt a backup file:", error);
        return { success: false, reason: error.toString() };
    }
}

export { restoreHandler };