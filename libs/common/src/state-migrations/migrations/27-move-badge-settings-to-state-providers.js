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
exports.BadgeSettingsMigrator = void 0;
const migrator_1 = require("../migrator");
const enableBadgeCounterKeyDefinition = {
    stateDefinition: {
        name: "badgeSettings",
    },
    key: "enableBadgeCounter",
};
class BadgeSettingsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // account state (e.g. account settings -> state provider framework keys)
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
            // migrate account state
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    const accountSettings = account === null || account === void 0 ? void 0 : account.settings;
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.disableBadgeCounter) != undefined) {
                        yield helper.setToUser(userId, enableBadgeCounterKeyDefinition, !accountSettings.disableBadgeCounter);
                        delete account.settings.disableBadgeCounter;
                        // update the state account settings with the migrated values deleted
                        yield helper.set(userId, account);
                    }
                });
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // account state (e.g. state provider framework keys -> account settings)
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
            // rollback account state
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let settings = (account === null || account === void 0 ? void 0 : account.settings) || {};
                    const enableBadgeCounter = yield helper.getFromUser(userId, enableBadgeCounterKeyDefinition);
                    // update new settings and remove the account state provider framework keys for the rolled back values
                    if (enableBadgeCounter != undefined) {
                        settings = Object.assign(Object.assign({}, settings), { disableBadgeCounter: !enableBadgeCounter });
                        yield helper.setToUser(userId, enableBadgeCounterKeyDefinition, null);
                        // commit updated settings to state
                        yield helper.set(userId, Object.assign(Object.assign({}, account), { settings }));
                    }
                });
            }
        });
    }
}
exports.BadgeSettingsMigrator = BadgeSettingsMigrator;
//# sourceMappingURL=27-move-badge-settings-to-state-providers.js.map