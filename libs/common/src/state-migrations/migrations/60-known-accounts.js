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
exports.KnownAccountsMigrator = exports.ACCOUNT_ACTIVITY = exports.ACCOUNT_ACTIVE_ACCOUNT_ID = exports.ACCOUNT_ACCOUNTS = void 0;
const migrator_1 = require("../migrator");
exports.ACCOUNT_ACCOUNTS = {
    stateDefinition: {
        name: "account",
    },
    key: "accounts",
};
exports.ACCOUNT_ACTIVE_ACCOUNT_ID = {
    stateDefinition: {
        name: "account",
    },
    key: "activeAccountId",
};
exports.ACCOUNT_ACTIVITY = {
    stateDefinition: {
        name: "account",
    },
    key: "activity",
};
class KnownAccountsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.migrateAuthenticatedAccounts(helper);
            yield this.migrateActiveAccountId(helper);
            yield this.migrateAccountActivity(helper);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // authenticated account are removed, but the accounts record also contains logged out accounts. Best we can do is to add them all back
            const userIds = (_a = (yield helper.getKnownUserIds())) !== null && _a !== void 0 ? _a : [];
            yield helper.set("authenticatedAccounts", userIds);
            yield helper.removeFromGlobal(exports.ACCOUNT_ACCOUNTS);
            // Active Account Id
            const activeAccountId = yield helper.getFromGlobal(exports.ACCOUNT_ACTIVE_ACCOUNT_ID);
            if (activeAccountId) {
                yield helper.set("activeUserId", activeAccountId);
            }
            yield helper.removeFromGlobal(exports.ACCOUNT_ACTIVE_ACCOUNT_ID);
            // Account Activity
            const accountActivity = yield helper.getFromGlobal(exports.ACCOUNT_ACTIVITY);
            if (accountActivity) {
                const toStore = Object.entries(accountActivity).reduce((agg, [userId, dateString]) => {
                    agg[userId] = new Date(dateString).getTime();
                    return agg;
                }, {});
                yield helper.set("accountActivity", toStore);
            }
            yield helper.removeFromGlobal(exports.ACCOUNT_ACTIVITY);
        });
    }
    migrateAuthenticatedAccounts(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const authenticatedAccounts = (_a = (yield helper.get("authenticatedAccounts"))) !== null && _a !== void 0 ? _a : [];
            const accounts = yield Promise.all(authenticatedAccounts.map((userId) => __awaiter(this, void 0, void 0, function* () {
                const account = yield helper.get(userId);
                return { userId, account };
            })));
            const accountsToStore = accounts.reduce((agg, { userId, account }) => {
                var _a, _b;
                if (account === null || account === void 0 ? void 0 : account.profile) {
                    agg[userId] = {
                        email: (_a = account.profile.email) !== null && _a !== void 0 ? _a : "",
                        emailVerified: (_b = account.profile.emailVerified) !== null && _b !== void 0 ? _b : false,
                        name: account.profile.name,
                    };
                }
                return agg;
            }, {});
            yield helper.setToGlobal(exports.ACCOUNT_ACCOUNTS, accountsToStore);
            yield helper.remove("authenticatedAccounts");
        });
    }
    migrateAccountActivity(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const stored = yield helper.get("accountActivity");
            const accountActivity = Object.entries(stored !== null && stored !== void 0 ? stored : {}).reduce((agg, [userId, dateMs]) => {
                agg[userId] = JSON.stringify(new Date(dateMs));
                return agg;
            }, {});
            yield helper.setToGlobal(exports.ACCOUNT_ACTIVITY, accountActivity);
            yield helper.remove("accountActivity");
        });
    }
    migrateActiveAccountId(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeAccountId = yield helper.get("activeUserId");
            yield helper.setToGlobal(exports.ACCOUNT_ACTIVE_ACCOUNT_ID, activeAccountId);
            yield helper.remove("activeUserId");
        });
    }
}
exports.KnownAccountsMigrator = KnownAccountsMigrator;
//# sourceMappingURL=60-known-accounts.js.map