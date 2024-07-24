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
exports.CipherServiceMigrator = exports.CIPHERS_DISK = exports.CIPHERS_DISK_LOCAL = void 0;
const migrator_1 = require("../migrator");
exports.CIPHERS_DISK_LOCAL = {
    key: "localData",
    stateDefinition: {
        name: "ciphersLocal",
    },
};
exports.CIPHERS_DISK = {
    key: "ciphers",
    stateDefinition: {
        name: "ciphers",
    },
};
class CipherServiceMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    let updatedAccount = false;
                    //Migrate localData
                    const localData = (_a = account === null || account === void 0 ? void 0 : account.data) === null || _a === void 0 ? void 0 : _a.localData;
                    if (localData != null) {
                        yield helper.setToUser(userId, exports.CIPHERS_DISK_LOCAL, localData);
                        delete account.data.localData;
                        updatedAccount = true;
                    }
                    //Migrate ciphers
                    const ciphers = (_c = (_b = account === null || account === void 0 ? void 0 : account.data) === null || _b === void 0 ? void 0 : _b.ciphers) === null || _c === void 0 ? void 0 : _c.encrypted;
                    if (ciphers != null) {
                        yield helper.setToUser(userId, exports.CIPHERS_DISK, ciphers);
                        delete account.data.ciphers;
                        updatedAccount = true;
                    }
                    if (updatedAccount) {
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
                    //rollback localData
                    const localData = yield helper.getFromUser(userId, exports.CIPHERS_DISK_LOCAL);
                    if (account.data && localData != null) {
                        account.data.localData = localData;
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, exports.CIPHERS_DISK_LOCAL, null);
                    //rollback ciphers
                    const ciphers = yield helper.getFromUser(userId, exports.CIPHERS_DISK);
                    if (account.data && ciphers != null) {
                        (_a = account.data).ciphers || (_a.ciphers = { encrypted: null });
                        account.data.ciphers.encrypted = ciphers;
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, exports.CIPHERS_DISK, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.CipherServiceMigrator = CipherServiceMigrator;
//# sourceMappingURL=57-move-cipher-service-to-state-provider.js.map