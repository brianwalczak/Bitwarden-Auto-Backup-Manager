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
exports.TokenServiceStateProviderMigrator = exports.API_KEY_CLIENT_SECRET_DISK = exports.API_KEY_CLIENT_ID_DISK = exports.REFRESH_TOKEN_DISK = exports.ACCESS_TOKEN_DISK = exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL = void 0;
const migrator_1 = require("../migrator");
exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL = {
    key: "emailTwoFactorTokenRecord",
    stateDefinition: {
        name: "tokenDiskLocal",
    },
};
const TOKEN_STATE_DEF_LIKE = {
    name: "token",
};
exports.ACCESS_TOKEN_DISK = {
    key: "accessToken", // matches KeyDefinition.key
    stateDefinition: TOKEN_STATE_DEF_LIKE,
};
exports.REFRESH_TOKEN_DISK = {
    key: "refreshToken",
    stateDefinition: TOKEN_STATE_DEF_LIKE,
};
exports.API_KEY_CLIENT_ID_DISK = {
    key: "apiKeyClientId",
    stateDefinition: TOKEN_STATE_DEF_LIKE,
};
exports.API_KEY_CLIENT_SECRET_DISK = {
    key: "apiKeyClientSecret",
    stateDefinition: TOKEN_STATE_DEF_LIKE,
};
class TokenServiceStateProviderMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // Move global data
            const globalData = yield helper.get("global");
            // Create new global record for 2FA token that we can accumulate data in
            const emailTwoFactorTokenRecord = {};
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account, globalTwoFactorToken, emailTwoFactorTokenRecord) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e;
                    let updatedAccount = false;
                    // migrate 2FA token from global to user state
                    // Due to the existing implmentation, n users on the same device share the same global state value for 2FA token.
                    // So, we will just migrate it to all users to keep it valid for whichever was the user that set it previously.
                    // Note: don't bother migrating 2FA Token if user account or email is undefined
                    const email = (_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.email;
                    if (globalTwoFactorToken != undefined && account != undefined && email != undefined) {
                        emailTwoFactorTokenRecord[email] = globalTwoFactorToken;
                        // Note: don't set updatedAccount to true here as we aren't updating
                        // the legacy user state, just migrating a global state to a new user state
                    }
                    // Migrate access token
                    const existingAccessToken = (_b = account === null || account === void 0 ? void 0 : account.tokens) === null || _b === void 0 ? void 0 : _b.accessToken;
                    if (existingAccessToken != null) {
                        // Only migrate data that exists
                        if (helper.type !== "web-disk-local") {
                            // only migrate access token to session storage - never local.
                            yield helper.setToUser(userId, exports.ACCESS_TOKEN_DISK, existingAccessToken);
                        }
                        delete account.tokens.accessToken;
                        updatedAccount = true;
                    }
                    // Migrate refresh token
                    const existingRefreshToken = (_c = account === null || account === void 0 ? void 0 : account.tokens) === null || _c === void 0 ? void 0 : _c.refreshToken;
                    if (existingRefreshToken != null) {
                        if (helper.type !== "web-disk-local") {
                            // only migrate refresh token to session storage - never local.
                            yield helper.setToUser(userId, exports.REFRESH_TOKEN_DISK, existingRefreshToken);
                        }
                        delete account.tokens.refreshToken;
                        updatedAccount = true;
                    }
                    // Migrate API key client id
                    const existingApiKeyClientId = (_d = account === null || account === void 0 ? void 0 : account.profile) === null || _d === void 0 ? void 0 : _d.apiKeyClientId;
                    if (existingApiKeyClientId != null) {
                        if (helper.type !== "web-disk-local") {
                            // only migrate client id to session storage - never local.
                            yield helper.setToUser(userId, exports.API_KEY_CLIENT_ID_DISK, existingApiKeyClientId);
                        }
                        delete account.profile.apiKeyClientId;
                        updatedAccount = true;
                    }
                    // Migrate API key client secret
                    const existingApiKeyClientSecret = (_e = account === null || account === void 0 ? void 0 : account.keys) === null || _e === void 0 ? void 0 : _e.apiKeyClientSecret;
                    if (existingApiKeyClientSecret != null) {
                        if (helper.type !== "web-disk-local") {
                            // only migrate client secret to session storage - never local.
                            yield helper.setToUser(userId, exports.API_KEY_CLIENT_SECRET_DISK, existingApiKeyClientSecret);
                        }
                        delete account.keys.apiKeyClientSecret;
                        updatedAccount = true;
                    }
                    if (updatedAccount) {
                        // Save the migrated account only if it was updated
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([
                ...accounts.map(({ userId, account }) => migrateAccount(userId, account, globalData === null || globalData === void 0 ? void 0 : globalData.twoFactorToken, emailTwoFactorTokenRecord)),
            ]);
            // Save the global 2FA token record
            yield helper.setToGlobal(exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL, emailTwoFactorTokenRecord);
            // Delete global data
            globalData === null || globalData === void 0 ? true : delete globalData.twoFactorToken;
            yield helper.set("global", globalData);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accounts = yield helper.getAccounts();
            // Since we migrated the global 2FA token to all users, we need to rollback the 2FA token for all users
            // but we only need to set it to the global state once
            // Go through accounts and find the first user that has a non-null email and 2FA token
            let migratedTwoFactorToken = null;
            for (const { account } of accounts) {
                const email = (_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.email;
                if (email == null) {
                    continue;
                }
                const emailTwoFactorTokenRecord = yield helper.getFromGlobal(exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL);
                migratedTwoFactorToken = emailTwoFactorTokenRecord[email];
                if (migratedTwoFactorToken != null) {
                    break;
                }
            }
            if (migratedTwoFactorToken != null) {
                let legacyGlobal = yield helper.get("global");
                if (!legacyGlobal) {
                    legacyGlobal = {};
                }
                legacyGlobal.twoFactorToken = migratedTwoFactorToken;
                yield helper.set("global", legacyGlobal);
            }
            // delete global 2FA token record
            yield helper.setToGlobal(exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL, null);
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updatedLegacyAccount = false;
                    // Rollback access token
                    const migratedAccessToken = yield helper.getFromUser(userId, exports.ACCESS_TOKEN_DISK);
                    if ((account === null || account === void 0 ? void 0 : account.tokens) && migratedAccessToken != null) {
                        account.tokens.accessToken = migratedAccessToken;
                        updatedLegacyAccount = true;
                    }
                    yield helper.setToUser(userId, exports.ACCESS_TOKEN_DISK, null);
                    // Rollback refresh token
                    const migratedRefreshToken = yield helper.getFromUser(userId, exports.REFRESH_TOKEN_DISK);
                    if ((account === null || account === void 0 ? void 0 : account.tokens) && migratedRefreshToken != null) {
                        account.tokens.refreshToken = migratedRefreshToken;
                        updatedLegacyAccount = true;
                    }
                    yield helper.setToUser(userId, exports.REFRESH_TOKEN_DISK, null);
                    // Rollback API key client id
                    const migratedApiKeyClientId = yield helper.getFromUser(userId, exports.API_KEY_CLIENT_ID_DISK);
                    if ((account === null || account === void 0 ? void 0 : account.profile) && migratedApiKeyClientId != null) {
                        account.profile.apiKeyClientId = migratedApiKeyClientId;
                        updatedLegacyAccount = true;
                    }
                    yield helper.setToUser(userId, exports.API_KEY_CLIENT_ID_DISK, null);
                    // Rollback API key client secret
                    const migratedApiKeyClientSecret = yield helper.getFromUser(userId, exports.API_KEY_CLIENT_SECRET_DISK);
                    if ((account === null || account === void 0 ? void 0 : account.keys) && migratedApiKeyClientSecret != null) {
                        account.keys.apiKeyClientSecret = migratedApiKeyClientSecret;
                        updatedLegacyAccount = true;
                    }
                    yield helper.setToUser(userId, exports.API_KEY_CLIENT_SECRET_DISK, null);
                    if (updatedLegacyAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.TokenServiceStateProviderMigrator = TokenServiceStateProviderMigrator;
//# sourceMappingURL=38-migrate-token-svc-to-state-provider.js.map