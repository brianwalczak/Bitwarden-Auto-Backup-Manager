import { app, dialog, shell } from "electron";
import { compareVersions } from "compare-versions";
import log from "electron-log/main.js";

import { getWindow } from "./window.js";

async function checkForUpdates() {
    try {
        const req = await fetch("https://brianwalczak.github.io/Bitwarden-Auto-Backup-Manager/version.json");
        const res = await req.json();
        res.currentVersion = app.getVersion();

        if (compareVersions(res.currentVersion, res.latestVersion) === -1 && res.requireUpdate) {
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
                .catch(() => {});
        } else {
            res.upToDate = compareVersions(res.currentVersion, res.latestVersion) === 0;
            getWindow().webContents.send("version", res);
        }
    } catch (error) {
        log.error("[Main Process] Unable to check for new updates (version information):", error);
    }
}

export { checkForUpdates };