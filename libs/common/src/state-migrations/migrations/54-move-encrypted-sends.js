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
exports.SendMigrator = exports.SendType = void 0;
const migrator_1 = require("../migrator");
var SendType;
(function (SendType) {
    SendType[SendType["Text"] = 0] = "Text";
    SendType[SendType["File"] = 1] = "File";
})(SendType || (exports.SendType = SendType = {}));
const ENCRYPTED_SENDS = {
    stateDefinition: {
        name: "send",
    },
    key: "sends",
};
/**
 * Only encrypted sends are stored on disk. Only the encrypted items need to be
 * migrated from the previous sends state data.
 */
class SendMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const value = (_b = (_a = account === null || account === void 0 ? void 0 : account.data) === null || _a === void 0 ? void 0 : _a.sends) === null || _b === void 0 ? void 0 : _b.encrypted;
                    if (value != null) {
                        yield helper.setToUser(userId, ENCRYPTED_SENDS, value);
                        delete account.data.sends;
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
                    const value = yield helper.getFromUser(userId, ENCRYPTED_SENDS);
                    if (account) {
                        account.data = Object.assign((_a = account.data) !== null && _a !== void 0 ? _a : {}, {
                            sends: {
                                encrypted: value,
                            },
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, ENCRYPTED_SENDS, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.SendMigrator = SendMigrator;
//# sourceMappingURL=54-move-encrypted-sends.js.map