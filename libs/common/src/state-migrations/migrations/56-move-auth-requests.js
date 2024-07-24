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
exports.AuthRequestMigrator = void 0;
const migrator_1 = require("../migrator");
const ADMIN_AUTH_REQUEST_KEY = {
    stateDefinition: {
        name: "authRequestLocal",
    },
    key: "adminAuthRequest",
};
const ACCEPT_AUTH_REQUESTS_KEY = {
    stateDefinition: {
        name: "authRequestLocal",
    },
    key: "acceptAuthRequests",
};
class AuthRequestMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let updatedAccount = false;
                    // Migrate admin auth request
                    const existingAdminAuthRequest = account === null || account === void 0 ? void 0 : account.adminAuthRequest;
                    if (existingAdminAuthRequest != null) {
                        yield helper.setToUser(userId, ADMIN_AUTH_REQUEST_KEY, existingAdminAuthRequest);
                        delete account.adminAuthRequest;
                        updatedAccount = true;
                    }
                    // Migrate approve login requests
                    const existingApproveLoginRequests = (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.approveLoginRequests;
                    if (existingApproveLoginRequests != null) {
                        yield helper.setToUser(userId, ACCEPT_AUTH_REQUESTS_KEY, existingApproveLoginRequests);
                        delete account.settings.approveLoginRequests;
                        updatedAccount = true;
                    }
                    if (updatedAccount) {
                        // Save the migrated account
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let updatedAccount = false;
                    // Rollback admin auth request
                    const migratedAdminAuthRequest = yield helper.getFromUser(userId, ADMIN_AUTH_REQUEST_KEY);
                    if (migratedAdminAuthRequest != null) {
                        account.adminAuthRequest = migratedAdminAuthRequest;
                        updatedAccount = true;
                    }
                    yield helper.setToUser(userId, ADMIN_AUTH_REQUEST_KEY, null);
                    // Rollback approve login requests
                    const migratedAcceptAuthRequest = yield helper.getFromUser(userId, ACCEPT_AUTH_REQUESTS_KEY);
                    if (migratedAcceptAuthRequest != null) {
                        account.settings = Object.assign((_a = account.settings) !== null && _a !== void 0 ? _a : {}, {
                            approveLoginRequests: migratedAcceptAuthRequest,
                        });
                        updatedAccount = true;
                    }
                    yield helper.setToUser(userId, ACCEPT_AUTH_REQUESTS_KEY, null);
                    if (updatedAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.AuthRequestMigrator = AuthRequestMigrator;
//# sourceMappingURL=56-move-auth-requests.js.map