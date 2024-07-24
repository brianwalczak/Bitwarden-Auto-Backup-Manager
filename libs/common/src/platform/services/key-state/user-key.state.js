"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_KEY = exports.USER_ENCRYPTED_PRIVATE_KEY = exports.USER_EVER_HAD_USER_KEY = void 0;
const symmetric_crypto_key_1 = require("../../models/domain/symmetric-crypto-key");
const state_1 = require("../../state");
exports.USER_EVER_HAD_USER_KEY = new state_1.UserKeyDefinition(state_1.CRYPTO_DISK, "everHadUserKey", {
    deserializer: (obj) => obj,
    clearOn: ["logout"],
});
exports.USER_ENCRYPTED_PRIVATE_KEY = new state_1.UserKeyDefinition(state_1.CRYPTO_DISK, "privateKey", {
    deserializer: (obj) => obj,
    clearOn: ["logout"],
});
exports.USER_KEY = new state_1.UserKeyDefinition(state_1.CRYPTO_MEMORY, "userKey", {
    deserializer: (obj) => symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(obj),
    clearOn: ["logout", "lock"],
});
//# sourceMappingURL=user-key.state.js.map