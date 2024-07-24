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
exports.KeyGenerationService = void 0;
const kdf_config_1 = require("../../auth/models/domain/kdf-config");
const enums_1 = require("../enums");
const utils_1 = require("../misc/utils");
const symmetric_crypto_key_1 = require("../models/domain/symmetric-crypto-key");
class KeyGenerationService {
    constructor(cryptoFunctionService) {
        this.cryptoFunctionService = cryptoFunctionService;
    }
    createKey(bitLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.cryptoFunctionService.aesGenerateKey(bitLength);
            return new symmetric_crypto_key_1.SymmetricCryptoKey(key);
        });
    }
    createKeyWithPurpose(bitLength, purpose, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (salt == null) {
                const bytes = yield this.cryptoFunctionService.randomBytes(32);
                salt = utils_1.Utils.fromBufferToUtf8(bytes);
            }
            const material = yield this.cryptoFunctionService.aesGenerateKey(bitLength);
            const key = yield this.cryptoFunctionService.hkdf(material, salt, purpose, 64, "sha256");
            return { salt, material, derivedKey: new symmetric_crypto_key_1.SymmetricCryptoKey(key) };
        });
    }
    deriveKeyFromMaterial(material, salt, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.cryptoFunctionService.hkdf(material, salt, purpose, 64, "sha256");
            return new symmetric_crypto_key_1.SymmetricCryptoKey(key);
        });
    }
    deriveKeyFromPassword(password, salt, kdfConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let key = null;
            if (kdfConfig.kdfType == null || kdfConfig.kdfType === enums_1.KdfType.PBKDF2_SHA256) {
                if (kdfConfig.iterations == null) {
                    kdfConfig.iterations = kdf_config_1.PBKDF2KdfConfig.ITERATIONS.defaultValue;
                }
                key = yield this.cryptoFunctionService.pbkdf2(password, salt, "sha256", kdfConfig.iterations);
            }
            else if (kdfConfig.kdfType == enums_1.KdfType.Argon2id) {
                if (kdfConfig.iterations == null) {
                    kdfConfig.iterations = kdf_config_1.Argon2KdfConfig.ITERATIONS.defaultValue;
                }
                if (kdfConfig.memory == null) {
                    kdfConfig.memory = kdf_config_1.Argon2KdfConfig.MEMORY.defaultValue;
                }
                if (kdfConfig.parallelism == null) {
                    kdfConfig.parallelism = kdf_config_1.Argon2KdfConfig.PARALLELISM.defaultValue;
                }
                const saltHash = yield this.cryptoFunctionService.hash(salt, "sha256");
                key = yield this.cryptoFunctionService.argon2(password, saltHash, kdfConfig.iterations, kdfConfig.memory * 1024, // convert to KiB from MiB
                kdfConfig.parallelism);
            }
            else {
                throw new Error("Unknown Kdf.");
            }
            return new symmetric_crypto_key_1.SymmetricCryptoKey(key);
        });
    }
    stretchKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKey = new Uint8Array(64);
            const encKey = yield this.cryptoFunctionService.hkdfExpand(key.key, "enc", 32, "sha256");
            const macKey = yield this.cryptoFunctionService.hkdfExpand(key.key, "mac", 32, "sha256");
            newKey.set(new Uint8Array(encKey));
            newKey.set(new Uint8Array(macKey), 32);
            return new symmetric_crypto_key_1.SymmetricCryptoKey(newKey);
        });
    }
}
exports.KeyGenerationService = KeyGenerationService;
//# sourceMappingURL=key-generation.service.js.map