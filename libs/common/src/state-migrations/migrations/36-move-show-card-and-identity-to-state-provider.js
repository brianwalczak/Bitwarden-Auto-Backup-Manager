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
exports.VaultSettingsKeyMigrator = void 0;
const migrator_1 = require("../migrator");
const vaultSettingsStateDefinition = {
    stateDefinition: {
        name: "vaultSettings",
    },
};
class VaultSettingsKeyMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updateAccount = false;
                    const accountSettings = account === null || account === void 0 ? void 0 : account.settings;
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.dontShowCardsCurrentTab) != null) {
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, vaultSettingsStateDefinition), { key: "showCardsCurrentTab" }), !accountSettings.dontShowCardsCurrentTab);
                        delete account.settings.dontShowCardsCurrentTab;
                        updateAccount = true;
                    }
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.dontShowIdentitiesCurrentTab) != null) {
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, vaultSettingsStateDefinition), { key: "showIdentitiesCurrentTab" }), !accountSettings.dontShowIdentitiesCurrentTab);
                        delete account.settings.dontShowIdentitiesCurrentTab;
                        updateAccount = true;
                    }
                    if (updateAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let updateAccount = false;
                    let settings = (_a = account === null || account === void 0 ? void 0 : account.settings) !== null && _a !== void 0 ? _a : {};
                    const showCardsCurrentTab = yield helper.getFromUser(userId, Object.assign(Object.assign({}, vaultSettingsStateDefinition), { key: "showCardsCurrentTab" }));
                    const showIdentitiesCurrentTab = yield helper.getFromUser(userId, Object.assign(Object.assign({}, vaultSettingsStateDefinition), { key: "showIdentitiesCurrentTab" }));
                    if (showCardsCurrentTab != null) {
                        // invert the value to match the new naming convention
                        settings = Object.assign(Object.assign({}, settings), { dontShowCardsCurrentTab: !showCardsCurrentTab });
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, vaultSettingsStateDefinition), { key: "showCardsCurrentTab" }), null);
                        updateAccount = true;
                    }
                    if (showIdentitiesCurrentTab != null) {
                        // invert the value to match the new naming convention
                        settings = Object.assign(Object.assign({}, settings), { dontShowIdentitiesCurrentTab: !showIdentitiesCurrentTab });
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, vaultSettingsStateDefinition), { key: "showIdentitiesCurrentTab" }), null);
                        updateAccount = true;
                    }
                    if (updateAccount) {
                        yield helper.set(userId, Object.assign(Object.assign({}, account), { settings }));
                    }
                });
            }
        });
    }
}
exports.VaultSettingsKeyMigrator = VaultSettingsKeyMigrator;
//# sourceMappingURL=36-move-show-card-and-identity-to-state-provider.js.map