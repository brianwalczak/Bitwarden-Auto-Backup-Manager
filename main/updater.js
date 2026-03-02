import { app, dialog, shell } from "electron";
import { compareVersions, satisfies } from "compare-versions";
import log from "electron-log/main.js";

import { getWindow } from "./window.js";

const SCHEMA_VERSION = 1;
const POLICY_SEVERITY = { critical: 3, required: 2, recommended: 1, optional: 0 }; // to-do: maybe add a custom update message based on the policy "recommended" or "optional"?? right now it's not doing anything special; channel will already direct the user to the latest version...

async function checkForUpdates() {
    try {
        const req = await fetch(`https://brianwalczak.github.io/Bitwarden-Auto-Backup-Manager/schemas/v${SCHEMA_VERSION}.json`);

        if (!req.ok) {
            return log.warn("[Main Process] Failed to check for updates (update schema not found), skipping.");
        }

        const res = await req.json();

        if (res.schemaVersion && res.schemaVersion !== SCHEMA_VERSION) {
            return log.warn("[Main Process] Failed to check for updates (schema version mismatch), skipping.");
        }

        const currentVersion = app.getVersion();
        const major = currentVersion.split(".")[0];
        const channel = res?.channels?.[major];

        if (!channel) log.warn(`[Main Process] Failed to check for latest update version (v${major} channel not found).`);

        const latest = channel?.latest ?? res?.latestVersion; // include legacy thingy
        if (!latest) return; // better to not say anything than to say wrong information

        const upToDate = compareVersions(currentVersion, latest) >= 0;
        const downloadUrl = channel?.downloadUrl ?? res?.channels[Math.max(...Object.keys(res.channels).map(Number))]?.downloadUrl ?? res?.downloadUrl ?? "https://github.com/brianwalczak/Bitwarden-Auto-Backup-Manager/releases"; // include legacy thingy too

        const policy = (res.updatePolicies || [])
            .filter((policy) => policy.targetVersions ? satisfies(currentVersion, policy.targetVersions) : true) // only policies targeting this version (or all)
            .sort((a, b) => (POLICY_SEVERITY[b.action] ?? 0) - (POLICY_SEVERITY[a.action] ?? 0))[0]; // take the most severe policy!!
        
        if (policy && (POLICY_SEVERITY[policy.action] ?? 0) >= POLICY_SEVERITY.required) {
            const isCritical = (POLICY_SEVERITY[policy.action] ?? 0) >= POLICY_SEVERITY.critical;

            dialog.showMessageBox({
                type: "warning",
                title: "Update Required",
                message: "Update Required",
                detail: policy.message || `A ${isCritical ? "critical" : "required"} update has been released. You must update to continue using Bitwarden Auto-Backup Manager.`,
                buttons: isCritical ? ["Update Now", "Cancel"] : ["Update Now", "Cancel", "Ignore (not recommended)"],
                defaultId: 0,
                cancelId: 1,
                modal: true,
            })
            .then(async (response) => {
                if (response.response === 0) {
                    await shell.openExternal(downloadUrl);
                    process.exit();
                } else if (response.response === 1) {
                    process.exit();
                } else if (response.response === 2) {
                    log.warn("[Main Process] User ignored required update, danger.");
                }
            })
            .catch(() => {});
        } else {
            getWindow()?.webContents.send("version", {
                currentVersion,
                upToDate: upToDate,
                downloadUrl: downloadUrl
            });
        }
    } catch (error) {
        log.error("[Main Process] Unable to check for new updates (unknown error):", error);
    }
}

export { checkForUpdates };