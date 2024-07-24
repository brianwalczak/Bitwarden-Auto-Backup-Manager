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
exports.TokenService = exports.TokenStorageLocation = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("@bitwarden/auth/common");
const vault_timeout_action_enum_1 = require("../../enums/vault-timeout-action.enum");
const enums_1 = require("../../platform/enums");
const enc_string_1 = require("../../platform/models/domain/enc-string");
const symmetric_crypto_key_1 = require("../../platform/models/domain/symmetric-crypto-key");
const vault_timeout_type_1 = require("../../types/vault-timeout.type");
const set_tokens_result_1 = require("../models/domain/set-tokens-result");
const account_service_1 = require("./account.service");
const token_state_1 = require("./token.state");
var TokenStorageLocation;
(function (TokenStorageLocation) {
    TokenStorageLocation["Disk"] = "disk";
    TokenStorageLocation["SecureStorage"] = "secureStorage";
    TokenStorageLocation["Memory"] = "memory";
})(TokenStorageLocation || (exports.TokenStorageLocation = TokenStorageLocation = {}));
class TokenService {
    constructor(
    // Note: we cannot use ActiveStateProvider because if we ever want to inject
    // this service into the AccountService, we will make a circular dependency
    singleUserStateProvider, globalStateProvider, platformSupportsSecureStorage, secureStorageService, keyGenerationService, encryptService, logService, logoutCallback) {
        this.singleUserStateProvider = singleUserStateProvider;
        this.globalStateProvider = globalStateProvider;
        this.platformSupportsSecureStorage = platformSupportsSecureStorage;
        this.secureStorageService = secureStorageService;
        this.keyGenerationService = keyGenerationService;
        this.encryptService = encryptService;
        this.logService = logService;
        this.logoutCallback = logoutCallback;
        this.accessTokenKeySecureStorageKey = "_accessTokenKey";
        this.refreshTokenSecureStorageKey = "_refreshToken";
        this.initializeState();
    }
    hasAccessToken$(userId) {
        // FIXME Once once vault timeout action is observable, we can use it to determine storage location
        // and avoid the need to check both disk and memory.
        return (0, rxjs_1.combineLatest)([
            this.singleUserStateProvider.get(userId, token_state_1.ACCESS_TOKEN_DISK).state$,
            this.singleUserStateProvider.get(userId, token_state_1.ACCESS_TOKEN_MEMORY).state$,
        ]).pipe((0, rxjs_1.map)(([disk, memory]) => Boolean(disk || memory)));
    }
    initializeState() {
        this.emailTwoFactorTokenRecordGlobalState = this.globalStateProvider.get(token_state_1.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL);
        this.activeUserIdGlobalState = this.globalStateProvider.get(account_service_1.ACCOUNT_ACTIVE_ACCOUNT_ID);
    }
    setTokens(accessToken, vaultTimeoutAction, vaultTimeout, refreshToken, clientIdClientSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken) {
                throw new Error("Access token is required.");
            }
            // Can't check for falsey b/c 0 is a valid value
            if (vaultTimeout == null) {
                throw new Error("Vault Timeout is required.");
            }
            if (vaultTimeoutAction == null) {
                throw new Error("Vault Timeout Action is required.");
            }
            // get user id the access token
            const userId = yield this.getUserIdFromAccessToken(accessToken);
            if (!userId) {
                throw new Error("User id not found. Cannot set tokens.");
            }
            const newAccessToken = yield this._setAccessToken(accessToken, vaultTimeoutAction, vaultTimeout, userId);
            const newTokens = new set_tokens_result_1.SetTokensResult(newAccessToken);
            if (refreshToken) {
                newTokens.refreshToken = yield this.setRefreshToken(refreshToken, vaultTimeoutAction, vaultTimeout, userId);
            }
            if (clientIdClientSecret != null) {
                const clientId = yield this.setClientId(clientIdClientSecret[0], vaultTimeoutAction, vaultTimeout, userId);
                const clientSecret = yield this.setClientSecret(clientIdClientSecret[1], vaultTimeoutAction, vaultTimeout, userId);
                newTokens.clientIdSecretPair = [clientId, clientSecret];
            }
            return newTokens;
        });
    }
    getAccessTokenKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenKeyB64 = yield this.secureStorageService.get(`${userId}${this.accessTokenKeySecureStorageKey}`, this.getSecureStorageOptions(userId));
            if (!accessTokenKeyB64) {
                return null;
            }
            const accessTokenKey = symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(accessTokenKeyB64);
            return accessTokenKey;
        });
    }
    createAndSaveAccessTokenKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAccessTokenKey = (yield this.keyGenerationService.createKey(512));
            yield this.secureStorageService.save(`${userId}${this.accessTokenKeySecureStorageKey}`, newAccessTokenKey, this.getSecureStorageOptions(userId));
            // We are having intermittent issues with access token keys not saving into secure storage on windows 10/11.
            // So, let's add a check to ensure we can read the value after writing it.
            const accessTokenKey = yield this.getAccessTokenKey(userId);
            if (!accessTokenKey) {
                throw new Error("New Access token key unable to be retrieved from secure storage.");
            }
            return newAccessTokenKey;
        });
    }
    clearAccessTokenKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.secureStorageService.remove(`${userId}${this.accessTokenKeySecureStorageKey}`, this.getSecureStorageOptions(userId));
        });
    }
    getOrCreateAccessTokenKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.platformSupportsSecureStorage) {
                throw new Error("Platform does not support secure storage. Cannot obtain access token key.");
            }
            if (!userId) {
                throw new Error("User id not found. Cannot obtain access token key.");
            }
            // First see if we have an accessTokenKey in secure storage and return it if we do
            // Note: retrieving/saving data from/to secure storage on linux will throw if the
            // distro doesn't have a secure storage provider
            let accessTokenKey = yield this.getAccessTokenKey(userId);
            if (!accessTokenKey) {
                // Otherwise, create a new one and save it to secure storage, then return it
                accessTokenKey = yield this.createAndSaveAccessTokenKey(userId);
            }
            return accessTokenKey;
        });
    }
    encryptAccessToken(accessToken, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenKey = yield this.getOrCreateAccessTokenKey(userId);
            return yield this.encryptService.encrypt(accessToken, accessTokenKey);
        });
    }
    decryptAccessToken(accessTokenKey, encryptedAccessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessTokenKey) {
                throw new Error("decryptAccessToken: Access token key required. Cannot decrypt access token.");
            }
            const decryptedAccessToken = yield this.encryptService.decryptToUtf8(encryptedAccessToken, accessTokenKey);
            return decryptedAccessToken;
        });
    }
    /**
     * Internal helper for set access token which always requires user id.
     * This is useful because setTokens always will have a user id from the access token whereas
     * the public setAccessToken method does not.
     */
    _setAccessToken(accessToken, vaultTimeoutAction, vaultTimeout, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageLocation = yield this.determineStorageLocation(vaultTimeoutAction, vaultTimeout, true);
            switch (storageLocation) {
                case TokenStorageLocation.SecureStorage: {
                    // Secure storage implementations have variable length limitations (Windows), so we cannot
                    // store the access token directly. Instead, we encrypt with accessTokenKey and store that
                    // in secure storage.
                    let decryptedAccessToken = null;
                    try {
                        const encryptedAccessToken = yield this.encryptAccessToken(accessToken, userId);
                        // Save the encrypted access token to disk
                        yield this.singleUserStateProvider
                            .get(userId, token_state_1.ACCESS_TOKEN_DISK)
                            .update((_) => encryptedAccessToken.encryptedString);
                        // If we've successfully stored the encrypted access token to disk, we can return the decrypted access token
                        // so that the caller can use it immediately.
                        decryptedAccessToken = accessToken;
                        // TODO: PM-6408
                        // 2024-02-20: Remove access token from memory so that we migrate to encrypt the access token over time.
                        // Remove this call to remove the access token from memory after 3 months.
                        yield this.singleUserStateProvider.get(userId, token_state_1.ACCESS_TOKEN_MEMORY).update((_) => null);
                    }
                    catch (error) {
                        this.logService.error(`SetAccessToken: storing encrypted access token in secure storage failed. Falling back to disk storage.`, error);
                        // Fall back to disk storage for unecrypted access token
                        decryptedAccessToken = yield this.singleUserStateProvider
                            .get(userId, token_state_1.ACCESS_TOKEN_DISK)
                            .update((_) => accessToken);
                    }
                    return decryptedAccessToken;
                }
                case TokenStorageLocation.Disk:
                    // Access token stored on disk unencrypted as platform does not support secure storage
                    return yield this.singleUserStateProvider
                        .get(userId, token_state_1.ACCESS_TOKEN_DISK)
                        .update((_) => accessToken);
                case TokenStorageLocation.Memory:
                    // Access token stored in memory due to vault timeout settings
                    return yield this.singleUserStateProvider
                        .get(userId, token_state_1.ACCESS_TOKEN_MEMORY)
                        .update((_) => accessToken);
            }
        });
    }
    setAccessToken(accessToken, vaultTimeoutAction, vaultTimeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken) {
                throw new Error("Access token is required.");
            }
            const userId = yield this.getUserIdFromAccessToken(accessToken);
            // If we don't have a user id, we can't save the value
            if (!userId) {
                throw new Error("User id not found. Cannot save access token.");
            }
            // Can't check for falsey b/c 0 is a valid value
            if (vaultTimeout == null) {
                throw new Error("Vault Timeout is required.");
            }
            if (vaultTimeoutAction == null) {
                throw new Error("Vault Timeout Action is required.");
            }
            return yield this._setAccessToken(accessToken, vaultTimeoutAction, vaultTimeout, userId);
        });
    }
    clearAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            // If we don't have a user id, we can't clear the value
            if (!userId) {
                throw new Error("User id not found. Cannot clear access token.");
            }
            // TODO: re-eval this implementation once we get shared key definitions for vault timeout and vault timeout action data.
            // we can't determine storage location w/out vaultTimeoutAction and vaultTimeout
            // but we can simply clear all locations to avoid the need to require those parameters.
            if (this.platformSupportsSecureStorage) {
                // Always clear the access token key when clearing the access token
                // The next set of the access token will create a new access token key
                yield this.clearAccessTokenKey(userId);
            }
            // Platform doesn't support secure storage, so use state provider implementation
            yield this.singleUserStateProvider.get(userId, token_state_1.ACCESS_TOKEN_DISK).update((_) => null);
            yield this.singleUserStateProvider.get(userId, token_state_1.ACCESS_TOKEN_MEMORY).update((_) => null);
        });
    }
    getAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                return null;
            }
            // Try to get the access token from memory
            const accessTokenMemory = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.ACCESS_TOKEN_MEMORY);
            if (accessTokenMemory != null) {
                return accessTokenMemory;
            }
            // If memory is null, read from disk
            const accessTokenDisk = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.ACCESS_TOKEN_DISK);
            if (!accessTokenDisk) {
                return null;
            }
            if (this.platformSupportsSecureStorage) {
                let accessTokenKey;
                try {
                    accessTokenKey = yield this.getAccessTokenKey(userId);
                }
                catch (error) {
                    if (enc_string_1.EncString.isSerializedEncString(accessTokenDisk)) {
                        this.logService.error("Access token key retrieval failed. Unable to decrypt encrypted access token. Logging user out.", error);
                        yield this.logoutCallback("accessTokenUnableToBeDecrypted", userId);
                        return null;
                    }
                    // If the access token key is not found, but the access token is unencrypted then
                    // this indicates that this is the pre-migration state where the access token
                    // was stored unencrypted on disk. We can return the access token as is.
                    // Note: this is likely to only be hit for linux users who don't
                    // have a secure storage provider configured.
                    return accessTokenDisk;
                }
                if (!accessTokenKey) {
                    if (enc_string_1.EncString.isSerializedEncString(accessTokenDisk)) {
                        // The access token is encrypted but we don't have the key to decrypt it for
                        // whatever reason so we have to log the user out.
                        this.logService.error("Access token key not found to decrypt encrypted access token. Logging user out.");
                        yield this.logoutCallback("accessTokenUnableToBeDecrypted", userId);
                        return null;
                    }
                    // We know this is an unencrypted access token
                    return accessTokenDisk;
                }
                try {
                    const encryptedAccessTokenEncString = new enc_string_1.EncString(accessTokenDisk);
                    const decryptedAccessToken = yield this.decryptAccessToken(accessTokenKey, encryptedAccessTokenEncString);
                    return decryptedAccessToken;
                }
                catch (error) {
                    // If an error occurs during decryption, logout and then return null.
                    // We don't try to recover here since we'd like to know
                    // if access token and key are getting out of sync.
                    this.logService.error(`Failed to decrypt access token`, error);
                    yield this.logoutCallback("accessTokenUnableToBeDecrypted", userId);
                    return null;
                }
            }
            return accessTokenDisk;
        });
    }
    // Private because we only ever set the refresh token when also setting the access token
    // and we need the user id from the access token to save to secure storage
    setRefreshToken(refreshToken, vaultTimeoutAction, vaultTimeout, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we don't have a user id, we can't save the value
            if (!userId) {
                throw new Error("User id not found. Cannot save refresh token.");
            }
            // Can't check for falsey b/c 0 is a valid value
            if (vaultTimeout == null) {
                throw new Error("Vault Timeout is required.");
            }
            if (vaultTimeoutAction == null) {
                throw new Error("Vault Timeout Action is required.");
            }
            const storageLocation = yield this.determineStorageLocation(vaultTimeoutAction, vaultTimeout, true);
            switch (storageLocation) {
                case TokenStorageLocation.SecureStorage: {
                    let decryptedRefreshToken = null;
                    try {
                        yield this.saveStringToSecureStorage(userId, this.refreshTokenSecureStorageKey, refreshToken);
                        // Check if the refresh token was able to be saved to secure storage by reading it
                        // immediately after setting it. This is needed due to intermittent silent failures on Windows 10/11.
                        const refreshTokenSecureStorage = yield this.getStringFromSecureStorage(userId, this.refreshTokenSecureStorageKey);
                        // Only throw if the refresh token was not saved to secure storage
                        // If we only check for a nullish value out of secure storage without considering the input value,
                        // then we would end up falling back to disk storage if the input value was null.
                        if (refreshToken !== null && !refreshTokenSecureStorage) {
                            throw new Error("Refresh token failed to save to secure storage.");
                        }
                        // If we've successfully stored the encrypted refresh token, we can return the decrypted refresh token
                        // so that the caller can use it immediately.
                        decryptedRefreshToken = refreshToken;
                        // TODO: PM-6408
                        // 2024-02-20: Remove refresh token from memory and disk so that we migrate to secure storage over time.
                        // Remove these 2 calls to remove the refresh token from memory and disk after 3 months.
                        yield this.singleUserStateProvider.get(userId, token_state_1.REFRESH_TOKEN_DISK).update((_) => null);
                        yield this.singleUserStateProvider.get(userId, token_state_1.REFRESH_TOKEN_MEMORY).update((_) => null);
                    }
                    catch (error) {
                        // This case could be hit for both Linux users who don't have secure storage configured
                        // or for Windows users who have intermittent issues with secure storage.
                        this.logService.error(`SetRefreshToken: storing refresh token in secure storage failed. Falling back to disk storage.`, error);
                        // Fall back to disk storage for refresh token
                        decryptedRefreshToken = yield this.singleUserStateProvider
                            .get(userId, token_state_1.REFRESH_TOKEN_DISK)
                            .update((_) => refreshToken);
                    }
                    return decryptedRefreshToken;
                }
                case TokenStorageLocation.Disk:
                    return yield this.singleUserStateProvider
                        .get(userId, token_state_1.REFRESH_TOKEN_DISK)
                        .update((_) => refreshToken);
                case TokenStorageLocation.Memory:
                    return yield this.singleUserStateProvider
                        .get(userId, token_state_1.REFRESH_TOKEN_MEMORY)
                        .update((_) => refreshToken);
            }
        });
    }
    getRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                return null;
            }
            // pre-secure storage migration:
            // Always read memory first b/c faster
            const refreshTokenMemory = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.REFRESH_TOKEN_MEMORY);
            if (refreshTokenMemory != null) {
                return refreshTokenMemory;
            }
            // if memory is null, read from disk and then secure storage
            const refreshTokenDisk = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.REFRESH_TOKEN_DISK);
            if (refreshTokenDisk != null) {
                // This handles the scenario pre-secure storage migration where the refresh token was stored on disk.
                return refreshTokenDisk;
            }
            if (this.platformSupportsSecureStorage) {
                try {
                    const refreshTokenSecureStorage = yield this.getStringFromSecureStorage(userId, this.refreshTokenSecureStorageKey);
                    if (refreshTokenSecureStorage != null) {
                        return refreshTokenSecureStorage;
                    }
                    this.logService.error("Refresh token not found in secure storage. Access token will fail to refresh upon expiration or manual refresh.");
                }
                catch (error) {
                    // This case will be hit for Linux users who don't have secure storage configured.
                    this.logService.error(`Failed to retrieve refresh token from secure storage`, error);
                    yield this.logoutCallback("refreshTokenSecureStorageRetrievalFailure", userId);
                }
            }
            return null;
        });
    }
    clearRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we don't have a user id, we can't clear the value
            if (!userId) {
                throw new Error("User id not found. Cannot clear refresh token.");
            }
            // TODO: re-eval this once we get shared key definitions for vault timeout and vault timeout action data.
            // we can't determine storage location w/out vaultTimeoutAction and vaultTimeout
            // but we can simply clear all locations to avoid the need to require those parameters
            if (this.platformSupportsSecureStorage) {
                yield this.secureStorageService.remove(`${userId}${this.refreshTokenSecureStorageKey}`, this.getSecureStorageOptions(userId));
            }
            // Platform doesn't support secure storage, so use state provider implementation
            yield this.singleUserStateProvider.get(userId, token_state_1.REFRESH_TOKEN_MEMORY).update((_) => null);
            yield this.singleUserStateProvider.get(userId, token_state_1.REFRESH_TOKEN_DISK).update((_) => null);
        });
    }
    setClientId(clientId, vaultTimeoutAction, vaultTimeout, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            // If we don't have a user id, we can't save the value
            if (!userId) {
                throw new Error("User id not found. Cannot save client id.");
            }
            // Can't check for falsey b/c 0 is a valid value
            if (vaultTimeout == null) {
                throw new Error("Vault Timeout is required.");
            }
            if (vaultTimeoutAction == null) {
                throw new Error("Vault Timeout Action is required.");
            }
            const storageLocation = yield this.determineStorageLocation(vaultTimeoutAction, vaultTimeout, false);
            if (storageLocation === TokenStorageLocation.Disk) {
                return yield this.singleUserStateProvider
                    .get(userId, token_state_1.API_KEY_CLIENT_ID_DISK)
                    .update((_) => clientId);
            }
            else if (storageLocation === TokenStorageLocation.Memory) {
                return yield this.singleUserStateProvider
                    .get(userId, token_state_1.API_KEY_CLIENT_ID_MEMORY)
                    .update((_) => clientId);
            }
        });
    }
    getClientId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                return undefined;
            }
            // Always read memory first b/c faster
            const apiKeyClientIdMemory = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.API_KEY_CLIENT_ID_MEMORY);
            if (apiKeyClientIdMemory != null) {
                return apiKeyClientIdMemory;
            }
            // if memory is null, read from disk
            return yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.API_KEY_CLIENT_ID_DISK);
        });
    }
    clearClientId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            // If we don't have a user id, we can't clear the value
            if (!userId) {
                throw new Error("User id not found. Cannot clear client id.");
            }
            // TODO: re-eval this once we get shared key definitions for vault timeout and vault timeout action data.
            // we can't determine storage location w/out vaultTimeoutAction and vaultTimeout
            // but we can simply clear both locations to avoid the need to require those parameters
            // Platform doesn't support secure storage, so use state provider implementation
            yield this.singleUserStateProvider.get(userId, token_state_1.API_KEY_CLIENT_ID_MEMORY).update((_) => null);
            yield this.singleUserStateProvider.get(userId, token_state_1.API_KEY_CLIENT_ID_DISK).update((_) => null);
        });
    }
    setClientSecret(clientSecret, vaultTimeoutAction, vaultTimeout, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                throw new Error("User id not found. Cannot save client secret.");
            }
            // Can't check for falsey b/c 0 is a valid value
            if (vaultTimeout == null) {
                throw new Error("Vault Timeout is required.");
            }
            if (vaultTimeoutAction == null) {
                throw new Error("Vault Timeout Action is required.");
            }
            const storageLocation = yield this.determineStorageLocation(vaultTimeoutAction, vaultTimeout, false);
            if (storageLocation === TokenStorageLocation.Disk) {
                return yield this.singleUserStateProvider
                    .get(userId, token_state_1.API_KEY_CLIENT_SECRET_DISK)
                    .update((_) => clientSecret);
            }
            else if (storageLocation === TokenStorageLocation.Memory) {
                return yield this.singleUserStateProvider
                    .get(userId, token_state_1.API_KEY_CLIENT_SECRET_MEMORY)
                    .update((_) => clientSecret);
            }
        });
    }
    getClientSecret(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                return undefined;
            }
            // Always read memory first b/c faster
            const apiKeyClientSecretMemory = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.API_KEY_CLIENT_SECRET_MEMORY);
            if (apiKeyClientSecretMemory != null) {
                return apiKeyClientSecretMemory;
            }
            // if memory is null, read from disk
            return yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.API_KEY_CLIENT_SECRET_DISK);
        });
    }
    clearClientSecret(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            // If we don't have a user id, we can't clear the value
            if (!userId) {
                throw new Error("User id not found. Cannot clear client secret.");
            }
            // TODO: re-eval this once we get shared key definitions for vault timeout and vault timeout action data.
            // we can't determine storage location w/out vaultTimeoutAction and vaultTimeout
            // but we can simply clear both locations to avoid the need to require those parameters
            // Platform doesn't support secure storage, so use state provider implementation
            yield this.singleUserStateProvider
                .get(userId, token_state_1.API_KEY_CLIENT_SECRET_MEMORY)
                .update((_) => null);
            yield this.singleUserStateProvider.get(userId, token_state_1.API_KEY_CLIENT_SECRET_DISK).update((_) => null);
        });
    }
    setTwoFactorToken(email, twoFactorToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.emailTwoFactorTokenRecordGlobalState.update((emailTwoFactorTokenRecord) => {
                emailTwoFactorTokenRecord !== null && emailTwoFactorTokenRecord !== void 0 ? emailTwoFactorTokenRecord : (emailTwoFactorTokenRecord = {});
                emailTwoFactorTokenRecord[email] = twoFactorToken;
                return emailTwoFactorTokenRecord;
            });
        });
    }
    getTwoFactorToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailTwoFactorTokenRecord = yield (0, rxjs_1.firstValueFrom)(this.emailTwoFactorTokenRecordGlobalState.state$);
            if (!emailTwoFactorTokenRecord) {
                return null;
            }
            return emailTwoFactorTokenRecord[email];
        });
    }
    clearTwoFactorToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.emailTwoFactorTokenRecordGlobalState.update((emailTwoFactorTokenRecord) => {
                emailTwoFactorTokenRecord !== null && emailTwoFactorTokenRecord !== void 0 ? emailTwoFactorTokenRecord : (emailTwoFactorTokenRecord = {});
                delete emailTwoFactorTokenRecord[email];
                return emailTwoFactorTokenRecord;
            });
        });
    }
    // TODO: stop accepting optional userIds
    clearTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                throw new Error("User id not found. Cannot clear tokens.");
            }
            yield Promise.all([
                this.clearAccessToken(userId),
                this.clearRefreshToken(userId),
                this.clearClientId(userId),
                this.clearClientSecret(userId),
            ]);
        });
    }
    // jwthelper methods
    // ref https://github.com/auth0/angular-jwt/blob/master/src/angularJwt/services/jwt.js
    decodeAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            token = token !== null && token !== void 0 ? token : (yield this.getAccessToken());
            if (token == null) {
                throw new Error("Access token not found.");
            }
            return (0, common_1.decodeJwtTokenToJson)(token);
        });
    }
    // TODO: PM-6678- tech debt - consider consolidating the return types of all these access
    // token data retrieval methods to return null if something goes wrong instead of throwing an error.
    getTokenExpirationDate() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            // per RFC, exp claim is optional but if it exists, it should be a number
            if (!decoded || typeof decoded.exp !== "number") {
                return null;
            }
            // The 0 in Date(0) is the key; it sets the date to the epoch
            const expirationDate = new Date(0);
            expirationDate.setUTCSeconds(decoded.exp);
            return expirationDate;
        });
    }
    tokenSecondsRemaining() {
        return __awaiter(this, arguments, void 0, function* (offsetSeconds = 0) {
            const date = yield this.getTokenExpirationDate();
            if (date == null) {
                return 0;
            }
            const msRemaining = date.valueOf() - (new Date().valueOf() + offsetSeconds * 1000);
            return Math.round(msRemaining / 1000);
        });
    }
    tokenNeedsRefresh() {
        return __awaiter(this, arguments, void 0, function* (minutes = 5) {
            const sRemaining = yield this.tokenSecondsRemaining();
            return sRemaining < 60 * minutes;
        });
    }
    getUserId() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            if (!decoded || typeof decoded.sub !== "string") {
                throw new Error("No user id found");
            }
            return decoded.sub;
        });
    }
    getUserIdFromAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken(accessToken);
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            if (!decoded || typeof decoded.sub !== "string") {
                throw new Error("No user id found");
            }
            return decoded.sub;
        });
    }
    getEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            if (!decoded || typeof decoded.email !== "string") {
                throw new Error("No email found");
            }
            return decoded.email;
        });
    }
    getEmailVerified() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            if (!decoded || typeof decoded.email_verified !== "boolean") {
                throw new Error("No email verification found");
            }
            return decoded.email_verified;
        });
    }
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            if (!decoded || typeof decoded.name !== "string") {
                return null;
            }
            return decoded.name;
        });
    }
    getIssuer() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            if (!decoded || typeof decoded.iss !== "string") {
                throw new Error("No issuer found");
            }
            return decoded.iss;
        });
    }
    getIsExternal() {
        return __awaiter(this, void 0, void 0, function* () {
            let decoded;
            try {
                decoded = yield this.decodeAccessToken();
            }
            catch (error) {
                throw new Error("Failed to decode access token: " + error.message);
            }
            return Array.isArray(decoded.amr) && decoded.amr.includes("external");
        });
    }
    getSecurityStamp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                throw new Error("User id not found. Cannot get security stamp.");
            }
            const securityStamp = yield this.getStateValueByUserIdAndKeyDef(userId, token_state_1.SECURITY_STAMP_MEMORY);
            return securityStamp;
        });
    }
    setSecurityStamp(securityStamp, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserIdGlobalState.state$));
            if (!userId) {
                throw new Error("User id not found. Cannot set security stamp.");
            }
            yield this.singleUserStateProvider
                .get(userId, token_state_1.SECURITY_STAMP_MEMORY)
                .update((_) => securityStamp);
        });
    }
    getStateValueByUserIdAndKeyDef(userId, storageLocation) {
        return __awaiter(this, void 0, void 0, function* () {
            // read from single user state provider
            return yield (0, rxjs_1.firstValueFrom)(this.singleUserStateProvider.get(userId, storageLocation).state$);
        });
    }
    determineStorageLocation(vaultTimeoutAction, vaultTimeout, useSecureStorage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vaultTimeoutAction == null) {
                throw new Error("TokenService - determineStorageLocation: We expect the vault timeout action to always exist at this point.");
            }
            if (vaultTimeout == null) {
                throw new Error("TokenService - determineStorageLocation: We expect the vault timeout to always exist at this point.");
            }
            if (vaultTimeoutAction === vault_timeout_action_enum_1.VaultTimeoutAction.LogOut &&
                vaultTimeout !== vault_timeout_type_1.VaultTimeoutStringType.Never) {
                return TokenStorageLocation.Memory;
            }
            else {
                if (useSecureStorage && this.platformSupportsSecureStorage) {
                    return TokenStorageLocation.SecureStorage;
                }
                return TokenStorageLocation.Disk;
            }
        });
    }
    saveStringToSecureStorage(userId, storageKey, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.secureStorageService.save(`${userId}${storageKey}`, value, this.getSecureStorageOptions(userId));
        });
    }
    getStringFromSecureStorage(userId, storageKey) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we have a user ID, read from secure storage.
            return yield this.secureStorageService.get(`${userId}${storageKey}`, this.getSecureStorageOptions(userId));
        });
    }
    getSecureStorageOptions(userId) {
        return {
            storageLocation: enums_1.StorageLocation.Disk,
            useSecureStorage: true,
            userId: userId,
        };
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map