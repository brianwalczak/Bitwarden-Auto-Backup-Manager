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
exports.DomainSettingsMigrator = void 0;
const migrator_1 = require("../migrator");
const UriMatchStrategy = {
    Domain: 0,
    Host: 1,
    StartsWith: 2,
    Exact: 3,
    RegularExpression: 4,
    Never: 5,
};
const defaultUriMatchStrategyDefinition = {
    stateDefinition: {
        name: "domainSettings",
    },
    key: "defaultUriMatchStrategy",
};
const equivalentDomainsDefinition = {
    stateDefinition: {
        name: "domainSettings",
    },
    key: "equivalentDomains",
};
const neverDomainsDefinition = {
    stateDefinition: {
        name: "domainSettings",
    },
    key: "neverDomains",
};
class DomainSettingsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateAccount = false;
            // global state ("neverDomains")
            const globalState = yield helper.get("global");
            if ((globalState === null || globalState === void 0 ? void 0 : globalState.neverDomains) != null) {
                yield helper.setToGlobal(neverDomainsDefinition, globalState.neverDomains);
                // delete `neverDomains` from state global
                delete globalState.neverDomains;
                yield helper.set("global", globalState);
            }
            // account state ("defaultUriMatch" and "settings.equivalentDomains")
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
            // migrate account state
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const accountSettings = account === null || account === void 0 ? void 0 : account.settings;
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.defaultUriMatch) != undefined) {
                        yield helper.setToUser(userId, defaultUriMatchStrategyDefinition, accountSettings.defaultUriMatch);
                        delete account.settings.defaultUriMatch;
                        updateAccount = true;
                    }
                    if (((_a = accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.settings) === null || _a === void 0 ? void 0 : _a.equivalentDomains) != undefined) {
                        yield helper.setToUser(userId, equivalentDomainsDefinition, accountSettings.settings.equivalentDomains);
                        delete account.settings.settings.equivalentDomains;
                        delete account.settings.settings;
                        updateAccount = true;
                    }
                    if (updateAccount) {
                        // update the state account settings with the migrated values deleted
                        yield helper.set(userId, account);
                    }
                });
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateAccount = false;
            // global state ("neverDomains")
            const globalState = (yield helper.get("global")) || {};
            const neverDomains = yield helper.getFromGlobal(neverDomainsDefinition);
            if (neverDomains != null) {
                yield helper.set("global", Object.assign(Object.assign({}, globalState), { neverDomains: neverDomains }));
                // remove the global state provider framework key for `neverDomains`
                yield helper.setToGlobal(neverDomainsDefinition, null);
            }
            // account state ("defaultUriMatchStrategy" and "equivalentDomains")
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
            // rollback account state
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let settings = (account === null || account === void 0 ? void 0 : account.settings) || {};
                    const defaultUriMatchStrategy = yield helper.getFromUser(userId, defaultUriMatchStrategyDefinition);
                    const equivalentDomains = yield helper.getFromUser(userId, equivalentDomainsDefinition);
                    // update new settings and remove the account state provider framework keys for the rolled back values
                    if (defaultUriMatchStrategy != null) {
                        settings = Object.assign(Object.assign({}, settings), { defaultUriMatch: defaultUriMatchStrategy });
                        yield helper.setToUser(userId, defaultUriMatchStrategyDefinition, null);
                        updateAccount = true;
                    }
                    if (equivalentDomains != null) {
                        settings = Object.assign(Object.assign({}, settings), { settings: { equivalentDomains } });
                        yield helper.setToUser(userId, equivalentDomainsDefinition, null);
                        updateAccount = true;
                    }
                    // commit updated settings to state
                    if (updateAccount) {
                        yield helper.set(userId, Object.assign(Object.assign({}, account), { settings }));
                    }
                });
            }
        });
    }
}
exports.DomainSettingsMigrator = DomainSettingsMigrator;
//# sourceMappingURL=34-move-domain-settings-to-state-providers.js.map