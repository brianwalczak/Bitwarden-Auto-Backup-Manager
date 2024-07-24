"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ENCRYPTED_ORGANIZATION_KEYS = void 0;
const state_1 = require("../../state");
exports.USER_ENCRYPTED_ORGANIZATION_KEYS = state_1.UserKeyDefinition.record(state_1.CRYPTO_DISK, "organizationKeys", {
    deserializer: (obj) => obj,
    clearOn: ["logout"],
});
//# sourceMappingURL=org-keys.state.js.map