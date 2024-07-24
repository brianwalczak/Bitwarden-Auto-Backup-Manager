"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VAULT_TIMEOUT = exports.VAULT_TIMEOUT_ACTION = void 0;
const state_1 = require("../../platform/state");
/**
 * Settings use disk storage and local storage on web so settings can persist after logout
 * in order for us to know if the user's chose to never lock their vault or not.
 * When the user has never lock selected, we have to set the user key in memory
 * from the user auto unlock key stored on disk on client bootstrap.
 */
exports.VAULT_TIMEOUT_ACTION = new state_1.UserKeyDefinition(state_1.VAULT_TIMEOUT_SETTINGS_DISK_LOCAL, "vaultTimeoutAction", {
    deserializer: (vaultTimeoutAction) => vaultTimeoutAction,
    clearOn: [], // persisted on logout
});
exports.VAULT_TIMEOUT = new state_1.UserKeyDefinition(state_1.VAULT_TIMEOUT_SETTINGS_DISK_LOCAL, "vaultTimeout", {
    deserializer: (vaultTimeout) => vaultTimeout,
    clearOn: [], // persisted on logout
});
//# sourceMappingURL=vault-timeout-settings.state.js.map