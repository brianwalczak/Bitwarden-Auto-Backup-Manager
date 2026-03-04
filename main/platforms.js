import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";

const home = os.homedir();

const paths = {
    win32: [
        path.join(home, "AppData/Roaming/Bitwarden/data.json"),
        path.join(home, "AppData/Local/Packages/8bitSolutionsLLC.bitwardendesktop_h4e712dmw3xyy/LocalCache/Roaming/Bitwarden/data.json"),
    ],
    darwin: [
        path.join(home, "Library/Application Support/Bitwarden/data.json"),
        path.join(home, "Library/Containers/com.bitwarden.desktop/Data/Library/Application Support/Bitwarden/data.json"),
    ],
    linux: [
        path.join(home, ".config/Bitwarden/data.json"),
        path.join(home, ".var/app/com.bitwarden.desktop/config/Bitwarden/data.json"),
        path.join(home, "snap/bitwarden/current/appdata/data.json"),
        path.join(home, "snap/bitwarden/current/.config/Bitwarden/data.json")
    ],
};

async function globCheck() {
    try {
        // Check if snap is using revisions (it's finicky sometimes)
        const snapRoot = path.join(home, "snap", "bitwarden");
        const entries = await fs.readdir(snapRoot, { withFileTypes: true });

        const revisions = entries.filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .filter((name) => name !== "current");

        const paths = [];

        for (const revision of revisions) {
            paths.push(path.join(snapRoot, revision, ".config", "Bitwarden", "data.json"));
            paths.push(path.join(snapRoot, revision, "appdata", "data.json"));
        }

        return paths;
    } catch {
        return [];
    }
}

async function getValidPath(check) {
    for (const path of check) {
        try {
            await fs.access(path, fs.constants.F_OK | fs.constants.R_OK);
            return path;
        } catch {
            continue;
        };
    }

    return null;
}

export async function getPlatformPath() {
    const platform = process.platform;
    let check = [];

    if (platform === "win32" || platform === "darwin") {
        check = paths[platform];
    } else {
        check = paths.linux; // could be any distro, it's better to check anyway!
    }
    
    const valid = await getValidPath(check);

    if (valid) {
        return valid;
    }

    const globPaths = await globCheck();
    return await getValidPath(globPaths);
}

// linux-only implementation to enable open at login
export async function setOpenAtLogin() {
    const dir = path.join(os.homedir(), ".config/autostart");
    const file = path.join(dir, "bitwarden-auto-backup-manager.desktop");

    try {
        await fs.mkdir(dir, { recursive: true });

        const content = `
[Desktop Entry]
Type=Application
Name=Bitwarden Auto-Backup Manager
Exec="${process.execPath}" --quiet
Terminal=false
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
`.trim();

        await fs.writeFile(file, content, { encoding: "utf8" });
    } catch {};
}