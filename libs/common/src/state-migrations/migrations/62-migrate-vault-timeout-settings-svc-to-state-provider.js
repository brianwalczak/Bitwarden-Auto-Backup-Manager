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
exports.VaultTimeoutSettingsServiceStateProviderMigrator = exports.ClientType = exports.VAULT_TIMEOUT_ACTION = exports.VAULT_TIMEOUT = void 0;
const migrator_1 = require("../migrator");
const VAULT_TIMEOUT_SETTINGS_STATE_DEF_LIKE = {
    name: "vaultTimeoutSettings",
};
exports.VAULT_TIMEOUT = {
    key: "vaultTimeout", // matches KeyDefinition.key
    stateDefinition: VAULT_TIMEOUT_SETTINGS_STATE_DEF_LIKE,
};
exports.VAULT_TIMEOUT_ACTION = {
    key: "vaultTimeoutAction", // matches KeyDefinition.key
    stateDefinition: VAULT_TIMEOUT_SETTINGS_STATE_DEF_LIKE,
};
// Define mapping of old values to new values for migration purposes
const vaultTimeoutTypeMigrateRecord = {
    null: "never",
    "-1": "onRestart",
    "-2": "onLocked",
    "-3": "onSleep",
    "-4": "onIdle",
};
// define mapping of new values to old values for rollback purposes
const vaultTimeoutTypeRollbackRecord = {
    never: null,
    onRestart: -1,
    onLocked: -2,
    onSleep: -3,
    onIdle: -4,
};
var ClientType;
(function (ClientType) {
    ClientType["Web"] = "web";
    ClientType["Browser"] = "browser";
    ClientType["Desktop"] = "desktop";
    ClientType["Cli"] = "cli";
})(ClientType || (exports.ClientType = ClientType = {}));
class VaultTimeoutSettingsServiceStateProviderMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const globalData = yield helper.get("global");
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    let updatedAccount = false;
                    // Migrate vault timeout
                    let existingVaultTimeout = (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.vaultTimeout;
                    if (helper.clientType === ClientType.Cli && existingVaultTimeout === undefined) {
                        // The CLI does not set a vault timeout by default so we need to set it to null
                        // so that the migration can migrate null to "never" as the CLI does not have a vault timeout.
                        existingVaultTimeout = null;
                    }
                    if (existingVaultTimeout !== undefined) {
                        // check undefined so that we allow null values (previously meant never timeout)
                        // Only migrate data that exists
                        if (existingVaultTimeout === null || existingVaultTimeout < 0) {
                            // Map null or negative values to new string values
                            const newVaultTimeout = vaultTimeoutTypeMigrateRecord[existingVaultTimeout];
                            yield helper.setToUser(userId, exports.VAULT_TIMEOUT, newVaultTimeout);
                        }
                        else {
                            // Persist positive numbers as is
                            yield helper.setToUser(userId, exports.VAULT_TIMEOUT, existingVaultTimeout);
                        }
                        (_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? true : delete _b.vaultTimeout;
                        updatedAccount = true;
                    }
                    // Migrate vault timeout action
                    const existingVaultTimeoutAction = (_c = account === null || account === void 0 ? void 0 : account.settings) === null || _c === void 0 ? void 0 : _c.vaultTimeoutAction;
                    if (existingVaultTimeoutAction != null) {
                        // Only migrate data that exists
                        yield helper.setToUser(userId, exports.VAULT_TIMEOUT_ACTION, existingVaultTimeoutAction);
                        (_d = account === null || account === void 0 ? void 0 : account.settings) === null || _d === void 0 ? true : delete _d.vaultTimeoutAction;
                        updatedAccount = true;
                    }
                    // Note: we are explicitly not worrying about mapping over the global fallback vault timeout / action
                    // into the new state provider framework.  It was originally a fallback but hasn't been used for years
                    // so this migration will clean up the global properties fully.
                    if (updatedAccount) {
                        // Save the migrated account only if it was updated
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
            // Delete global data (works for browser extension and web; CLI doesn't have these as global settings).
            globalData === null || globalData === void 0 ? true : delete globalData.vaultTimeout;
            globalData === null || globalData === void 0 ? true : delete globalData.vaultTimeoutAction;
            yield helper.set("global", globalData);
            // Remove desktop only settings. These aren't found by the above global key removal b/c of
            // the different storage key format. This removal does not cause any issues on migrating for other clients.
            yield helper.remove("global\\.vaultTimeout");
            yield helper.remove("global\\.vaultTimeoutAction");
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updatedLegacyAccount = false;
                    // Rollback vault timeout
                    const migratedVaultTimeout = yield helper.getFromUser(userId, exports.VAULT_TIMEOUT);
                    if ((account === null || account === void 0 ? void 0 : account.settings) && migratedVaultTimeout != null) {
                        if (typeof migratedVaultTimeout === "string") {
                            // Map new string values back to old values
                            account.settings.vaultTimeout = vaultTimeoutTypeRollbackRecord[migratedVaultTimeout];
                        }
                        else {
                            // persist numbers as is
                            account.settings.vaultTimeout = migratedVaultTimeout;
                        }
                        updatedLegacyAccount = true;
                    }
                    yield helper.setToUser(userId, exports.VAULT_TIMEOUT, null);
                    // Rollback vault timeout action
                    const migratedVaultTimeoutAction = yield helper.getFromUser(userId, exports.VAULT_TIMEOUT_ACTION);
                    if ((account === null || account === void 0 ? void 0 : account.settings) && migratedVaultTimeoutAction != null) {
                        account.settings.vaultTimeoutAction = migratedVaultTimeoutAction;
                        updatedLegacyAccount = true;
                    }
                    yield helper.setToUser(userId, exports.VAULT_TIMEOUT_ACTION, null);
                    if (updatedLegacyAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.VaultTimeoutSettingsServiceStateProviderMigrator = VaultTimeoutSettingsServiceStateProviderMigrator;
//# sourceMappingURL=62-migrate-vault-timeout-settings-svc-to-state-provider.js.map