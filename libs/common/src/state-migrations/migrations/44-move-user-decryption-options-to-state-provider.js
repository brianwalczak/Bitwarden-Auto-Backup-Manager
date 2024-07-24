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
exports.UserDecryptionOptionsMigrator = void 0;
const migrator_1 = require("../migrator");
const USER_DECRYPTION_OPTIONS = {
    key: "decryptionOptions",
    stateDefinition: {
        name: "userDecryptionOptions",
    },
};
class UserDecryptionOptionsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    const value = account === null || account === void 0 ? void 0 : account.decryptionOptions;
                    if (value != null) {
                        yield helper.setToUser(userId, USER_DECRYPTION_OPTIONS, value);
                        delete account.decryptionOptions;
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
                    const value = yield helper.getFromUser(userId, USER_DECRYPTION_OPTIONS);
                    if (account) {
                        account.decryptionOptions = Object.assign(account.decryptionOptions, value);
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, USER_DECRYPTION_OPTIONS, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.UserDecryptionOptionsMigrator = UserDecryptionOptionsMigrator;
//# sourceMappingURL=44-move-user-decryption-options-to-state-provider.js.map