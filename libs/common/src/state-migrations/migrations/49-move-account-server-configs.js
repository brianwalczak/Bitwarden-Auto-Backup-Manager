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
exports.AccountServerConfigMigrator = exports.USER_SERVER_CONFIG = void 0;
const migrator_1 = require("../migrator");
const CONFIG_DISK = { name: "config" };
exports.USER_SERVER_CONFIG = {
    stateDefinition: CONFIG_DISK,
    key: "serverConfig",
};
class AccountServerConfigMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (((_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.serverConfig) != null) {
                        yield helper.setToUser(userId, exports.USER_SERVER_CONFIG, account.settings.serverConfig);
                        delete account.settings.serverConfig;
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
                    const serverConfig = yield helper.getFromUser(userId, exports.USER_SERVER_CONFIG);
                    if (serverConfig) {
                        account !== null && account !== void 0 ? account : (account = {});
                        (_a = account.settings) !== null && _a !== void 0 ? _a : (account.settings = {});
                        account.settings.serverConfig = serverConfig;
                        yield helper.setToUser(userId, exports.USER_SERVER_CONFIG, null);
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.AccountServerConfigMigrator = AccountServerConfigMigrator;
//# sourceMappingURL=49-move-account-server-configs.js.map