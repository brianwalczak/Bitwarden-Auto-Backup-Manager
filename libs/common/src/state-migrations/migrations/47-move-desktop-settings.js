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
exports.MoveDesktopSettingsMigrator = void 0;
const migrator_1 = require("../migrator");
const DESKTOP_SETTINGS_STATE = { name: "desktopSettings" };
const WINDOW_KEY = { key: "window", stateDefinition: DESKTOP_SETTINGS_STATE };
const CLOSE_TO_TRAY_KEY = {
    key: "closeToTray",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
const MINIMIZE_TO_TRAY_KEY = {
    key: "minimizeToTray",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
const START_TO_TRAY_KEY = {
    key: "startToTray",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
const TRAY_ENABLED_KEY = {
    key: "trayEnabled",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
const OPEN_AT_LOGIN_KEY = {
    key: "openAtLogin",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
const ALWAYS_SHOW_DOCK_KEY = {
    key: "alwaysShowDock",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
const ALWAYS_ON_TOP_KEY = {
    key: "alwaysOnTop",
    stateDefinition: DESKTOP_SETTINGS_STATE,
};
class MoveDesktopSettingsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyGlobal = yield helper.get("global");
            let updatedGlobal = false;
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.window) !== undefined) {
                yield helper.setToGlobal(WINDOW_KEY, legacyGlobal.window);
                updatedGlobal = true;
                delete legacyGlobal.window;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableCloseToTray) != null) {
                yield helper.setToGlobal(CLOSE_TO_TRAY_KEY, legacyGlobal.enableCloseToTray);
                updatedGlobal = true;
                delete legacyGlobal.enableCloseToTray;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableMinimizeToTray) != null) {
                yield helper.setToGlobal(MINIMIZE_TO_TRAY_KEY, legacyGlobal.enableMinimizeToTray);
                updatedGlobal = true;
                delete legacyGlobal.enableMinimizeToTray;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableStartToTray) != null) {
                yield helper.setToGlobal(START_TO_TRAY_KEY, legacyGlobal.enableStartToTray);
                updatedGlobal = true;
                delete legacyGlobal.enableStartToTray;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableTray) != null) {
                yield helper.setToGlobal(TRAY_ENABLED_KEY, legacyGlobal.enableTray);
                updatedGlobal = true;
                delete legacyGlobal.enableTray;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.openAtLogin) != null) {
                yield helper.setToGlobal(OPEN_AT_LOGIN_KEY, legacyGlobal.openAtLogin);
                updatedGlobal = true;
                delete legacyGlobal.openAtLogin;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.alwaysShowDock) != null) {
                yield helper.setToGlobal(ALWAYS_SHOW_DOCK_KEY, legacyGlobal.alwaysShowDock);
                updatedGlobal = true;
                delete legacyGlobal.alwaysShowDock;
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.enableAlwaysOnTop) != null) {
                yield helper.setToGlobal(ALWAYS_ON_TOP_KEY, legacyGlobal.enableAlwaysOnTop);
                updatedGlobal = true;
                delete legacyGlobal.enableAlwaysOnTop;
            }
            if (updatedGlobal) {
                yield helper.set("global", legacyGlobal);
            }
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    // We only migrate the global setting for this, if we find it on the account object
                    // just delete it.
                    if (((_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.enableAlwaysOnTop) != null) {
                        delete account.settings.enableAlwaysOnTop;
                        yield helper.set(userId, account);
                    }
                });
            }
            const accounts = yield helper.getAccounts();
            yield Promise.all(accounts.map(({ userId, account }) => migrateAccount(userId, account)));
        });
    }
    rollback(helper) {
        throw migrator_1.IRREVERSIBLE;
    }
}
exports.MoveDesktopSettingsMigrator = MoveDesktopSettingsMigrator;
//# sourceMappingURL=47-move-desktop-settings.js.map