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
exports.MoveBillingAccountProfileMigrator = exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION = void 0;
const migrator_1 = require("../migrator");
exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION = {
    key: "accountProfile",
    stateDefinition: {
        name: "billing",
    },
};
class MoveBillingAccountProfileMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            const migrateAccount = (userId, account) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const hasPremiumPersonally = (_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.hasPremiumPersonally;
                const hasPremiumFromOrganization = (_b = account === null || account === void 0 ? void 0 : account.profile) === null || _b === void 0 ? void 0 : _b.hasPremiumFromOrganization;
                if (hasPremiumPersonally != null || hasPremiumFromOrganization != null) {
                    yield helper.setToUser(userId, exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION, {
                        hasPremiumPersonally: hasPremiumPersonally,
                        hasPremiumFromOrganization: hasPremiumFromOrganization,
                    });
                    (_c = account === null || account === void 0 ? void 0 : account.profile) === null || _c === void 0 ? true : delete _c.hasPremiumPersonally;
                    (_d = account === null || account === void 0 ? void 0 : account.profile) === null || _d === void 0 ? true : delete _d.hasPremiumFromOrganization;
                    yield helper.set(userId, account);
                }
            });
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            const rollbackAccount = (userId, account) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const value = yield helper.getFromUser(userId, exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION);
                if (account && value) {
                    account.profile = Object.assign((_a = account.profile) !== null && _a !== void 0 ? _a : {}, {
                        hasPremiumPersonally: value === null || value === void 0 ? void 0 : value.hasPremiumPersonally,
                        hasPremiumFromOrganization: value === null || value === void 0 ? void 0 : value.hasPremiumFromOrganization,
                    });
                    yield helper.set(userId, account);
                }
                yield helper.setToUser(userId, exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION, null);
            });
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.MoveBillingAccountProfileMigrator = MoveBillingAccountProfileMigrator;
//# sourceMappingURL=39-move-billing-account-profile-to-state-providers.js.map