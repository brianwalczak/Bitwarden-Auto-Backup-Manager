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
exports.SystemService = void 0;
const rxjs_1 = require("rxjs");
const authentication_status_1 = require("../../auth/enums/authentication-status");
const vault_timeout_action_enum_1 = require("../../enums/vault-timeout-action.enum");
const utils_1 = require("../misc/utils");
const scheduled_task_name_enum_1 = require("../scheduling/scheduled-task-name.enum");
class SystemService {
    constructor(pinService, messagingService, platformUtilsService, reloadCallback = null, autofillSettingsService, vaultTimeoutSettingsService, biometricStateService, accountService, taskSchedulerService) {
        this.pinService = pinService;
        this.messagingService = messagingService;
        this.platformUtilsService = platformUtilsService;
        this.reloadCallback = reloadCallback;
        this.autofillSettingsService = autofillSettingsService;
        this.vaultTimeoutSettingsService = vaultTimeoutSettingsService;
        this.biometricStateService = biometricStateService;
        this.accountService = accountService;
        this.taskSchedulerService = taskSchedulerService;
        this.reloadInterval = null;
        this.clearClipboardTimeoutFunction = null;
        this.taskSchedulerService.registerTaskHandler(scheduled_task_name_enum_1.ScheduledTaskNames.systemClearClipboardTimeout, () => this.clearPendingClipboard());
    }
    startProcessReload(authService) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accounts = yield (0, rxjs_1.firstValueFrom)(this.accountService.accounts$);
            if (accounts != null) {
                const keys = Object.keys(accounts);
                if (keys.length > 0) {
                    for (const userId of keys) {
                        let status = yield (0, rxjs_1.firstValueFrom)(authService.authStatusFor$(userId));
                        status = yield authService.getAuthStatus(userId);
                        if (status === authentication_status_1.AuthenticationStatus.Unlocked) {
                            return;
                        }
                    }
                }
            }
            // A reloadInterval has already been set and is executing
            if (this.reloadInterval != null) {
                return;
            }
            // If there is an active user, check if they have a pinKeyEncryptedUserKeyEphemeral. If so, prevent process reload upon lock.
            const userId = (_a = (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$))) === null || _a === void 0 ? void 0 : _a.id;
            if (userId != null) {
                const ephemeralPin = yield this.pinService.getPinKeyEncryptedUserKeyEphemeral(userId);
                if (ephemeralPin != null) {
                    return;
                }
            }
            this.cancelProcessReload();
            yield this.executeProcessReload();
        });
    }
    executeProcessReload() {
        return __awaiter(this, void 0, void 0, function* () {
            const biometricLockedFingerprintValidated = yield (0, rxjs_1.firstValueFrom)(this.biometricStateService.fingerprintValidated$);
            if (!biometricLockedFingerprintValidated) {
                clearInterval(this.reloadInterval);
                this.reloadInterval = null;
                const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id), (0, rxjs_1.timeout)(500)));
                // Replace current active user if they will be logged out on reload
                if (activeUserId != null) {
                    const timeoutAction = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService
                        .getVaultTimeoutActionByUserId$(activeUserId)
                        .pipe((0, rxjs_1.timeout)(500)));
                    if (timeoutAction === vault_timeout_action_enum_1.VaultTimeoutAction.LogOut) {
                        const nextUser = yield (0, rxjs_1.firstValueFrom)(this.accountService.nextUpAccount$.pipe((0, rxjs_1.map)((account) => { var _a; return (_a = account === null || account === void 0 ? void 0 : account.id) !== null && _a !== void 0 ? _a : null; })));
                        yield this.accountService.switchAccount(nextUser);
                    }
                }
                this.messagingService.send("reloadProcess");
                if (this.reloadCallback != null) {
                    yield this.reloadCallback();
                }
                return;
            }
            if (this.reloadInterval == null) {
                this.reloadInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () { return yield this.executeProcessReload(); }), 1000);
            }
        });
    }
    cancelProcessReload() {
        if (this.reloadInterval != null) {
            clearInterval(this.reloadInterval);
            this.reloadInterval = null;
        }
    }
    clearClipboard(clipboardValue_1) {
        return __awaiter(this, arguments, void 0, function* (clipboardValue, timeoutMs = null) {
            var _a;
            (_a = this.clearClipboardTimeoutSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            if (utils_1.Utils.isNullOrWhitespace(clipboardValue)) {
                return;
            }
            let taskTimeoutInMs = timeoutMs;
            if (!taskTimeoutInMs) {
                const clearClipboardDelayInSeconds = yield (0, rxjs_1.firstValueFrom)(this.autofillSettingsService.clearClipboardDelay$);
                taskTimeoutInMs = clearClipboardDelayInSeconds ? clearClipboardDelayInSeconds * 1000 : null;
            }
            if (!taskTimeoutInMs) {
                return;
            }
            this.clearClipboardTimeoutFunction = () => __awaiter(this, void 0, void 0, function* () {
                const clipboardValueNow = yield this.platformUtilsService.readFromClipboard();
                if (clipboardValue === clipboardValueNow) {
                    this.platformUtilsService.copyToClipboard("", { clearing: true });
                }
            });
            this.clearClipboardTimeoutSubscription = this.taskSchedulerService.setTimeout(scheduled_task_name_enum_1.ScheduledTaskNames.systemClearClipboardTimeout, taskTimeoutInMs);
        });
    }
    clearPendingClipboard() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clearClipboardTimeoutFunction != null) {
                yield this.clearClipboardTimeoutFunction();
                this.clearClipboardTimeoutFunction = null;
            }
        });
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=system.service.js.map