"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADD_EDIT_CIPHER_INFO_KEY = exports.LOCAL_DATA_KEY = exports.DECRYPTED_CIPHERS = exports.ENCRYPTED_CIPHERS = void 0;
const state_1 = require("../../../platform/state");
const cipher_data_1 = require("../../models/data/cipher.data");
const cipher_view_1 = require("../../models/view/cipher.view");
exports.ENCRYPTED_CIPHERS = state_1.UserKeyDefinition.record(state_1.CIPHERS_DISK, "ciphers", {
    deserializer: (obj) => cipher_data_1.CipherData.fromJSON(obj),
    clearOn: ["logout"],
});
exports.DECRYPTED_CIPHERS = state_1.UserKeyDefinition.record(state_1.CIPHERS_MEMORY, "decryptedCiphers", {
    deserializer: (cipher) => cipher_view_1.CipherView.fromJSON(cipher),
    clearOn: ["logout", "lock"],
});
exports.LOCAL_DATA_KEY = new state_1.UserKeyDefinition(state_1.CIPHERS_DISK_LOCAL, "localData", {
    deserializer: (localData) => localData,
    clearOn: ["logout"],
});
exports.ADD_EDIT_CIPHER_INFO_KEY = new state_1.UserKeyDefinition(state_1.CIPHERS_MEMORY, "addEditCipherInfo", {
    deserializer: (addEditCipherInfo) => {
        if (addEditCipherInfo == null) {
            return null;
        }
        const cipher = (addEditCipherInfo === null || addEditCipherInfo === void 0 ? void 0 : addEditCipherInfo.cipher.toJSON) != null
            ? addEditCipherInfo.cipher
            : cipher_view_1.CipherView.fromJSON(addEditCipherInfo === null || addEditCipherInfo === void 0 ? void 0 : addEditCipherInfo.cipher);
        return { cipher, collectionIds: addEditCipherInfo.collectionIds };
    },
    clearOn: ["logout", "lock"],
});
//# sourceMappingURL=ciphers.state.js.map