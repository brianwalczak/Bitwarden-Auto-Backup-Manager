import keytar from "keytar";
import { dialog } from "electron";
import log from "electron-log/main.js";

async function checkPermissions() {
    // nudge users to grant keychain permission, this will also give mac users a chance to click "Always Allow" (hopefully they do lol)
    try {
        await keytar.findCredentials("Bitwarden");
    } catch { };

    if (process.platform === "darwin") {
        // check for Full Disk Access permission on macOS (for any other OS, we already attempt file reading in platforms.js)
        try {
            const { default: macPerms } = await import("node-mac-permissions");
            const hasFullDiskAccess = macPerms.getAuthStatus("full-disk-access") === "authorized";

            if (!hasFullDiskAccess) {
                const response = await dialog.showMessageBox({
                    type: "warning",
                    title: "Permission Error",
                    message: "Full Disk Access Required",
                    detail: "Bitwarden Auto-Backup Manager needs Full Disk Access to read your Bitwarden Desktop data.\n\nClick 'Grant Access' to open System Settings.",
                    buttons: ["Grant Access", "Ignore"],
                    defaultId: 0,
                    cancelId: 1,
                });

                if (response.response === 0) {
                    macPerms.askForFullDiskAccess();
                    process.exit(); // it just avoids confusion
                }
            }
        } catch (error) {
            log.warn("[Main Process] node-mac-permissions not available, skipping Full Disk Access permission check!!");
        }
    }

    return true;
}

export { checkPermissions };
