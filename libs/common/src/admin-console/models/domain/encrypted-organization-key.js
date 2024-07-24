"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderEncryptedOrganizationKey = exports.EncryptedOrganizationKey = exports.BaseEncryptedOrganizationKey = void 0;
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const symmetric_crypto_key_1 = require("../../../platform/models/domain/symmetric-crypto-key");
class BaseEncryptedOrganizationKey {
    static fromData(data) {
        switch (data.type) {
            case "organization":
                return new EncryptedOrganizationKey(data.key);
            case "provider":
                return new ProviderEncryptedOrganizationKey(data.key, data.providerId);
            default:
                return null;
        }
    }
    static isProviderEncrypted(key) {
        return key.toData().type === "provider";
    }
}
exports.BaseEncryptedOrganizationKey = BaseEncryptedOrganizationKey;
class EncryptedOrganizationKey {
    constructor(key) {
        this.key = key;
    }
    decrypt(encryptService, privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const decValue = yield encryptService.rsaDecrypt(this.encryptedOrganizationKey, privateKey);
            return new symmetric_crypto_key_1.SymmetricCryptoKey(decValue);
        });
    }
    get encryptedOrganizationKey() {
        return new enc_string_1.EncString(this.key);
    }
    toData() {
        return {
            type: "organization",
            key: this.key,
        };
    }
}
exports.EncryptedOrganizationKey = EncryptedOrganizationKey;
class ProviderEncryptedOrganizationKey {
    constructor(key, providerId) {
        this.key = key;
        this.providerId = providerId;
    }
    decrypt(encryptService, providerKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const decValue = yield encryptService.decryptToBytes(new enc_string_1.EncString(this.key), providerKeys[this.providerId]);
            return new symmetric_crypto_key_1.SymmetricCryptoKey(decValue);
        });
    }
    get encryptedOrganizationKey() {
        return new enc_string_1.EncString(this.key);
    }
    toData() {
        return {
            type: "provider",
            key: this.key,
            providerId: this.providerId,
        };
    }
}
exports.ProviderEncryptedOrganizationKey = ProviderEncryptedOrganizationKey;
//# sourceMappingURL=encrypted-organization-key.js.map