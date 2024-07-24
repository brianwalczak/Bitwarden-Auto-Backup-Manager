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
exports.UserNotificationSettingsService = exports.UserNotificationSettingsServiceAbstraction = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../platform/state");
const ENABLE_ADDED_LOGIN_PROMPT = new state_1.KeyDefinition(state_1.USER_NOTIFICATION_SETTINGS_DISK, "enableAddedLoginPrompt", {
    deserializer: (value) => value !== null && value !== void 0 ? value : true,
});
const ENABLE_CHANGED_PASSWORD_PROMPT = new state_1.KeyDefinition(state_1.USER_NOTIFICATION_SETTINGS_DISK, "enableChangedPasswordPrompt", {
    deserializer: (value) => value !== null && value !== void 0 ? value : true,
});
class UserNotificationSettingsServiceAbstraction {
}
exports.UserNotificationSettingsServiceAbstraction = UserNotificationSettingsServiceAbstraction;
class UserNotificationSettingsService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.enableAddedLoginPromptState = this.stateProvider.getGlobal(ENABLE_ADDED_LOGIN_PROMPT);
        this.enableAddedLoginPrompt$ = this.enableAddedLoginPromptState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.enableChangedPasswordPromptState = this.stateProvider.getGlobal(ENABLE_CHANGED_PASSWORD_PROMPT);
        this.enableChangedPasswordPrompt$ = this.enableChangedPasswordPromptState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
    }
    setEnableAddedLoginPrompt(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enableAddedLoginPromptState.update(() => newValue);
        });
    }
    setEnableChangedPasswordPrompt(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enableChangedPasswordPromptState.update(() => newValue);
        });
    }
}
exports.UserNotificationSettingsService = UserNotificationSettingsService;
//# sourceMappingURL=user-notification-settings.service.js.map