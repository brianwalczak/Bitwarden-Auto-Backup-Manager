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
exports.VaultTimeoutService = void 0;
const rxjs_1 = require("rxjs");
const scheduling_1 = require("@bitwarden/common/platform/scheduling");
const authentication_status_1 = require("../../auth/enums/authentication-status");
const vault_timeout_action_enum_1 = require("../../enums/vault-timeout-action.enum");
class VaultTimeoutService {
    constructor(accountService, masterPasswordService, cipherService, folderService, collectionService, platformUtilsService, messagingService, searchService, stateService, authService, vaultTimeoutSettingsService, stateEventRunnerService, taskSchedulerService, logService, lockedCallback = null, loggedOutCallback = null) {
        this.accountService = accountService;
        this.masterPasswordService = masterPasswordService;
        this.cipherService = cipherService;
        this.folderService = folderService;
        this.collectionService = collectionService;
        this.platformUtilsService = platformUtilsService;
        this.messagingService = messagingService;
        this.searchService = searchService;
        this.stateService = stateService;
        this.authService = authService;
        this.vaultTimeoutSettingsService = vaultTimeoutSettingsService;
        this.stateEventRunnerService = stateEventRunnerService;
        this.taskSchedulerService = taskSchedulerService;
        this.logService = logService;
        this.lockedCallback = lockedCallback;
        this.loggedOutCallback = loggedOutCallback;
        this.inited = false;
        this.taskSchedulerService.registerTaskHandler(scheduling_1.ScheduledTaskNames.vaultTimeoutCheckInterval, () => this.checkVaultTimeout());
    }
    init(checkOnInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inited) {
                return;
            }
            this.inited = true;
            if (checkOnInterval) {
                this.startCheck();
            }
        });
    }
    startCheck() {
        this.checkVaultTimeout().catch((error) => this.logService.error(error));
        this.taskSchedulerService.setInterval(scheduling_1.ScheduledTaskNames.vaultTimeoutCheckInterval, 10 * 1000);
    }
    checkVaultTimeout() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get whether or not the view is open a single time so it can be compared for each user
            const isViewOpen = yield this.platformUtilsService.isViewOpen();
            yield (0, rxjs_1.firstValueFrom)((0, rxjs_1.combineLatest)([
                this.accountService.activeAccount$,
                this.accountService.accountActivity$,
            ]).pipe((0, rxjs_1.switchMap)((_a) => __awaiter(this, [_a], void 0, function* ([activeAccount, accountActivity]) {
                const activeUserId = activeAccount === null || activeAccount === void 0 ? void 0 : activeAccount.id;
                for (const userIdString in accountActivity) {
                    const userId = userIdString;
                    if (userId != null &&
                        (yield this.shouldLock(userId, accountActivity[userId], activeUserId, isViewOpen))) {
                        yield this.executeTimeoutAction(userId);
                    }
                }
            }))));
        });
    }
    lock(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const authed = yield this.stateService.getIsAuthenticated({ userId: userId });
            if (!authed) {
                return;
            }
            const availableActions = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.availableVaultTimeoutActions$(userId));
            const supportsLock = availableActions.includes(vault_timeout_action_enum_1.VaultTimeoutAction.Lock);
            if (!supportsLock) {
                yield this.logOut(userId);
            }
            const currentUserId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id)));
            const lockingUserId = userId !== null && userId !== void 0 ? userId : currentUserId;
            // HACK: Start listening for the transition of the locking user from something to the locked state.
            // This is very much a hack to ensure that the authentication status to retrievable right after
            // it does its work. Particularly the `lockedCallback` and `"locked"` message. Instead
            // lockedCallback should be deprecated and people should subscribe and react to `authStatusFor$` themselves.
            const lockPromise = (0, rxjs_1.firstValueFrom)(this.authService.authStatusFor$(lockingUserId).pipe((0, rxjs_1.filter)((authStatus) => authStatus === authentication_status_1.AuthenticationStatus.Locked), (0, rxjs_1.timeout)({
                first: 5000,
                with: () => {
                    throw new Error("The lock process did not complete in a reasonable amount of time.");
                },
            })));
            if (userId == null || userId === currentUserId) {
                yield this.searchService.clearIndex();
                yield this.folderService.clearCache();
                yield this.collectionService.clearActiveUserCache();
            }
            yield this.masterPasswordService.clearMasterKey(lockingUserId);
            yield this.stateService.setUserKeyAutoUnlock(null, { userId: lockingUserId });
            yield this.stateService.setCryptoMasterKeyAuto(null, { userId: lockingUserId });
            yield this.cipherService.clearCache(lockingUserId);
            yield this.stateEventRunnerService.handleEvent("lock", lockingUserId);
            // HACK: Sit here and wait for the the auth status to transition to `Locked`
            // to ensure the message and lockedCallback will get the correct status
            // if/when they call it.
            yield lockPromise;
            this.messagingService.send("locked", { userId: lockingUserId });
            if (this.lockedCallback != null) {
                yield this.lockedCallback(userId);
            }
        });
    }
    logOut(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loggedOutCallback != null) {
                yield this.loggedOutCallback("vaultTimeout", userId);
            }
        });
    }
    shouldLock(userId, lastActive, activeUserId, isViewOpen) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isViewOpen && userId === activeUserId) {
                // We know a view is open and this is the currently active user
                // which means they are likely looking at their vault
                // and they should not lock.
                return false;
            }
            const authStatus = yield this.authService.getAuthStatus(userId);
            if (authStatus === authentication_status_1.AuthenticationStatus.Locked ||
                authStatus === authentication_status_1.AuthenticationStatus.LoggedOut) {
                return false;
            }
            const vaultTimeout = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.getVaultTimeoutByUserId$(userId));
            if (typeof vaultTimeout === "string") {
                return false;
            }
            if (lastActive == null) {
                return false;
            }
            const vaultTimeoutSeconds = vaultTimeout * 60;
            const diffSeconds = (new Date().getTime() - lastActive.getTime()) / 1000;
            return diffSeconds >= vaultTimeoutSeconds;
        });
    }
    executeTimeoutAction(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeoutAction = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.getVaultTimeoutActionByUserId$(userId));
            timeoutAction === vault_timeout_action_enum_1.VaultTimeoutAction.LogOut
                ? yield this.logOut(userId)
                : yield this.lock(userId);
        });
    }
}
exports.VaultTimeoutService = VaultTimeoutService;
//# sourceMappingURL=vault-timeout.service.js.map