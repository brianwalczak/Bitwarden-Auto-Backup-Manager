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
exports.OrganizationMigrator = void 0;
const migrator_1 = require("../migrator");
// Local declarations of `OrganizationData` and the types of it's properties.
// Duplicated to remain frozen in time when migration occurs.
var OrganizationUserStatusType;
(function (OrganizationUserStatusType) {
    OrganizationUserStatusType[OrganizationUserStatusType["Invited"] = 0] = "Invited";
    OrganizationUserStatusType[OrganizationUserStatusType["Accepted"] = 1] = "Accepted";
    OrganizationUserStatusType[OrganizationUserStatusType["Confirmed"] = 2] = "Confirmed";
    OrganizationUserStatusType[OrganizationUserStatusType["Revoked"] = -1] = "Revoked";
})(OrganizationUserStatusType || (OrganizationUserStatusType = {}));
var OrganizationUserType;
(function (OrganizationUserType) {
    OrganizationUserType[OrganizationUserType["Owner"] = 0] = "Owner";
    OrganizationUserType[OrganizationUserType["Admin"] = 1] = "Admin";
    OrganizationUserType[OrganizationUserType["User"] = 2] = "User";
    OrganizationUserType[OrganizationUserType["Manager"] = 3] = "Manager";
    OrganizationUserType[OrganizationUserType["Custom"] = 4] = "Custom";
})(OrganizationUserType || (OrganizationUserType = {}));
var ProviderType;
(function (ProviderType) {
    ProviderType[ProviderType["Msp"] = 0] = "Msp";
    ProviderType[ProviderType["Reseller"] = 1] = "Reseller";
})(ProviderType || (ProviderType = {}));
var ProductType;
(function (ProductType) {
    ProductType[ProductType["Free"] = 0] = "Free";
    ProductType[ProductType["Families"] = 1] = "Families";
    ProductType[ProductType["Teams"] = 2] = "Teams";
    ProductType[ProductType["Enterprise"] = 3] = "Enterprise";
    ProductType[ProductType["TeamsStarter"] = 4] = "TeamsStarter";
})(ProductType || (ProductType = {}));
const USER_ORGANIZATIONS = {
    key: "organizations",
    stateDefinition: {
        name: "organizations",
    },
};
class OrganizationMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const value = (_a = account === null || account === void 0 ? void 0 : account.data) === null || _a === void 0 ? void 0 : _a.organizations;
                    if (value != null) {
                        yield helper.setToUser(userId, USER_ORGANIZATIONS, value);
                        delete account.data.organizations;
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
                    const value = yield helper.getFromUser(userId, USER_ORGANIZATIONS);
                    if (account) {
                        account.data = Object.assign((_a = account.data) !== null && _a !== void 0 ? _a : {}, {
                            organizations: value,
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, USER_ORGANIZATIONS, null);
                });
            }
            yield Promise.all(accounts.map(({ userId, account }) => rollbackAccount(userId, account)));
        });
    }
}
exports.OrganizationMigrator = OrganizationMigrator;
//# sourceMappingURL=40-move-organization-state-to-state-provider.js.map