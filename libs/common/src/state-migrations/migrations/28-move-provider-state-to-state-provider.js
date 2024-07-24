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
exports.ProviderMigrator = void 0;
const migrator_1 = require("../migrator");
var ProviderUserStatusType;
(function (ProviderUserStatusType) {
    ProviderUserStatusType[ProviderUserStatusType["Invited"] = 0] = "Invited";
    ProviderUserStatusType[ProviderUserStatusType["Accepted"] = 1] = "Accepted";
    ProviderUserStatusType[ProviderUserStatusType["Confirmed"] = 2] = "Confirmed";
    ProviderUserStatusType[ProviderUserStatusType["Revoked"] = -1] = "Revoked";
})(ProviderUserStatusType || (ProviderUserStatusType = {}));
var ProviderUserType;
(function (ProviderUserType) {
    ProviderUserType[ProviderUserType["ProviderAdmin"] = 0] = "ProviderAdmin";
    ProviderUserType[ProviderUserType["ServiceUser"] = 1] = "ServiceUser";
})(ProviderUserType || (ProviderUserType = {}));
const USER_PROVIDERS = {
    key: "providers",
    stateDefinition: {
        name: "providers",
    },
};
class ProviderMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const value = (_a = account === null || account === void 0 ? void 0 : account.data) === null || _a === void 0 ? void 0 : _a.providers;
                    if (value != null) {
                        yield helper.setToUser(userId, USER_PROVIDERS, value);
                        delete account.data.providers;
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
                    const value = yield helper.getFromUser(userId, USER_PROVIDERS);
                    if (account) {
                        account.data = Object.assign((_a = account.data) !== null && _a !== void 0 ? _a : {}, {
                            providers: value,
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, USER_PROVIDERS, null);
                });
            }
            yield Promise.all(accounts.map(({ userId, account }) => rollbackAccount(userId, account)));
        });
    }
}
exports.ProviderMigrator = ProviderMigrator;
//# sourceMappingURL=28-move-provider-state-to-state-provider.js.map