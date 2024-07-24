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
exports.UserNotificationSettingsKeyMigrator = void 0;
const migrator_1 = require("../migrator");
class UserNotificationSettingsKeyMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const globalState = yield helper.get("global");
            // disableAddLoginNotification -> enableAddedLoginPrompt
            if ((globalState === null || globalState === void 0 ? void 0 : globalState.disableAddLoginNotification) != null) {
                yield helper.setToGlobal({
                    stateDefinition: {
                        name: "userNotificationSettings",
                    },
                    key: "enableAddedLoginPrompt",
                }, !globalState.disableAddLoginNotification);
                // delete `disableAddLoginNotification` from state global
                delete globalState.disableAddLoginNotification;
                yield helper.set("global", globalState);
            }
            // disableChangedPasswordNotification -> enableChangedPasswordPrompt
            if ((globalState === null || globalState === void 0 ? void 0 : globalState.disableChangedPasswordNotification) != null) {
                yield helper.setToGlobal({
                    stateDefinition: {
                        name: "userNotificationSettings",
                    },
                    key: "enableChangedPasswordPrompt",
                }, !globalState.disableChangedPasswordNotification);
                // delete `disableChangedPasswordNotification` from state global
                delete globalState.disableChangedPasswordNotification;
                yield helper.set("global", globalState);
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const globalState = (yield helper.get("global")) || {};
            const enableAddedLoginPrompt = yield helper.getFromGlobal({
                stateDefinition: {
                    name: "userNotificationSettings",
                },
                key: "enableAddedLoginPrompt",
            });
            const enableChangedPasswordPrompt = yield helper.getFromGlobal({
                stateDefinition: {
                    name: "userNotificationSettings",
                },
                key: "enableChangedPasswordPrompt",
            });
            // enableAddedLoginPrompt -> disableAddLoginNotification
            if (enableAddedLoginPrompt) {
                yield helper.set("global", Object.assign(Object.assign({}, globalState), { disableAddLoginNotification: !enableAddedLoginPrompt }));
                // remove the global state provider framework key for `enableAddedLoginPrompt`
                yield helper.setToGlobal({
                    stateDefinition: {
                        name: "userNotificationSettings",
                    },
                    key: "enableAddedLoginPrompt",
                }, null);
            }
            // enableChangedPasswordPrompt -> disableChangedPasswordNotification
            if (enableChangedPasswordPrompt) {
                yield helper.set("global", Object.assign(Object.assign({}, globalState), { disableChangedPasswordNotification: !enableChangedPasswordPrompt }));
                // remove the global state provider framework key for `enableChangedPasswordPrompt`
                yield helper.setToGlobal({
                    stateDefinition: {
                        name: "userNotificationSettings",
                    },
                    key: "enableChangedPasswordPrompt",
                }, null);
            }
        });
    }
}
exports.UserNotificationSettingsKeyMigrator = UserNotificationSettingsKeyMigrator;
//# sourceMappingURL=29-move-user-notification-settings-to-state-provider.js.map