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
exports.PolicyMigrator = void 0;
const migrator_1 = require("../migrator");
var PolicyType;
(function (PolicyType) {
    PolicyType[PolicyType["TwoFactorAuthentication"] = 0] = "TwoFactorAuthentication";
    PolicyType[PolicyType["MasterPassword"] = 1] = "MasterPassword";
    PolicyType[PolicyType["PasswordGenerator"] = 2] = "PasswordGenerator";
    PolicyType[PolicyType["SingleOrg"] = 3] = "SingleOrg";
    PolicyType[PolicyType["RequireSso"] = 4] = "RequireSso";
    PolicyType[PolicyType["PersonalOwnership"] = 5] = "PersonalOwnership";
    PolicyType[PolicyType["DisableSend"] = 6] = "DisableSend";
    PolicyType[PolicyType["SendOptions"] = 7] = "SendOptions";
    PolicyType[PolicyType["ResetPassword"] = 8] = "ResetPassword";
    PolicyType[PolicyType["MaximumVaultTimeout"] = 9] = "MaximumVaultTimeout";
    PolicyType[PolicyType["DisablePersonalVaultExport"] = 10] = "DisablePersonalVaultExport";
    PolicyType[PolicyType["ActivateAutofill"] = 11] = "ActivateAutofill";
})(PolicyType || (PolicyType = {}));
const POLICIES_KEY = {
    key: "policies",
    stateDefinition: {
        name: "policies",
    },
};
class PolicyMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const value = (_b = (_a = account === null || account === void 0 ? void 0 : account.data) === null || _a === void 0 ? void 0 : _a.policies) === null || _b === void 0 ? void 0 : _b.encrypted;
                    if (value != null) {
                        yield helper.setToUser(userId, POLICIES_KEY, value);
                        delete account.data.policies;
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all(accounts.map(({ userId, account }) => migrateAccount(userId, account)));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const value = yield helper.getFromUser(userId, POLICIES_KEY);
                    if (account) {
                        account.data = Object.assign((_a = account.data) !== null && _a !== void 0 ? _a : {}, {
                            policies: {
                                encrypted: value,
                            },
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, POLICIES_KEY, null);
                });
            }
            yield Promise.all(accounts.map(({ userId, account }) => rollbackAccount(userId, account)));
        });
    }
}
exports.PolicyMigrator = PolicyMigrator;
//# sourceMappingURL=30-move-policy-state-to-state-provider.js.map