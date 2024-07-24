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
exports.MasterPasswordService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../../platform/enums");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const symmetric_crypto_key_1 = require("../../../platform/models/domain/symmetric-crypto-key");
const state_1 = require("../../../platform/state");
const force_set_password_reason_1 = require("../../models/domain/force-set-password-reason");
/** Memory since master key shouldn't be available on lock */
const MASTER_KEY = new state_1.UserKeyDefinition(state_1.MASTER_PASSWORD_MEMORY, "masterKey", {
    deserializer: (masterKey) => symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(masterKey),
    clearOn: ["lock", "logout"],
});
/** Disk since master key hash is used for unlock */
const MASTER_KEY_HASH = new state_1.UserKeyDefinition(state_1.MASTER_PASSWORD_DISK, "masterKeyHash", {
    deserializer: (masterKeyHash) => masterKeyHash,
    clearOn: ["logout"],
});
/** Disk to persist through lock */
const MASTER_KEY_ENCRYPTED_USER_KEY = new state_1.UserKeyDefinition(state_1.MASTER_PASSWORD_DISK, "masterKeyEncryptedUserKey", {
    deserializer: (key) => key,
    clearOn: ["logout"],
});
/** Disk to persist through lock and account switches */
const FORCE_SET_PASSWORD_REASON = new state_1.UserKeyDefinition(state_1.MASTER_PASSWORD_DISK, "forceSetPasswordReason", {
    deserializer: (reason) => reason,
    clearOn: ["logout"],
});
class MasterPasswordService {
    constructor(stateProvider, stateService, keyGenerationService, encryptService) {
        this.stateProvider = stateProvider;
        this.stateService = stateService;
        this.keyGenerationService = keyGenerationService;
        this.encryptService = encryptService;
    }
    masterKey$(userId) {
        if (userId == null) {
            throw new Error("User ID is required.");
        }
        return this.stateProvider.getUser(userId, MASTER_KEY).state$;
    }
    masterKeyHash$(userId) {
        if (userId == null) {
            throw new Error("User ID is required.");
        }
        return this.stateProvider.getUser(userId, MASTER_KEY_HASH).state$;
    }
    forceSetPasswordReason$(userId) {
        if (userId == null) {
            throw new Error("User ID is required.");
        }
        return this.stateProvider
            .getUser(userId, FORCE_SET_PASSWORD_REASON)
            .state$.pipe((0, rxjs_1.map)((reason) => reason !== null && reason !== void 0 ? reason : force_set_password_reason_1.ForceSetPasswordReason.None));
    }
    // TODO: Remove this method and decrypt directly in the service instead
    getMasterKeyEncryptedUserKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            const key = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUser(userId, MASTER_KEY_ENCRYPTED_USER_KEY).state$);
            return enc_string_1.EncString.fromJSON(key);
        });
    }
    setMasterKey(masterKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (masterKey == null) {
                throw new Error("Master key is required.");
            }
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            yield this.stateProvider.getUser(userId, MASTER_KEY).update((_) => masterKey);
        });
    }
    clearMasterKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            yield this.stateProvider.getUser(userId, MASTER_KEY).update((_) => null);
        });
    }
    setMasterKeyHash(masterKeyHash, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (masterKeyHash == null) {
                throw new Error("Master key hash is required.");
            }
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            yield this.stateProvider.getUser(userId, MASTER_KEY_HASH).update((_) => masterKeyHash);
        });
    }
    clearMasterKeyHash(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            yield this.stateProvider.getUser(userId, MASTER_KEY_HASH).update((_) => null);
        });
    }
    setMasterKeyEncryptedUserKey(encryptedKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encryptedKey == null) {
                throw new Error("Encrypted Key is required.");
            }
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            yield this.stateProvider
                .getUser(userId, MASTER_KEY_ENCRYPTED_USER_KEY)
                .update((_) => encryptedKey.toJSON());
        });
    }
    setForceSetPasswordReason(reason, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reason == null) {
                throw new Error("Reason is required.");
            }
            if (userId == null) {
                throw new Error("User ID is required.");
            }
            yield this.stateProvider.getUser(userId, FORCE_SET_PASSWORD_REASON).update((_) => reason);
        });
    }
    decryptUserKeyWithMasterKey(masterKey, userKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            userKey !== null && userKey !== void 0 ? userKey : (userKey = yield this.getMasterKeyEncryptedUserKey(userId));
            masterKey !== null && masterKey !== void 0 ? masterKey : (masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterKey$(userId)));
            if (masterKey == null) {
                throw new Error("No master key found.");
            }
            // Try one more way to get the user key if it still wasn't found.
            if (userKey == null) {
                const deprecatedKey = yield this.stateService.getEncryptedCryptoSymmetricKey({
                    userId: userId,
                });
                if (deprecatedKey == null) {
                    throw new Error("No encrypted user key found.");
                }
                userKey = new enc_string_1.EncString(deprecatedKey);
            }
            let decUserKey;
            if (userKey.encryptionType === enums_1.EncryptionType.AesCbc256_B64) {
                decUserKey = yield this.encryptService.decryptToBytes(userKey, masterKey);
            }
            else if (userKey.encryptionType === enums_1.EncryptionType.AesCbc256_HmacSha256_B64) {
                const newKey = yield this.keyGenerationService.stretchKey(masterKey);
                decUserKey = yield this.encryptService.decryptToBytes(userKey, newKey);
            }
            else {
                throw new Error("Unsupported encryption type.");
            }
            if (decUserKey == null) {
                return null;
            }
            return new symmetric_crypto_key_1.SymmetricCryptoKey(decUserKey);
        });
    }
}
exports.MasterPasswordService = MasterPasswordService;
//# sourceMappingURL=master-password.service.js.map