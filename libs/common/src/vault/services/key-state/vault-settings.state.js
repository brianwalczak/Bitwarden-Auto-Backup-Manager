"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHOW_IDENTITIES_CURRENT_TAB = exports.SHOW_CARDS_CURRENT_TAB = exports.USER_ENABLE_PASSKEYS = void 0;
const state_1 = require("../../../platform/state");
exports.USER_ENABLE_PASSKEYS = new state_1.KeyDefinition(state_1.VAULT_SETTINGS_DISK, "enablePasskeys", {
    deserializer: (obj) => obj,
});
exports.SHOW_CARDS_CURRENT_TAB = new state_1.UserKeyDefinition(state_1.VAULT_SETTINGS_DISK, "showCardsCurrentTab", {
    deserializer: (obj) => obj,
    clearOn: [], // do not clear user settings
});
exports.SHOW_IDENTITIES_CURRENT_TAB = new state_1.UserKeyDefinition(state_1.VAULT_SETTINGS_DISK, "showIdentitiesCurrentTab", {
    deserializer: (obj) => obj,
    clearOn: [], // do not clear user settings
});
//# sourceMappingURL=vault-settings.state.js.map