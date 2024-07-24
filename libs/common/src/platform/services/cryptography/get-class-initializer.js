"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassInitializer = getClassInitializer;
const cipher_1 = require("../../../vault/models/domain/cipher");
const cipher_view_1 = require("../../../vault/models/view/cipher.view");
const initializer_key_1 = require("./initializer-key");
/**
 * Internal reference of classes so we can reconstruct objects properly.
 * Each entry should be keyed using the Decryptable.initializerKey property
 */
const classInitializers = {
    [initializer_key_1.InitializerKey.Cipher]: cipher_1.Cipher.fromJSON,
    [initializer_key_1.InitializerKey.CipherView]: cipher_view_1.CipherView.fromJSON,
};
function getClassInitializer(className) {
    return classInitializers[className];
}
//# sourceMappingURL=get-class-initializer.js.map