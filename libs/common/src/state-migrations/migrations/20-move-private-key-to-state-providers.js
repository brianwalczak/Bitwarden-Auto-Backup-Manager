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
exports.PrivateKeyMigrator = void 0;
const migrator_1 = require("../migrator");
const USER_ENCRYPTED_PRIVATE_KEY = {
    key: "privateKey",
    stateDefinition: {
        name: "crypto",
    },
};
class PrivateKeyMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const value = (_b = (_a = account === null || account === void 0 ? void 0 : account.keys) === null || _a === void 0 ? void 0 : _a.privateKey) === null || _b === void 0 ? void 0 : _b.encrypted;
                    if (value != null) {
                        yield helper.setToUser(userId, USER_ENCRYPTED_PRIVATE_KEY, value);
                        delete account.keys.privateKey;
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
                    const value = yield helper.getFromUser(userId, USER_ENCRYPTED_PRIVATE_KEY);
                    if (account && value) {
                        account.keys = Object.assign((_a = account.keys) !== null && _a !== void 0 ? _a : {}, {
                            privateKey: {
                                encrypted: value,
                            },
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, USER_ENCRYPTED_PRIVATE_KEY, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.PrivateKeyMigrator = PrivateKeyMigrator;
//# sourceMappingURL=20-move-private-key-to-state-providers.js.map