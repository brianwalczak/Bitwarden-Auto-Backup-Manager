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
exports.MoveMasterKeyStateToProviderMigrator = exports.MASTER_KEY_ENCRYPTED_USER_KEY_DEFINITION = exports.MASTER_KEY_HASH_DEFINITION = exports.FORCE_SET_PASSWORD_REASON_DEFINITION = void 0;
const migrator_1 = require("../migrator");
exports.FORCE_SET_PASSWORD_REASON_DEFINITION = {
    key: "forceSetPasswordReason",
    stateDefinition: {
        name: "masterPassword",
    },
};
exports.MASTER_KEY_HASH_DEFINITION = {
    key: "masterKeyHash",
    stateDefinition: {
        name: "masterPassword",
    },
};
exports.MASTER_KEY_ENCRYPTED_USER_KEY_DEFINITION = {
    key: "masterKeyEncryptedUserKey",
    stateDefinition: {
        name: "masterPassword",
    },
};
class MoveMasterKeyStateToProviderMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    const forceSetPasswordReason = (_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.forceSetPasswordReason;
                    if (forceSetPasswordReason != null) {
                        yield helper.setToUser(userId, exports.FORCE_SET_PASSWORD_REASON_DEFINITION, forceSetPasswordReason);
                        delete account.profile.forceSetPasswordReason;
                        yield helper.set(userId, account);
                    }
                    const masterKeyHash = (_b = account === null || account === void 0 ? void 0 : account.profile) === null || _b === void 0 ? void 0 : _b.keyHash;
                    if (masterKeyHash != null) {
                        yield helper.setToUser(userId, exports.MASTER_KEY_HASH_DEFINITION, masterKeyHash);
                        delete account.profile.keyHash;
                        yield helper.set(userId, account);
                    }
                    const masterKeyEncryptedUserKey = (_c = account === null || account === void 0 ? void 0 : account.keys) === null || _c === void 0 ? void 0 : _c.masterKeyEncryptedUserKey;
                    if (masterKeyEncryptedUserKey != null) {
                        yield helper.setToUser(userId, exports.MASTER_KEY_ENCRYPTED_USER_KEY_DEFINITION, masterKeyEncryptedUserKey);
                        delete account.keys.masterKeyEncryptedUserKey;
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
                    var _a, _b, _c;
                    const forceSetPasswordReason = yield helper.getFromUser(userId, exports.FORCE_SET_PASSWORD_REASON_DEFINITION);
                    const masterKeyHash = yield helper.getFromUser(userId, exports.MASTER_KEY_HASH_DEFINITION);
                    const masterKeyEncryptedUserKey = yield helper.getFromUser(userId, exports.MASTER_KEY_ENCRYPTED_USER_KEY_DEFINITION);
                    if (account != null) {
                        if (forceSetPasswordReason != null) {
                            account.profile = Object.assign((_a = account.profile) !== null && _a !== void 0 ? _a : {}, {
                                forceSetPasswordReason,
                            });
                        }
                        if (masterKeyHash != null) {
                            account.profile = Object.assign((_b = account.profile) !== null && _b !== void 0 ? _b : {}, {
                                keyHash: masterKeyHash,
                            });
                        }
                        if (masterKeyEncryptedUserKey != null) {
                            account.keys = Object.assign((_c = account.keys) !== null && _c !== void 0 ? _c : {}, {
                                masterKeyEncryptedUserKey,
                            });
                        }
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, exports.FORCE_SET_PASSWORD_REASON_DEFINITION, null);
                    yield helper.setToUser(userId, exports.MASTER_KEY_HASH_DEFINITION, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.MoveMasterKeyStateToProviderMigrator = MoveMasterKeyStateToProviderMigrator;
//# sourceMappingURL=55-move-master-key-state-to-provider.js.map