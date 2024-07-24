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
exports.AccountServiceImplementation = exports.ACCOUNT_ACTIVITY = exports.ACCOUNT_ACTIVE_ACCOUNT_ID = exports.ACCOUNT_ACCOUNTS = void 0;
const rxjs_1 = require("rxjs");
const account_service_1 = require("../../auth/abstractions/account.service");
const utils_1 = require("../../platform/misc/utils");
const state_1 = require("../../platform/state");
exports.ACCOUNT_ACCOUNTS = state_1.KeyDefinition.record(state_1.ACCOUNT_DISK, "accounts", {
    deserializer: (accountInfo) => accountInfo,
});
exports.ACCOUNT_ACTIVE_ACCOUNT_ID = new state_1.KeyDefinition(state_1.ACCOUNT_DISK, "activeAccountId", {
    deserializer: (id) => id,
});
exports.ACCOUNT_ACTIVITY = state_1.KeyDefinition.record(state_1.ACCOUNT_DISK, "activity", {
    deserializer: (activity) => new Date(activity),
});
const LOGGED_OUT_INFO = {
    email: "",
    emailVerified: false,
    name: undefined,
};
class AccountServiceImplementation {
    constructor(messagingService, logService, globalStateProvider) {
        this.messagingService = messagingService;
        this.logService = logService;
        this.globalStateProvider = globalStateProvider;
        this.accountsState = this.globalStateProvider.get(exports.ACCOUNT_ACCOUNTS);
        this.activeAccountIdState = this.globalStateProvider.get(exports.ACCOUNT_ACTIVE_ACCOUNT_ID);
        this.accounts$ = this.accountsState.state$.pipe((0, rxjs_1.map)((accounts) => (accounts == null ? {} : accounts)));
        this.activeAccount$ = this.activeAccountIdState.state$.pipe((0, rxjs_1.combineLatestWith)(this.accounts$), (0, rxjs_1.map)(([id, accounts]) => (id ? Object.assign({ id }, accounts[id]) : undefined)), (0, rxjs_1.distinctUntilChanged)((a, b) => (a === null || a === void 0 ? void 0 : a.id) === (b === null || b === void 0 ? void 0 : b.id) && (0, account_service_1.accountInfoEqual)(a, b)), (0, rxjs_1.shareReplay)({ bufferSize: 1, refCount: false }));
        this.accountActivity$ = this.globalStateProvider
            .get(exports.ACCOUNT_ACTIVITY)
            .state$.pipe((0, rxjs_1.map)((activity) => activity !== null && activity !== void 0 ? activity : {}));
        this.sortedUserIds$ = this.accountActivity$.pipe((0, rxjs_1.map)((activity) => {
            return Object.entries(activity)
                .map(([userId, lastActive]) => ({ userId, lastActive }))
                .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime()) // later dates first
                .map((a) => a.userId);
        }));
        this.nextUpAccount$ = (0, rxjs_1.combineLatest)([
            this.accounts$,
            this.activeAccount$,
            this.sortedUserIds$,
        ]).pipe((0, rxjs_1.map)(([accounts, activeAccount, sortedUserIds]) => {
            const nextId = sortedUserIds.find((id) => id !== (activeAccount === null || activeAccount === void 0 ? void 0 : activeAccount.id) && accounts[id] != null);
            return nextId ? Object.assign({ id: nextId }, accounts[nextId]) : null;
        }));
    }
    addAccount(userId, accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.Utils.isGuid(userId)) {
                throw new Error("userId is required");
            }
            yield this.accountsState.update((accounts) => {
                accounts || (accounts = {});
                accounts[userId] = accountData;
                return accounts;
            });
            yield this.setAccountActivity(userId, new Date());
        });
    }
    setAccountName(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAccountInfo(userId, { name });
        });
    }
    setAccountEmail(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAccountInfo(userId, { email });
        });
    }
    setAccountEmailVerified(userId, emailVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAccountInfo(userId, { emailVerified });
        });
    }
    clean(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setAccountInfo(userId, LOGGED_OUT_INFO);
            yield this.removeAccountActivity(userId);
        });
    }
    switchAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateActivity = false;
            yield this.activeAccountIdState.update((_, accounts) => {
                if (userId == null) {
                    // indicates no account is active
                    return null;
                }
                if ((accounts === null || accounts === void 0 ? void 0 : accounts[userId]) == null) {
                    throw new Error("Account does not exist");
                }
                updateActivity = true;
                return userId;
            }, {
                combineLatestWith: this.accounts$,
                shouldUpdate: (id) => {
                    // update only if userId changes
                    return id !== userId;
                },
            });
            if (updateActivity) {
                yield this.setAccountActivity(userId, new Date());
            }
        });
    }
    setAccountActivity(userId, lastActivity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.Utils.isGuid(userId)) {
                // only store for valid userIds
                return;
            }
            yield this.globalStateProvider.get(exports.ACCOUNT_ACTIVITY).update((activity) => {
                activity || (activity = {});
                activity[userId] = lastActivity;
                return activity;
            }, {
                shouldUpdate: (oldActivity) => { var _a; return ((_a = oldActivity === null || oldActivity === void 0 ? void 0 : oldActivity[userId]) === null || _a === void 0 ? void 0 : _a.getTime()) !== (lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.getTime()); },
            });
        });
    }
    removeAccountActivity(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.globalStateProvider.get(exports.ACCOUNT_ACTIVITY).update((activity) => {
                if (activity == null) {
                    return activity;
                }
                delete activity[userId];
                return activity;
            }, { shouldUpdate: (oldActivity) => (oldActivity === null || oldActivity === void 0 ? void 0 : oldActivity[userId]) != null });
        });
    }
    // TODO: update to use our own account status settings. Requires inverting direction of state service accounts flow
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                (_a = this.messagingService) === null || _a === void 0 ? void 0 : _a.send("logout");
            }
            catch (e) {
                this.logService.error(e);
                throw e;
            }
        });
    }
    setAccountInfo(userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            function newAccountInfo(oldAccountInfo) {
                return Object.assign(Object.assign({}, oldAccountInfo), update);
            }
            yield this.accountsState.update((accounts) => {
                accounts[userId] = newAccountInfo(accounts[userId]);
                return accounts;
            }, {
                // Avoid unnecessary updates
                // TODO: Faster comparison, maybe include a hash on the objects?
                shouldUpdate: (accounts) => {
                    if ((accounts === null || accounts === void 0 ? void 0 : accounts[userId]) == null) {
                        throw new Error("Account does not exist");
                    }
                    return !(0, account_service_1.accountInfoEqual)(accounts[userId], newAccountInfo(accounts[userId]));
                },
            });
        });
    }
}
exports.AccountServiceImplementation = AccountServiceImplementation;
//# sourceMappingURL=account.service.js.map