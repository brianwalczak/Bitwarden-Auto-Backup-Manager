import fs from "node:fs/promises";
import * as nodePath from "node:path";

function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

function joinUrl(base, path) {
    return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

// Reads a JSON file and returns its content
async function readFile(path) {
    try {
        const data = await fs.readFile(path, "utf8");
        const jsonData = JSON.parse(data);

        return jsonData;
    } catch {
        return null;
    }
}

async function saveFile(path, data, { recursive = false, avoidOverwrite = false } = {}, increment = 0) {
    let { dir, name, ext } = nodePath.parse(path);
    
    if (recursive) {
        await fs.mkdir(dir, { recursive: true });
    }

    if (typeof data === "object") {
        data = JSON.stringify(data, null, 2);
    }

    try {
        if (increment > 0) {
            name = `${name} (${increment})`;
        }

        await fs.writeFile(nodePath.join(dir, (name + ext)), data, { encoding: "utf8", ...(avoidOverwrite && { flag: "wx" }) });
    } catch (error) {
        if (error.code === "EEXIST" && avoidOverwrite) {
            increment++;
            return await saveFile(path, data, { recursive, avoidOverwrite }, increment);
        }

        throw error;
    }
}

// Complex function to create a deep merge of JSON objects (written by Salakar)
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

// Function to check if a file/directory exists in the system
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true; // File exists
    } catch {
        return false;
    }
}

// Similar to https://github.com/bitwarden/clients/blob/e82669b99969bbdbc0c815e530043d8ca79ab8d6/libs/tools/export/vault-export/vault-export-core/src/services/export-helper.ts#L1
function getFileName({ encrypted = true, date = new Date() } = {}) {
    const dateString = [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0'),
        date.getHours().toString().padStart(2, '0'),
        date.getMinutes().toString().padStart(2, '0'),
        date.getSeconds().toString().padStart(2, '0')
    ].join('');

    return `bitwarden_${encrypted ? "encrypted_" : "decrypted_"}export_${dateString}.json`;
}

const sanitizeString = (str) => {
    if (typeof str !== "string") str = str.toString();

    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b/gi;
    return str.replaceAll(emailRegex, "[email redacted]");
};

export { joinUrl, readFile, saveFile, mergeDeep, fileExists, getFileName, sanitizeString };
