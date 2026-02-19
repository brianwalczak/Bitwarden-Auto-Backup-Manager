import fs from "node:fs/promises";

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

const sanitizeString = (str) => {
    if (typeof str !== "string") str = str.toString();

    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b/gi;
    return str.replaceAll(emailRegex, "[email redacted]");
};

export { joinUrl, readFile, mergeDeep, fileExists, sanitizeString };
