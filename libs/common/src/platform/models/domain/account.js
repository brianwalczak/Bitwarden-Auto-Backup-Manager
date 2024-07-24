"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.AccountProfile = exports.AccountKeys = exports.EncryptionPair = void 0;
const utils_1 = require("../../misc/utils");
const symmetric_crypto_key_1 = require("./symmetric-crypto-key");
class EncryptionPair {
    toJSON() {
        return {
            encrypted: this.encrypted,
            decrypted: this.decrypted instanceof ArrayBuffer
                ? utils_1.Utils.fromBufferToByteString(this.decrypted)
                : this.decrypted,
        };
    }
    static fromJSON(obj, decryptedFromJson, encryptedFromJson) {
        if (obj == null) {
            return null;
        }
        const pair = new EncryptionPair();
        if ((obj === null || obj === void 0 ? void 0 : obj.encrypted) != null) {
            pair.encrypted = encryptedFromJson
                ? encryptedFromJson(obj.encrypted)
                : obj.encrypted;
        }
        if ((obj === null || obj === void 0 ? void 0 : obj.decrypted) != null) {
            pair.decrypted = decryptedFromJson
                ? decryptedFromJson(obj.decrypted)
                : obj.decrypted;
        }
        return pair;
    }
}
exports.EncryptionPair = EncryptionPair;
class AccountKeys {
    constructor() {
        /** @deprecated July 2023, left for migration purposes*/
        this.cryptoSymmetricKey = new EncryptionPair();
    }
    toJSON() {
        // If you pass undefined into fromBufferToByteString, you will get an empty string back
        // which will cause all sorts of headaches down the line when you try to getPublicKey
        // and expect a Uint8Array and get an empty string instead.
        return utils_1.Utils.merge(this, {
            publicKey: this.publicKey ? utils_1.Utils.fromBufferToByteString(this.publicKey) : undefined,
        });
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(new AccountKeys(), obj, {
            cryptoSymmetricKey: EncryptionPair.fromJSON(obj === null || obj === void 0 ? void 0 : obj.cryptoSymmetricKey, symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON),
            publicKey: utils_1.Utils.fromByteStringToArray(obj === null || obj === void 0 ? void 0 : obj.publicKey),
        });
    }
    static initRecordEncryptionPairsFromJSON(obj) {
        return EncryptionPair.fromJSON(obj, (decObj) => {
            if (obj == null) {
                return null;
            }
            const record = {};
            for (const id in decObj) {
                record[id] = symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(decObj[id]);
            }
            return record;
        });
    }
}
exports.AccountKeys = AccountKeys;
class AccountProfile {
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(new AccountProfile(), obj);
    }
}
exports.AccountProfile = AccountProfile;
class Account {
    constructor(init) {
        this.keys = new AccountKeys();
        this.profile = new AccountProfile();
        Object.assign(this, {
            keys: Object.assign(Object.assign({}, new AccountKeys()), init === null || init === void 0 ? void 0 : init.keys),
            profile: Object.assign(Object.assign({}, new AccountProfile()), init === null || init === void 0 ? void 0 : init.profile),
        });
    }
    static fromJSON(json) {
        if (json == null) {
            return null;
        }
        return Object.assign(new Account({}), json, {
            keys: AccountKeys.fromJSON(json === null || json === void 0 ? void 0 : json.keys),
            profile: AccountProfile.fromJSON(json === null || json === void 0 ? void 0 : json.profile),
        });
    }
}
exports.Account = Account;
//# sourceMappingURL=account.js.map