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
exports.EncryptServiceImplementation = void 0;
const utils_1 = require("../../../platform/misc/utils");
const enums_1 = require("../../enums");
const enc_array_buffer_1 = require("../../models/domain/enc-array-buffer");
const enc_string_1 = require("../../models/domain/enc-string");
const encrypted_object_1 = require("../../models/domain/encrypted-object");
const symmetric_crypto_key_1 = require("../../models/domain/symmetric-crypto-key");
class EncryptServiceImplementation {
    constructor(cryptoFunctionService, logService, logMacFailures) {
        this.cryptoFunctionService = cryptoFunctionService;
        this.logService = logService;
        this.logMacFailures = logMacFailures;
    }
    encrypt(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No encryption key provided.");
            }
            if (plainValue == null) {
                return Promise.resolve(null);
            }
            let plainBuf;
            if (typeof plainValue === "string") {
                plainBuf = utils_1.Utils.fromUtf8ToArray(plainValue);
            }
            else {
                plainBuf = plainValue;
            }
            const encObj = yield this.aesEncrypt(plainBuf, key);
            const iv = utils_1.Utils.fromBufferToB64(encObj.iv);
            const data = utils_1.Utils.fromBufferToB64(encObj.data);
            const mac = encObj.mac != null ? utils_1.Utils.fromBufferToB64(encObj.mac) : null;
            return new enc_string_1.EncString(encObj.key.encType, data, iv, mac);
        });
    }
    encryptToBytes(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No encryption key provided.");
            }
            const encValue = yield this.aesEncrypt(plainValue, key);
            let macLen = 0;
            if (encValue.mac != null) {
                macLen = encValue.mac.byteLength;
            }
            const encBytes = new Uint8Array(1 + encValue.iv.byteLength + macLen + encValue.data.byteLength);
            encBytes.set([encValue.key.encType]);
            encBytes.set(new Uint8Array(encValue.iv), 1);
            if (encValue.mac != null) {
                encBytes.set(new Uint8Array(encValue.mac), 1 + encValue.iv.byteLength);
            }
            encBytes.set(new Uint8Array(encValue.data), 1 + encValue.iv.byteLength + macLen);
            return new enc_array_buffer_1.EncArrayBuffer(encBytes);
        });
    }
    decryptToUtf8(encString, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No key provided for decryption.");
            }
            key = this.resolveLegacyKey(key, encString);
            if (key.macKey != null && (encString === null || encString === void 0 ? void 0 : encString.mac) == null) {
                this.logService.error("mac required.");
                return null;
            }
            if (key.encType !== encString.encryptionType) {
                this.logService.error("encType unavailable.");
                return null;
            }
            const fastParams = this.cryptoFunctionService.aesDecryptFastParameters(encString.data, encString.iv, encString.mac, key);
            if (fastParams.macKey != null && fastParams.mac != null) {
                const computedMac = yield this.cryptoFunctionService.hmacFast(fastParams.macData, fastParams.macKey, "sha256");
                const macsEqual = yield this.cryptoFunctionService.compareFast(fastParams.mac, computedMac);
                if (!macsEqual) {
                    this.logMacFailed("mac failed.");
                    return null;
                }
            }
            return yield this.cryptoFunctionService.aesDecryptFast(fastParams, "cbc");
        });
    }
    decryptToBytes(encThing, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No encryption key provided.");
            }
            if (encThing == null) {
                throw new Error("Nothing provided for decryption.");
            }
            key = this.resolveLegacyKey(key, encThing);
            if (key.macKey != null && encThing.macBytes == null) {
                return null;
            }
            if (key.encType !== encThing.encryptionType) {
                return null;
            }
            if (key.macKey != null && encThing.macBytes != null) {
                const macData = new Uint8Array(encThing.ivBytes.byteLength + encThing.dataBytes.byteLength);
                macData.set(new Uint8Array(encThing.ivBytes), 0);
                macData.set(new Uint8Array(encThing.dataBytes), encThing.ivBytes.byteLength);
                const computedMac = yield this.cryptoFunctionService.hmac(macData, key.macKey, "sha256");
                if (computedMac === null) {
                    return null;
                }
                const macsMatch = yield this.cryptoFunctionService.compare(encThing.macBytes, computedMac);
                if (!macsMatch) {
                    this.logMacFailed("mac failed.");
                    return null;
                }
            }
            const result = yield this.cryptoFunctionService.aesDecrypt(encThing.dataBytes, encThing.ivBytes, key.encKey, "cbc");
            return result !== null && result !== void 0 ? result : null;
        });
    }
    rsaEncrypt(data, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data == null) {
                throw new Error("No data provided for encryption.");
            }
            if (publicKey == null) {
                throw new Error("No public key provided for encryption.");
            }
            const encrypted = yield this.cryptoFunctionService.rsaEncrypt(data, publicKey, "sha1");
            return new enc_string_1.EncString(enums_1.EncryptionType.Rsa2048_OaepSha1_B64, utils_1.Utils.fromBufferToB64(encrypted));
        });
    }
    rsaDecrypt(data, privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data == null) {
                throw new Error("No data provided for decryption.");
            }
            let algorithm;
            switch (data.encryptionType) {
                case enums_1.EncryptionType.Rsa2048_OaepSha1_B64:
                case enums_1.EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    algorithm = "sha1";
                    break;
                case enums_1.EncryptionType.Rsa2048_OaepSha256_B64:
                case enums_1.EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
                    algorithm = "sha256";
                    break;
                default:
                    throw new Error("Invalid encryption type.");
            }
            if (privateKey == null) {
                throw new Error("No private key provided for decryption.");
            }
            return this.cryptoFunctionService.rsaDecrypt(data.dataBytes, privateKey, algorithm);
        });
    }
    /**
     * @deprecated Replaced by BulkEncryptService (PM-4154)
     */
    decryptItems(items, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (items == null || items.length < 1) {
                return [];
            }
            // don't use promise.all because this task is not io bound
            const results = [];
            for (let i = 0; i < items.length; i++) {
                results.push(yield items[i].decrypt(key));
            }
            return results;
        });
    }
    hash(value, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashArray = yield this.cryptoFunctionService.hash(value, algorithm);
            return utils_1.Utils.fromBufferToB64(hashArray);
        });
    }
    aesEncrypt(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = new encrypted_object_1.EncryptedObject();
            obj.key = key;
            obj.iv = yield this.cryptoFunctionService.randomBytes(16);
            obj.data = yield this.cryptoFunctionService.aesEncrypt(data, obj.iv, obj.key.encKey);
            if (obj.key.macKey != null) {
                const macData = new Uint8Array(obj.iv.byteLength + obj.data.byteLength);
                macData.set(new Uint8Array(obj.iv), 0);
                macData.set(new Uint8Array(obj.data), obj.iv.byteLength);
                obj.mac = yield this.cryptoFunctionService.hmac(macData, obj.key.macKey, "sha256");
            }
            return obj;
        });
    }
    logMacFailed(msg) {
        if (this.logMacFailures) {
            this.logService.error(msg);
        }
    }
    /**
     * Transform into new key for the old encrypt-then-mac scheme if required, otherwise return the current key unchanged
     * @param encThing The encrypted object (e.g. encString or encArrayBuffer) that you want to decrypt
     */
    resolveLegacyKey(key, encThing) {
        if (encThing.encryptionType === enums_1.EncryptionType.AesCbc128_HmacSha256_B64 &&
            key.encType === enums_1.EncryptionType.AesCbc256_B64) {
            return new symmetric_crypto_key_1.SymmetricCryptoKey(key.key, enums_1.EncryptionType.AesCbc128_HmacSha256_B64);
        }
        return key;
    }
}
exports.EncryptServiceImplementation = EncryptServiceImplementation;
//# sourceMappingURL=encrypt.service.implementation.js.map