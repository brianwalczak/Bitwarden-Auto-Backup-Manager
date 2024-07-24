"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagEnabled = flagEnabled;
exports.devFlagEnabled = devFlagEnabled;
exports.devFlagValue = devFlagValue;
function getFlags(envFlags) {
    if (typeof envFlags === "string") {
        return JSON.parse(envFlags);
    }
    else {
        return envFlags;
    }
}
/**
 * Gets the value of a feature flag from environment.
 * All flags default to "on" (true).
 * Only use for shared code in `libs`, otherwise use the client-specific function.
 * @param flag The name of the feature flag to check
 * @returns The value of the flag
 */
function flagEnabled(flag) {
    const flags = getFlags(process.env.FLAGS);
    return flags[flag] == null || !!flags[flag];
}
/**
 * Gets the value of a dev flag from environment.
 * Will always return false unless in development.
 * Only use for shared code in `libs`, otherwise use the client-specific function.
 * @param flag The name of the dev flag to check
 * @returns The value of the flag
 */
function devFlagEnabled(flag) {
    if (process.env.ENV !== "development") {
        return false;
    }
    const devFlags = getFlags(process.env.DEV_FLAGS);
    return (devFlags === null || devFlags === void 0 ? void 0 : devFlags[flag]) == null ? false : !!devFlags[flag];
}
/**
 * Gets the value of a dev flag from environment.
 * Will always return false unless in development.
 * @param flag The name of the dev flag to check
 * @returns The value of the flag
 * @throws Error if the flag is not enabled
 */
function devFlagValue(flag) {
    if (!devFlagEnabled(flag)) {
        throw new Error(`This method should not be called, it is protected by a disabled dev flag.`);
    }
    const devFlags = getFlags(process.env.DEV_FLAGS);
    return devFlags[flag];
}
//# sourceMappingURL=flags.js.map