import path from "node:path";
import os from "node:os";

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

        // Other potential paths to check
        path.join(home, "snap/bitwarden/current/.config/Bitwarden/data.json")
    ],
};

export function getPlatformPaths() {
    const platform = process.platform;

    if (platform === "win32" || platform === "darwin") {
        return paths[platform];
    }
    
    return paths.linux; // could be any distro, it's better to check anyway!
}