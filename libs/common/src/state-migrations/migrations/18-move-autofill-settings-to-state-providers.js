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
exports.AutofillSettingsKeyMigrator = void 0;
const migrator_1 = require("../migrator");
const AutofillOverlayVisibility = {
    Off: 0,
    OnButtonClick: 1,
    OnFieldFocus: 2,
};
const autofillSettingsStateDefinition = {
    stateDefinition: {
        name: "autofillSettings",
    },
};
class AutofillSettingsKeyMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // global state (e.g. "autoFillOverlayVisibility -> inlineMenuVisibility")
            const globalState = yield helper.get("global");
            if ((globalState === null || globalState === void 0 ? void 0 : globalState.autoFillOverlayVisibility) != null) {
                yield helper.setToGlobal({
                    stateDefinition: {
                        name: "autofillSettingsLocal",
                    },
                    key: "inlineMenuVisibility",
                }, globalState.autoFillOverlayVisibility);
                // delete `autoFillOverlayVisibility` from state global
                delete globalState.autoFillOverlayVisibility;
                yield helper.set("global", globalState);
            }
            // account state (e.g. account settings -> state provider framework keys)
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
            // migrate account state
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updateAccount = false;
                    const accountSettings = account === null || account === void 0 ? void 0 : account.settings;
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.autoFillOnPageLoadDefault) != null) {
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoadDefault" }), accountSettings.autoFillOnPageLoadDefault);
                        delete account.settings.autoFillOnPageLoadDefault;
                        updateAccount = true;
                    }
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.enableAutoFillOnPageLoad) != null) {
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoad" }), accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.enableAutoFillOnPageLoad);
                        delete account.settings.enableAutoFillOnPageLoad;
                        updateAccount = true;
                    }
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.dismissedAutoFillOnPageLoadCallout) != null) {
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoadCalloutIsDismissed" }), accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.dismissedAutoFillOnPageLoadCallout);
                        delete account.settings.dismissedAutoFillOnPageLoadCallout;
                        updateAccount = true;
                    }
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.disableAutoTotpCopy) != null) {
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autoCopyTotp" }), 
                        // invert the value to match the new naming convention
                        !(accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.disableAutoTotpCopy));
                        delete account.settings.disableAutoTotpCopy;
                        updateAccount = true;
                    }
                    if ((accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.activateAutoFillOnPageLoadFromPolicy) != null) {
                        yield helper.setToUser(userId, {
                            stateDefinition: {
                                name: "autofillSettingsLocal",
                            },
                            key: "activateAutofillOnPageLoadFromPolicy",
                        }, accountSettings === null || accountSettings === void 0 ? void 0 : accountSettings.activateAutoFillOnPageLoadFromPolicy);
                        delete account.settings.activateAutoFillOnPageLoadFromPolicy;
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
            // global state (e.g. "inlineMenuVisibility -> autoFillOverlayVisibility")
            const globalState = (yield helper.get("global")) || {};
            const inlineMenuVisibility = yield helper.getFromGlobal({
                stateDefinition: {
                    name: "autofillSettingsLocal",
                },
                key: "inlineMenuVisibility",
            });
            if (inlineMenuVisibility) {
                yield helper.set("global", Object.assign(Object.assign({}, globalState), { autoFillOverlayVisibility: inlineMenuVisibility }));
                // remove the global state provider framework key for `inlineMenuVisibility`
                yield helper.setToGlobal({
                    stateDefinition: {
                        name: "autofillSettingsLocal",
                    },
                    key: "inlineMenuVisibility",
                }, null);
            }
            // account state (e.g. state provider framework keys -> account settings)
            const accounts = yield helper.getAccounts();
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
            // rollback account state
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updateAccount = false;
                    let settings = (account === null || account === void 0 ? void 0 : account.settings) || {};
                    const autoFillOnPageLoadDefault = yield helper.getFromUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoadDefault" }));
                    const enableAutoFillOnPageLoad = yield helper.getFromUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoad" }));
                    const dismissedAutoFillOnPageLoadCallout = yield helper.getFromUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoadCalloutIsDismissed" }));
                    const autoCopyTotp = yield helper.getFromUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autoCopyTotp" }));
                    const activateAutoFillOnPageLoadFromPolicy = yield helper.getFromUser(userId, {
                        stateDefinition: {
                            name: "autofillSettingsLocal",
                        },
                        key: "activateAutofillOnPageLoadFromPolicy",
                    });
                    // update new settings and remove the account state provider framework keys for the rolled back values
                    if (autoFillOnPageLoadDefault != null) {
                        settings = Object.assign(Object.assign({}, settings), { autoFillOnPageLoadDefault });
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoadDefault" }), null);
                        updateAccount = true;
                    }
                    if (enableAutoFillOnPageLoad != null) {
                        settings = Object.assign(Object.assign({}, settings), { enableAutoFillOnPageLoad });
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoad" }), null);
                        updateAccount = true;
                    }
                    if (dismissedAutoFillOnPageLoadCallout != null) {
                        settings = Object.assign(Object.assign({}, settings), { dismissedAutoFillOnPageLoadCallout });
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autofillOnPageLoadCalloutIsDismissed" }), null);
                        updateAccount = true;
                    }
                    if (autoCopyTotp != null) {
                        // invert the value to match the new naming convention
                        settings = Object.assign(Object.assign({}, settings), { disableAutoTotpCopy: !autoCopyTotp });
                        yield helper.setToUser(userId, Object.assign(Object.assign({}, autofillSettingsStateDefinition), { key: "autoCopyTotp" }), null);
                        updateAccount = true;
                    }
                    if (activateAutoFillOnPageLoadFromPolicy != null) {
                        settings = Object.assign(Object.assign({}, settings), { activateAutoFillOnPageLoadFromPolicy });
                        yield helper.setToUser(userId, {
                            stateDefinition: {
                                name: "autofillSettingsLocal",
                            },
                            key: "activateAutofillOnPageLoadFromPolicy",
                        }, null);
                        updateAccount = true;
                    }
                    if (updateAccount) {
                        // commit updated settings to state
                        yield helper.set(userId, Object.assign(Object.assign({}, account), { settings }));
                    }
                });
            }
        });
    }
}
exports.AutofillSettingsKeyMigrator = AutofillSettingsKeyMigrator;
//# sourceMappingURL=18-move-autofill-settings-to-state-providers.js.map