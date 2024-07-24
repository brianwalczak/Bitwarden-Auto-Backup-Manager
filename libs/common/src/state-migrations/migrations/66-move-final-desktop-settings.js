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
exports.MoveFinalDesktopSettingsMigrator = void 0;
const migrator_1 = require("../migrator");
const DESKTOP_SETTINGS_DISK = {
    name: "desktopSettings",
};
const BROWSER_INTEGRATION_ENABLED = {
    key: "browserIntegrationEnabled",
    stateDefinition: DESKTOP_SETTINGS_DISK,
};
const BROWSER_INTEGRATION_FINGERPRINT_ENABLED = {
    key: "browserIntegrationFingerprintEnabled",
    stateDefinition: DESKTOP_SETTINGS_DISK,
};
const MINIMIZE_ON_COPY = {
    key: "minimizeOnCopy",
    stateDefinition: DESKTOP_SETTINGS_DISK,
};
class MoveFinalDesktopSettingsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyGlobal = yield helper.get("global");
            const enableBrowserIntegrationValue = legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableBrowserIntegration;
            const enableBrowserIntegrationFingerprintValue = legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableBrowserIntegrationFingerprint;
            let updatedGlobal = false;
            if (enableBrowserIntegrationValue != null) {
                yield helper.setToGlobal(BROWSER_INTEGRATION_ENABLED, enableBrowserIntegrationValue);
                delete legacyGlobal.enableBrowserIntegration;
                updatedGlobal = true;
            }
            if (enableBrowserIntegrationFingerprintValue != null) {
                yield helper.setToGlobal(BROWSER_INTEGRATION_FINGERPRINT_ENABLED, enableBrowserIntegrationFingerprintValue);
                delete legacyGlobal.enableBrowserIntegrationFingerprint;
                updatedGlobal = true;
            }
            if (updatedGlobal) {
                yield helper.set("global", legacyGlobal);
            }
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const minimizeOnCopyToClipboardValue = (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.minimizeOnCopyToClipboard;
                    if (minimizeOnCopyToClipboardValue != null) {
                        yield helper.setToUser(userId, MINIMIZE_ON_COPY, minimizeOnCopyToClipboardValue);
                        delete account.settings.minimizeOnCopyToClipboard;
                        yield helper.set(userId, account);
                    }
                });
            }
            const accounts = yield helper.getAccounts();
            yield Promise.all(accounts.map(({ userId, account }) => migrateAccount(userId, account)));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const browserIntegrationEnabledValue = yield helper.getFromGlobal(BROWSER_INTEGRATION_ENABLED);
            const browserIntegrationFingerprintEnabled = yield helper.getFromGlobal(BROWSER_INTEGRATION_FINGERPRINT_ENABLED);
            if (browserIntegrationEnabledValue != null) {
                let legacyGlobal = yield helper.get("global");
                legacyGlobal !== null && legacyGlobal !== void 0 ? legacyGlobal : (legacyGlobal = {});
                legacyGlobal.enableBrowserIntegration = browserIntegrationEnabledValue;
                yield helper.set("global", legacyGlobal);
                yield helper.removeFromGlobal(BROWSER_INTEGRATION_ENABLED);
            }
            if (browserIntegrationFingerprintEnabled != null) {
                let legacyGlobal = yield helper.get("global");
                legacyGlobal !== null && legacyGlobal !== void 0 ? legacyGlobal : (legacyGlobal = {});
                legacyGlobal.enableBrowserIntegrationFingerprint = browserIntegrationFingerprintEnabled;
                yield helper.set("global", legacyGlobal);
                yield helper.removeFromGlobal(BROWSER_INTEGRATION_FINGERPRINT_ENABLED);
            }
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    const minimizeOnCopyToClipboardValue = yield helper.getFromUser(userId, MINIMIZE_ON_COPY);
                    if (minimizeOnCopyToClipboardValue != null) {
                        account !== null && account !== void 0 ? account : (account = { settings: {} });
                        account.settings.minimizeOnCopyToClipboard = minimizeOnCopyToClipboardValue;
                        yield helper.set(userId, account);
                        yield helper.removeFromUser(userId, MINIMIZE_ON_COPY);
                    }
                });
            }
            const accounts = yield helper.getAccounts();
            yield Promise.all(accounts.map(({ userId, account }) => rollbackAccount(userId, account)));
        });
    }
}
exports.MoveFinalDesktopSettingsMigrator = MoveFinalDesktopSettingsMigrator;
//# sourceMappingURL=66-move-final-desktop-settings.js.map