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
exports.CryptoService = void 0;
const bigInt = require("big-integer");
const rxjs_1 = require("rxjs");
const encrypted_organization_key_1 = require("../../admin-console/models/domain/encrypted-organization-key");
const utils_1 = require("../../platform/misc/utils");
const vault_timeout_settings_state_1 = require("../../services/vault-timeout/vault-timeout-settings.state");
const vault_timeout_type_1 = require("../../types/vault-timeout.type");
const enums_1 = require("../enums");
const convert_values_1 = require("../misc/convert-values");
const wordlist_1 = require("../misc/wordlist");
const enc_string_1 = require("../models/domain/enc-string");
const symmetric_crypto_key_1 = require("../models/domain/symmetric-crypto-key");
const org_keys_state_1 = require("./key-state/org-keys.state");
const provider_keys_state_1 = require("./key-state/provider-keys.state");
const user_key_state_1 = require("./key-state/user-key.state");
class CryptoService {
    constructor(pinService, masterPasswordService, keyGenerationService, cryptoFunctionService, encryptService, platformUtilService, logService, stateService, accountService, stateProvider, kdfConfigService) {
        this.pinService = pinService;
        this.masterPasswordService = masterPasswordService;
        this.keyGenerationService = keyGenerationService;
        this.cryptoFunctionService = cryptoFunctionService;
        this.encryptService = encryptService;
        this.platformUtilService = platformUtilService;
        this.logService = logService;
        this.stateService = stateService;
        this.accountService = accountService;
        this.stateProvider = stateProvider;
        this.kdfConfigService = kdfConfigService;
        // User Key
        this.activeUserEverHadUserKey = stateProvider.getActive(user_key_state_1.USER_EVER_HAD_USER_KEY);
        this.everHadUserKey$ = this.activeUserEverHadUserKey.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : false));
        this.activeUserOrgKeys$ = this.stateProvider.activeUserId$.pipe((0, rxjs_1.switchMap)((userId) => (userId != null ? this.orgKeys$(userId) : rxjs_1.NEVER)));
    }
    setUserKey(key, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No key provided. Lock the user to clear the key");
            }
            // Set userId to ensure we have one for the account status update
            [userId, key] = yield this.stateProvider.setUserState(user_key_state_1.USER_KEY, key, userId);
            yield this.stateProvider.setUserState(user_key_state_1.USER_EVER_HAD_USER_KEY, true, userId);
            yield this.storeAdditionalKeys(key, userId);
        });
    }
    refreshAdditionalKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            if (activeUserId == null) {
                throw new Error("Can only refresh keys while there is an active user.");
            }
            const key = yield this.getUserKey(activeUserId);
            yield this.setUserKey(key, activeUserId);
        });
    }
    getInMemoryUserKeyFor$(userId) {
        return this.stateProvider.getUserState$(user_key_state_1.USER_KEY, userId);
    }
    getUserKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userKey = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUserState$(user_key_state_1.USER_KEY, userId));
            return userKey;
        });
    }
    isLegacyUser(masterKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            masterKey !== null && masterKey !== void 0 ? masterKey : (masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId)));
            return yield this.validateUserKey(masterKey, userId);
        });
    }
    // TODO: legacy support for user key is no longer needed since we require users to migrate on login
    getUserKeyWithLegacySupport(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            const userKey = yield this.getUserKey(userId);
            if (userKey) {
                return userKey;
            }
            // Legacy support: encryption used to be done with the master key (derived from master password).
            // Users who have not migrated will have a null user key and must use the master key instead.
            const masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId));
            return masterKey;
        });
    }
    getUserKeyFromStorage(keySuffix, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            const userKey = yield this.getKeyFromStorage(keySuffix, userId);
            if (userKey) {
                if (!(yield this.validateUserKey(userKey, userId))) {
                    this.logService.warning("Invalid key, throwing away stored keys");
                    yield this.clearAllStoredUserKeys(userId);
                }
                return userKey;
            }
        });
    }
    hasUserKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            if (userId == null) {
                return false;
            }
            return yield this.hasUserKeyInMemory(userId);
        });
    }
    hasUserKeyInMemory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            if (userId == null) {
                return false;
            }
            return (yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUserState$(user_key_state_1.USER_KEY, userId))) != null;
        });
    }
    hasUserKeyStored(keySuffix, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getKeyFromStorage(keySuffix, userId)) != null;
        });
    }
    makeUserKey(masterKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!masterKey) {
                const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
                masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId));
            }
            if (masterKey == null) {
                throw new Error("No Master Key found.");
            }
            const newUserKey = yield this.keyGenerationService.createKey(512);
            return this.buildProtectedSymmetricKey(masterKey, newUserKey.key);
        });
    }
    /**
     * Clears the user key. Clears all stored versions of the user keys as well, such as the biometrics key
     * @param userId The desired user
     */
    clearUserKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                // nothing to do
                return;
            }
            // Set userId to ensure we have one for the account status update
            yield this.stateProvider.setUserState(user_key_state_1.USER_KEY, null, userId);
            yield this.clearAllStoredUserKeys(userId);
        });
    }
    clearStoredUserKey(keySuffix, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (keySuffix === enums_1.KeySuffixOptions.Auto) {
                // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.stateService.setUserKeyAutoUnlock(null, { userId: userId });
                // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.clearDeprecatedKeys(enums_1.KeySuffixOptions.Auto, userId);
            }
            if (keySuffix === enums_1.KeySuffixOptions.Pin) {
                // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.pinService.clearPinKeyEncryptedUserKeyEphemeral(userId);
                // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.clearDeprecatedKeys(enums_1.KeySuffixOptions.Pin, userId);
            }
        });
    }
    setMasterKeyEncryptedUserKey(userKeyMasterKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            yield this.masterPasswordService.setMasterKeyEncryptedUserKey(new enc_string_1.EncString(userKeyMasterKey), userId);
        });
    }
    // TODO: Move to MasterPasswordService
    getOrDeriveMasterKey(password, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [resolvedUserId, email] = yield (0, rxjs_1.firstValueFrom)((0, rxjs_1.combineLatest)([this.accountService.activeAccount$, this.accountService.accounts$]).pipe((0, rxjs_1.map)(([activeAccount, accounts]) => {
                var _a;
                userId !== null && userId !== void 0 ? userId : (userId = activeAccount === null || activeAccount === void 0 ? void 0 : activeAccount.id);
                return [userId, (_a = accounts[userId]) === null || _a === void 0 ? void 0 : _a.email];
            })));
            let masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(resolvedUserId));
            return (masterKey || (masterKey = yield this.makeMasterKey(password, email, yield this.kdfConfigService.getKdfConfig())));
        });
    }
    /**
     * Derive a master key from a password and email.
     *
     * @remarks
     * Does not validate the kdf config to ensure it satisfies the minimum requirements for the given kdf type.
     * TODO: Move to MasterPasswordService
     */
    makeMasterKey(password, email, KdfConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.keyGenerationService.deriveKeyFromPassword(password, email, KdfConfig));
        });
    }
    encryptUserKeyWithMasterKey(masterKey, userKey) {
        return __awaiter(this, void 0, void 0, function* () {
            userKey || (userKey = yield this.getUserKey());
            return yield this.buildProtectedSymmetricKey(masterKey, userKey.key);
        });
    }
    // TODO: move to MasterPasswordService
    hashMasterKey(password, key, hashPurpose) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key) {
                const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
                key = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId));
            }
            if (password == null || key == null) {
                throw new Error("Invalid parameters.");
            }
            const iterations = hashPurpose === enums_1.HashPurpose.LocalAuthorization ? 2 : 1;
            const hash = yield this.cryptoFunctionService.pbkdf2(key.key, password, "sha256", iterations);
            return utils_1.Utils.fromBufferToB64(hash);
        });
    }
    // TODO: move to MasterPasswordService
    compareAndUpdateKeyHash(masterPassword, masterKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            const storedPasswordHash = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKeyHash$(userId));
            if (masterPassword != null && storedPasswordHash != null) {
                const localKeyHash = yield this.hashMasterKey(masterPassword, masterKey, enums_1.HashPurpose.LocalAuthorization);
                if (localKeyHash != null && storedPasswordHash === localKeyHash) {
                    return true;
                }
                // TODO: remove serverKeyHash check in 1-2 releases after everyone's keyHash has been updated
                const serverKeyHash = yield this.hashMasterKey(masterPassword, masterKey, enums_1.HashPurpose.ServerAuthorization);
                if (serverKeyHash != null && storedPasswordHash === serverKeyHash) {
                    yield this.masterPasswordService.setMasterKeyHash(localKeyHash, userId);
                    return true;
                }
            }
            return false;
        });
    }
    setOrgKeys(orgs, providerOrgs, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.getUser(userId, org_keys_state_1.USER_ENCRYPTED_ORGANIZATION_KEYS).update(() => {
                const encOrgKeyData = {};
                orgs.forEach((org) => {
                    encOrgKeyData[org.id] = {
                        type: "organization",
                        key: org.key,
                    };
                });
                providerOrgs.forEach((org) => {
                    encOrgKeyData[org.id] = {
                        type: "provider",
                        providerId: org.providerId,
                        key: org.key,
                    };
                });
                return encOrgKeyData;
            });
        });
    }
    getOrgKey(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            if (activeUserId == null) {
                throw new Error("A user must be active to retrieve an org key");
            }
            const orgKeys = yield (0, rxjs_1.firstValueFrom)(this.orgKeys$(activeUserId));
            return orgKeys[orgId];
        });
    }
    makeDataEncKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No key provided");
            }
            const newSymKey = yield this.keyGenerationService.createKey(512);
            return this.buildProtectedSymmetricKey(key, newSymKey.key);
        });
    }
    clearOrgKeys(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                // nothing to do
                return;
            }
            yield this.stateProvider.setUserState(org_keys_state_1.USER_ENCRYPTED_ORGANIZATION_KEYS, null, userId);
        });
    }
    setProviderKeys(providers, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.getUser(userId, provider_keys_state_1.USER_ENCRYPTED_PROVIDER_KEYS).update(() => {
                const encProviderKeys = {};
                providers.forEach((provider) => {
                    encProviderKeys[provider.id] = provider.key;
                });
                return encProviderKeys;
            });
        });
    }
    // TODO: Deprecate in favor of observable
    getProviderKey(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (providerId == null) {
                return null;
            }
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            const providerKeys = yield (0, rxjs_1.firstValueFrom)(this.providerKeys$(activeUserId));
            return (_a = providerKeys[providerId]) !== null && _a !== void 0 ? _a : null;
        });
    }
    clearProviderKeys(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                // nothing to do
                return;
            }
            yield this.stateProvider.setUserState(provider_keys_state_1.USER_ENCRYPTED_PROVIDER_KEYS, null, userId);
        });
    }
    // TODO: Make userId required
    makeOrgKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const shareKey = yield this.keyGenerationService.createKey(512);
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            const publicKey = yield (0, rxjs_1.firstValueFrom)(this.userPublicKey$(userId));
            const encShareKey = yield this.rsaEncrypt(shareKey.key, publicKey);
            return [encShareKey, shareKey];
        });
    }
    setPrivateKey(encPrivateKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encPrivateKey == null) {
                return;
            }
            yield this.stateProvider
                .getUser(userId, user_key_state_1.USER_ENCRYPTED_PRIVATE_KEY)
                .update(() => encPrivateKey);
        });
    }
    getPrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            if (activeUserId == null) {
                throw new Error("User must be active while attempting to retrieve private key.");
            }
            return yield (0, rxjs_1.firstValueFrom)(this.userPrivateKey$(activeUserId));
        });
    }
    // TODO: Make public key required
    getFingerprint(fingerprintMaterial, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (publicKey == null) {
                const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
                publicKey = yield (0, rxjs_1.firstValueFrom)(this.userPublicKey$(activeUserId));
            }
            if (publicKey === null) {
                throw new Error("No public key available.");
            }
            const keyFingerprint = yield this.cryptoFunctionService.hash(publicKey, "sha256");
            const userFingerprint = yield this.cryptoFunctionService.hkdfExpand(keyFingerprint, fingerprintMaterial, 32, "sha256");
            return this.hashPhrase(userFingerprint);
        });
    }
    makeKeyPair(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("'key' is a required parameter and must be non-null.");
            }
            const keyPair = yield this.cryptoFunctionService.rsaGenerateKeyPair(2048);
            const publicB64 = utils_1.Utils.fromBufferToB64(keyPair[0]);
            const privateEnc = yield this.encryptService.encrypt(keyPair[1], key);
            return [publicB64, privateEnc];
        });
    }
    /**
     * Clears the user's key pair
     * @param userId The desired user
     */
    clearKeyPair(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                // nothing to do
                return;
            }
            yield this.stateProvider.setUserState(user_key_state_1.USER_ENCRYPTED_PRIVATE_KEY, null, userId);
        });
    }
    clearPinKeys(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            if (userId == null) {
                throw new Error("Cannot clear PIN keys, no user Id resolved.");
            }
            yield this.pinService.clearPinKeyEncryptedUserKeyPersistent(userId);
            yield this.pinService.clearPinKeyEncryptedUserKeyEphemeral(userId);
            yield this.pinService.clearUserKeyEncryptedPin(userId);
            yield this.clearDeprecatedKeys(enums_1.KeySuffixOptions.Pin, userId);
        });
    }
    makeSendKey(keyMaterial) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyGenerationService.deriveKeyFromMaterial(keyMaterial, "bitwarden-send", "send");
        });
    }
    makeCipherKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.keyGenerationService.createKey(512));
        });
    }
    clearKeys(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            if (userId == null) {
                throw new Error("Cannot clear keys, no user Id resolved.");
            }
            yield this.masterPasswordService.clearMasterKeyHash(userId);
            yield this.clearUserKey(userId);
            yield this.clearOrgKeys(userId);
            yield this.clearProviderKeys(userId);
            yield this.clearKeyPair(userId);
            yield this.clearPinKeys(userId);
            yield this.stateProvider.setUserState(user_key_state_1.USER_EVER_HAD_USER_KEY, null, userId);
        });
    }
    rsaEncrypt(data, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (publicKey == null) {
                throw new Error("'publicKey' is a required parameter and must be non-null");
            }
            const encBytes = yield this.cryptoFunctionService.rsaEncrypt(data, publicKey, "sha1");
            return new enc_string_1.EncString(enums_1.EncryptionType.Rsa2048_OaepSha1_B64, utils_1.Utils.fromBufferToB64(encBytes));
        });
    }
    rsaDecrypt(encValue, privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (privateKey == null) {
                throw new Error("'privateKey' is a required parameter and must be non-null");
            }
            const headerPieces = encValue.split(".");
            let encType = null;
            let encPieces;
            if (headerPieces.length === 1) {
                encType = enums_1.EncryptionType.Rsa2048_OaepSha256_B64;
                encPieces = [headerPieces[0]];
            }
            else if (headerPieces.length === 2) {
                try {
                    encType = parseInt(headerPieces[0], null);
                    encPieces = headerPieces[1].split("|");
                }
                catch (e) {
                    this.logService.error(e);
                }
            }
            switch (encType) {
                case enums_1.EncryptionType.Rsa2048_OaepSha256_B64:
                case enums_1.EncryptionType.Rsa2048_OaepSha1_B64:
                case enums_1.EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64: // HmacSha256 types are deprecated
                case enums_1.EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    break;
                default:
                    throw new Error("encType unavailable.");
            }
            if (encPieces == null || encPieces.length <= 0) {
                throw new Error("encPieces unavailable.");
            }
            const data = utils_1.Utils.fromB64ToArray(encPieces[0]);
            let alg = "sha1";
            switch (encType) {
                case enums_1.EncryptionType.Rsa2048_OaepSha256_B64:
                case enums_1.EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
                    alg = "sha256";
                    break;
                case enums_1.EncryptionType.Rsa2048_OaepSha1_B64:
                case enums_1.EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    break;
                default:
                    throw new Error("encType unavailable.");
            }
            return this.cryptoFunctionService.rsaDecrypt(data, privateKey, alg);
        });
    }
    // EFForg/OpenWireless
    // ref https://github.com/EFForg/OpenWireless/blob/master/app/js/diceware.js
    randomNumber(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            let rval = 0;
            const range = max - min + 1;
            const bitsNeeded = Math.ceil(Math.log2(range));
            if (bitsNeeded > 53) {
                throw new Error("We cannot generate numbers larger than 53 bits.");
            }
            const bytesNeeded = Math.ceil(bitsNeeded / 8);
            const mask = Math.pow(2, bitsNeeded) - 1;
            // 7776 -> (2^13 = 8192) -1 == 8191 or 0x00001111 11111111
            // Fill a byte array with N random numbers
            const byteArray = new Uint8Array(yield this.cryptoFunctionService.randomBytes(bytesNeeded));
            let p = (bytesNeeded - 1) * 8;
            for (let i = 0; i < bytesNeeded; i++) {
                rval += byteArray[i] * Math.pow(2, p);
                p -= 8;
            }
            // Use & to apply the mask and reduce the number of recursive lookups
            rval = rval & mask;
            if (rval >= range) {
                // Integer out of acceptable range
                return this.randomNumber(min, max);
            }
            // Return an integer that falls within the range
            return min + rval;
        });
    }
    // ---HELPERS---
    validateUserKey(key, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key) {
                return false;
            }
            try {
                const encPrivateKey = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUser(userId, user_key_state_1.USER_ENCRYPTED_PRIVATE_KEY).state$);
                if (encPrivateKey == null) {
                    return false;
                }
                // Can decrypt private key
                const privateKey = yield this.decryptPrivateKey(encPrivateKey, key);
                if (privateKey == null) {
                    // failed to decrypt
                    return false;
                }
                // Can successfully derive public key
                const publicKey = yield this.derivePublicKey(privateKey);
                if (publicKey == null) {
                    // failed to decrypt
                    return false;
                }
            }
            catch (e) {
                return false;
            }
            return true;
        });
    }
    /**
     * Initialize all necessary crypto keys needed for a new account.
     * Warning! This completely replaces any existing keys!
     */
    initAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            if (activeUserId == null) {
                throw new Error("Cannot initilize an account if one is not active.");
            }
            // Verify user key doesn't exist
            const existingUserKey = yield this.getUserKey(activeUserId);
            if (existingUserKey != null) {
                this.logService.error("Tried to initialize account with existing user key.");
                throw new Error("Cannot initialize account, keys already exist.");
            }
            const userKey = (yield this.keyGenerationService.createKey(512));
            const [publicKey, privateKey] = yield this.makeKeyPair(userKey);
            yield this.setUserKey(userKey, activeUserId);
            yield this.stateProvider
                .getUser(activeUserId, user_key_state_1.USER_ENCRYPTED_PRIVATE_KEY)
                .update(() => privateKey.encryptedString);
            return {
                userKey,
                publicKey,
                privateKey,
            };
        });
    }
    /**
     * Generates any additional keys if needed. Additional keys are
     * keys such as biometrics, auto, and pin keys.
     * Useful to make sure other keys stay in sync when the user key
     * has been rotated.
     * @param key The user key
     * @param userId The desired user
     */
    storeAdditionalKeys(key, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            if (userId == null) {
                throw new Error("Cannot store additional keys, no user Id resolved.");
            }
            const storeAuto = yield this.shouldStoreKey(enums_1.KeySuffixOptions.Auto, userId);
            if (storeAuto) {
                yield this.stateService.setUserKeyAutoUnlock(key.keyB64, { userId: userId });
            }
            else {
                yield this.stateService.setUserKeyAutoUnlock(null, { userId: userId });
            }
            yield this.clearDeprecatedKeys(enums_1.KeySuffixOptions.Auto, userId);
            const storePin = yield this.shouldStoreKey(enums_1.KeySuffixOptions.Pin, userId);
            if (storePin) {
                // Decrypt userKeyEncryptedPin with user key
                const pin = yield this.encryptService.decryptToUtf8(yield this.pinService.getUserKeyEncryptedPin(userId), key);
                const pinKeyEncryptedUserKey = yield this.pinService.createPinKeyEncryptedUserKey(pin, key, userId);
                const noPreExistingPersistentKey = (yield this.pinService.getPinKeyEncryptedUserKeyPersistent(userId)) == null;
                yield this.pinService.storePinKeyEncryptedUserKey(pinKeyEncryptedUserKey, noPreExistingPersistentKey, userId);
                // We can't always clear deprecated keys because the pin is only
                // migrated once used to unlock
                yield this.clearDeprecatedKeys(enums_1.KeySuffixOptions.Pin, userId);
            }
            else {
                yield this.pinService.clearPinKeyEncryptedUserKeyPersistent(userId);
                yield this.pinService.clearPinKeyEncryptedUserKeyEphemeral(userId);
            }
        });
    }
    shouldStoreKey(keySuffix, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let shouldStoreKey = false;
            switch (keySuffix) {
                case enums_1.KeySuffixOptions.Auto: {
                    // TODO: Sharing the UserKeyDefinition is temporary to get around a circ dep issue between
                    // the VaultTimeoutSettingsSvc and this service.
                    // This should be fixed as part of the PM-7082 - Auto Key Service work.
                    const vaultTimeout = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUserState$(vault_timeout_settings_state_1.VAULT_TIMEOUT, userId));
                    shouldStoreKey = vaultTimeout == vault_timeout_type_1.VaultTimeoutStringType.Never;
                    break;
                }
                case enums_1.KeySuffixOptions.Pin: {
                    const userKeyEncryptedPin = yield this.pinService.getUserKeyEncryptedPin(userId);
                    shouldStoreKey = !!userKeyEncryptedPin;
                    break;
                }
            }
            return shouldStoreKey;
        });
    }
    getKeyFromStorage(keySuffix, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (keySuffix === enums_1.KeySuffixOptions.Auto) {
                const userKey = yield this.stateService.getUserKeyAutoUnlock({ userId: userId });
                if (userKey) {
                    return new symmetric_crypto_key_1.SymmetricCryptoKey(utils_1.Utils.fromB64ToArray(userKey));
                }
            }
            return null;
        });
    }
    clearAllStoredUserKeys(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateService.setUserKeyAutoUnlock(null, { userId: userId });
            yield this.pinService.clearPinKeyEncryptedUserKeyEphemeral(userId);
        });
    }
    hashPhrase(hash_1) {
        return __awaiter(this, arguments, void 0, function* (hash, minimumEntropy = 64) {
            const entropyPerWord = Math.log(wordlist_1.EFFLongWordList.length) / Math.log(2);
            let numWords = Math.ceil(minimumEntropy / entropyPerWord);
            const hashArr = Array.from(new Uint8Array(hash));
            const entropyAvailable = hashArr.length * 4;
            if (numWords * entropyPerWord > entropyAvailable) {
                throw new Error("Output entropy of hash function is too small");
            }
            const phrase = [];
            let hashNumber = bigInt.fromArray(hashArr, 256);
            while (numWords--) {
                const remainder = hashNumber.mod(wordlist_1.EFFLongWordList.length);
                hashNumber = hashNumber.divide(wordlist_1.EFFLongWordList.length);
                phrase.push(wordlist_1.EFFLongWordList[remainder]);
            }
            return phrase;
        });
    }
    buildProtectedSymmetricKey(encryptionKey, newSymKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let protectedSymKey = null;
            if (encryptionKey.key.byteLength === 32) {
                const stretchedEncryptionKey = yield this.keyGenerationService.stretchKey(encryptionKey);
                protectedSymKey = yield this.encryptService.encrypt(newSymKey, stretchedEncryptionKey);
            }
            else if (encryptionKey.key.byteLength === 64) {
                protectedSymKey = yield this.encryptService.encrypt(newSymKey, encryptionKey);
            }
            else {
                throw new Error("Invalid key size.");
            }
            return [new symmetric_crypto_key_1.SymmetricCryptoKey(newSymKey), protectedSymKey];
        });
    }
    // --LEGACY METHODS--
    // We previously used the master key for additional keys, but now we use the user key.
    // These methods support migrating the old keys to the new ones.
    // TODO: Remove after 2023.10 release (https://bitwarden.atlassian.net/browse/PM-3475)
    clearDeprecatedKeys(keySuffix, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (keySuffix === enums_1.KeySuffixOptions.Auto) {
                yield this.stateService.setCryptoMasterKeyAuto(null, { userId: userId });
            }
            else if (keySuffix === enums_1.KeySuffixOptions.Pin) {
                yield this.pinService.clearOldPinKeyEncryptedMasterKey(userId);
            }
        });
    }
    // --DEPRECATED METHODS--
    /**
     * @deprecated July 25 2022: Get the key you need from CryptoService (getKeyForUserEncryption or getOrgKey)
     * and then call encryptService.encrypt
     */
    encrypt(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            key || (key = yield this.getUserKeyWithLegacySupport());
            return yield this.encryptService.encrypt(plainValue, key);
        });
    }
    /**
     * @deprecated July 25 2022: Get the key you need from CryptoService (getKeyForUserEncryption or getOrgKey)
     * and then call encryptService.encryptToBytes
     */
    encryptToBytes(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            key || (key = yield this.getUserKeyWithLegacySupport());
            return this.encryptService.encryptToBytes(plainValue, key);
        });
    }
    /**
     * @deprecated July 25 2022: Get the key you need from CryptoService (getKeyForUserEncryption or getOrgKey)
     * and then call encryptService.decryptToBytes
     */
    decryptToBytes(encString, key) {
        return __awaiter(this, void 0, void 0, function* () {
            key || (key = yield this.getUserKeyWithLegacySupport());
            return this.encryptService.decryptToBytes(encString, key);
        });
    }
    /**
     * @deprecated July 25 2022: Get the key you need from CryptoService (getKeyForUserEncryption or getOrgKey)
     * and then call encryptService.decryptToUtf8
     */
    decryptToUtf8(encString, key) {
        return __awaiter(this, void 0, void 0, function* () {
            key || (key = yield this.getUserKeyWithLegacySupport());
            return yield this.encryptService.decryptToUtf8(encString, key);
        });
    }
    /**
     * @deprecated July 25 2022: Get the key you need from CryptoService (getKeyForUserEncryption or getOrgKey)
     * and then call encryptService.decryptToBytes
     */
    decryptFromBytes(encBuffer, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encBuffer == null) {
                throw new Error("No buffer provided for decryption.");
            }
            key || (key = yield this.getUserKeyWithLegacySupport());
            return this.encryptService.decryptToBytes(encBuffer, key);
        });
    }
    userKey$(userId) {
        return this.stateProvider.getUser(userId, user_key_state_1.USER_KEY).state$;
    }
    userKeyWithLegacySupport$(userId) {
        return this.userKey$(userId).pipe((0, rxjs_1.switchMap)((userKey) => {
            if (userKey != null) {
                return (0, rxjs_1.of)(userKey);
            }
            // Legacy path
            return this.masterPasswordService.masterKey$(userId).pipe((0, rxjs_1.switchMap)((masterKey) => __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.validateUserKey(masterKey, userId))) {
                    // We don't have a UserKey or a valid MasterKey
                    return null;
                }
                // The master key is valid meaning, the org keys and such are encrypted with this key
                return masterKey;
            })));
        }));
    }
    userPublicKey$(userId) {
        return this.userPrivateKey$(userId).pipe((0, rxjs_1.switchMap)((pk) => __awaiter(this, void 0, void 0, function* () { return yield this.derivePublicKey(pk); })));
    }
    derivePublicKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.cryptoFunctionService.rsaExtractPublicKey(privateKey));
        });
    }
    userPrivateKey$(userId) {
        return this.userPrivateKeyHelper$(userId, false).pipe((0, rxjs_1.map)((keys) => keys === null || keys === void 0 ? void 0 : keys.userPrivateKey));
    }
    userPrivateKeyWithLegacySupport$(userId) {
        return this.userPrivateKeyHelper$(userId, true).pipe((0, rxjs_1.map)((keys) => keys === null || keys === void 0 ? void 0 : keys.userPrivateKey));
    }
    userPrivateKeyHelper$(userId, legacySupport) {
        const userKey$ = legacySupport ? this.userKeyWithLegacySupport$(userId) : this.userKey$(userId);
        return userKey$.pipe((0, rxjs_1.switchMap)((userKey) => {
            if (userKey == null) {
                return (0, rxjs_1.of)(null);
            }
            return this.stateProvider.getUser(userId, user_key_state_1.USER_ENCRYPTED_PRIVATE_KEY).state$.pipe((0, rxjs_1.switchMap)((encryptedPrivateKey) => __awaiter(this, void 0, void 0, function* () { return yield this.decryptPrivateKey(encryptedPrivateKey, userKey); })), 
            // Combine outerscope info with user private key
            (0, rxjs_1.map)((userPrivateKey) => ({
                userKey,
                userPrivateKey,
            })));
        }));
    }
    decryptPrivateKey(encryptedPrivateKey, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encryptedPrivateKey == null) {
                return null;
            }
            return (yield this.encryptService.decryptToBytes(new enc_string_1.EncString(encryptedPrivateKey), key));
        });
    }
    providerKeys$(userId) {
        return this.userPrivateKey$(userId).pipe((0, rxjs_1.switchMap)((userPrivateKey) => {
            if (userPrivateKey == null) {
                return (0, rxjs_1.of)(null);
            }
            return this.providerKeysHelper$(userId, userPrivateKey);
        }));
    }
    /**
     * A helper for decrypting provider keys that requires a user id and that users decrypted private key
     * this is helpful for when you may have already grabbed the user private key and don't want to redo
     * that work to get the provider keys.
     */
    providerKeysHelper$(userId, userPrivateKey) {
        return this.stateProvider.getUser(userId, provider_keys_state_1.USER_ENCRYPTED_PROVIDER_KEYS).state$.pipe(
        // Convert each value in the record to it's own decryption observable
        (0, convert_values_1.convertValues)((_, value) => __awaiter(this, void 0, void 0, function* () {
            const decrypted = yield this.encryptService.rsaDecrypt(new enc_string_1.EncString(value), userPrivateKey);
            return new symmetric_crypto_key_1.SymmetricCryptoKey(decrypted);
        })), 
        // switchMap since there are no side effects
        (0, rxjs_1.switchMap)((encryptedProviderKeys) => {
            if (encryptedProviderKeys == null) {
                return (0, rxjs_1.of)(null);
            }
            // Can't give an empty record to forkJoin
            if (Object.keys(encryptedProviderKeys).length === 0) {
                return (0, rxjs_1.of)({});
            }
            return (0, rxjs_1.forkJoin)(encryptedProviderKeys);
        }));
    }
    orgKeys$(userId) {
        return this.cipherDecryptionKeys$(userId, true).pipe((0, rxjs_1.map)((keys) => keys === null || keys === void 0 ? void 0 : keys.orgKeys));
    }
    cipherDecryptionKeys$(userId, legacySupport = false) {
        return this.userPrivateKeyHelper$(userId, legacySupport).pipe((0, rxjs_1.switchMap)((userKeys) => {
            if (userKeys == null) {
                return (0, rxjs_1.of)(null);
            }
            const userPrivateKey = userKeys.userPrivateKey;
            if (userPrivateKey == null) {
                // We can't do any org based decryption
                return (0, rxjs_1.of)({ userKey: userKeys.userKey, orgKeys: null });
            }
            return (0, rxjs_1.combineLatest)([
                this.stateProvider.getUser(userId, org_keys_state_1.USER_ENCRYPTED_ORGANIZATION_KEYS).state$,
                this.providerKeysHelper$(userId, userPrivateKey),
            ]).pipe((0, rxjs_1.switchMap)((_a) => __awaiter(this, [_a], void 0, function* ([encryptedOrgKeys, providerKeys]) {
                const result = {};
                for (const orgId of Object.keys(encryptedOrgKeys !== null && encryptedOrgKeys !== void 0 ? encryptedOrgKeys : {})) {
                    if (result[orgId] != null) {
                        continue;
                    }
                    const encrypted = encrypted_organization_key_1.BaseEncryptedOrganizationKey.fromData(encryptedOrgKeys[orgId]);
                    let decrypted;
                    if (encrypted_organization_key_1.BaseEncryptedOrganizationKey.isProviderEncrypted(encrypted)) {
                        decrypted = yield encrypted.decrypt(this.encryptService, providerKeys);
                    }
                    else {
                        decrypted = yield encrypted.decrypt(this.encryptService, userPrivateKey);
                    }
                    result[orgId] = decrypted;
                }
                return result;
            })), 
            // Combine them back together
            (0, rxjs_1.map)((orgKeys) => ({ userKey: userKeys.userKey, orgKeys: orgKeys })));
        }));
    }
}
exports.CryptoService = CryptoService;
//# sourceMappingURL=crypto.service.js.map