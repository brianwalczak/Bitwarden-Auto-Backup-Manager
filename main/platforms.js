import glob from "glob";
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
        const [config, appdata] = await Promise.all([
            glob(path.join(home, "snap/bitwarden/*/.config/Bitwarden/data.json")),
            glob(path.join(home, "snap/bitwarden/*/appdata/data.json")),
        ]);

        return [...config, ...appdata];
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