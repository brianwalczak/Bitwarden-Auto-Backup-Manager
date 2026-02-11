const fs = require("fs").promises;

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
    } catch (error) {
        return null;
    }
}

// Complex function to compare versions (written by Viktor)
function compareVersions(v1, comparator, v2) {
    "use strict";
    var comparator = comparator == "=" ? "==" : comparator;
    if (["==", "===", "<", "<=", ">", ">=", "!=", "!=="].indexOf(comparator) == -1) {
        throw new Error("Invalid comparator. " + comparator);
    }
    var v1parts = v1.split("."),
        v2parts = v2.split(".");
    var maxLen = Math.max(v1parts.length, v2parts.length);
    var part1, part2;
    var cmp = 0;
    for (var i = 0; i < maxLen && !cmp; i++) {
        part1 = parseInt(v1parts[i], 10) || 0;
        part2 = parseInt(v2parts[i], 10) || 0;
        if (part1 < part2) cmp = 1;
        if (part1 > part2) cmp = -1;
    }
    return eval("0" + comparator + cmp);
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
    } catch (error) {
        return false;
    }
}

const sanitizeString = (str) => {
    if (typeof str !== "string") str = str.toString();

    const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b/gi;
    return str.replaceAll(emailRegex, "[email redacted]");
};

module.exports = {
    joinUrl,
    readFile,
    compareVersions,
    mergeDeep,
    fileExists,
    sanitizeString,
};
