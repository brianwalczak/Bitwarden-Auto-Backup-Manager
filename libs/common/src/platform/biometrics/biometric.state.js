"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINGERPRINT_VALIDATED = exports.PROMPT_AUTOMATICALLY = exports.PROMPT_CANCELLED = exports.DISMISSED_REQUIRE_PASSWORD_ON_START_CALLOUT = exports.ENCRYPTED_CLIENT_KEY_HALF = exports.REQUIRE_PASSWORD_ON_START = exports.BIOMETRIC_UNLOCK_ENABLED = void 0;
const state_1 = require("../state");
/**
 * Indicates whether the user elected to store a biometric key to unlock their vault.
 */
exports.BIOMETRIC_UNLOCK_ENABLED = new state_1.UserKeyDefinition(state_1.BIOMETRIC_SETTINGS_DISK, "biometricUnlockEnabled", {
    deserializer: (obj) => obj,
    clearOn: [],
});
/**
 * Boolean indicating the user has elected to require a password to use their biometric key upon starting the application.
 *
 * A true setting controls whether {@link ENCRYPTED_CLIENT_KEY_HALF} is set.
 */
exports.REQUIRE_PASSWORD_ON_START = new state_1.UserKeyDefinition(state_1.BIOMETRIC_SETTINGS_DISK, "requirePasswordOnStart", {
    deserializer: (value) => value,
    clearOn: [],
});
/**
 * If the user has elected to require a password on first unlock of an application instance, this key will store the
 * encrypted client key half used to unlock the vault.
 *
 * For operating systems without application-level key storage, this key half is concatenated with a signature
 * provided by the OS and used to encrypt the biometric key prior to storage.
 */
exports.ENCRYPTED_CLIENT_KEY_HALF = new state_1.UserKeyDefinition(state_1.BIOMETRIC_SETTINGS_DISK, "clientKeyHalf", {
    deserializer: (obj) => obj,
    clearOn: ["logout"],
});
/**
 * Indicates the user has been warned about the security implications of using biometrics and, depending on the OS,
 * recommended to require a password on first unlock of an application instance.
 */
exports.DISMISSED_REQUIRE_PASSWORD_ON_START_CALLOUT = new state_1.UserKeyDefinition(state_1.BIOMETRIC_SETTINGS_DISK, "dismissedBiometricRequirePasswordOnStartCallout", {
    deserializer: (obj) => obj,
    clearOn: [],
});
/**
 * Stores whether the user has elected to cancel the biometric prompt. This is stored on disk due to process-reload
 * wiping memory state. We don't want to prompt the user again if they've elected to cancel.
 */
exports.PROMPT_CANCELLED = state_1.KeyDefinition.record(state_1.BIOMETRIC_SETTINGS_DISK, "promptCancelled", {
    deserializer: (obj) => obj,
});
/**
 * Stores whether the user has elected to automatically prompt for biometric unlock on application start.
 */
exports.PROMPT_AUTOMATICALLY = new state_1.UserKeyDefinition(state_1.BIOMETRIC_SETTINGS_DISK, "promptAutomatically", {
    deserializer: (obj) => obj,
    clearOn: [],
});
/**
 * Stores whether or not IPC handshake has been validated this session.
 */
exports.FINGERPRINT_VALIDATED = new state_1.KeyDefinition(state_1.BIOMETRIC_SETTINGS_DISK, "fingerprintValidated", {
    deserializer: (obj) => obj,
});
//# sourceMappingURL=biometric.state.js.map