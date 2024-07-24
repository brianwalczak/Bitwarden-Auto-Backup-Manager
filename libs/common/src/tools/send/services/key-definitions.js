"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEND_USER_DECRYPTED = exports.SEND_USER_ENCRYPTED = void 0;
const state_1 = require("../../../platform/state");
/** Encrypted send state stored on disk */
exports.SEND_USER_ENCRYPTED = state_1.UserKeyDefinition.record(state_1.SEND_DISK, "sendUserEncrypted", {
    deserializer: (obj) => obj,
    clearOn: ["logout"],
});
/** Decrypted send state stored in memory */
exports.SEND_USER_DECRYPTED = new state_1.UserKeyDefinition(state_1.SEND_MEMORY, "sendUserDecrypted", {
    deserializer: (obj) => obj,
    clearOn: ["lock"],
});
//# sourceMappingURL=key-definitions.js.map