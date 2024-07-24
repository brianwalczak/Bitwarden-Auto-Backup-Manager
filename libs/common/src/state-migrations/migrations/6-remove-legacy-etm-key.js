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
exports.RemoveLegacyEtmKeyMigrator = void 0;
const migrator_1 = require("../migrator");
class RemoveLegacyEtmKeyMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function updateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if ((_a = account === null || account === void 0 ? void 0 : account.keys) === null || _a === void 0 ? void 0 : _a.legacyEtmKey) {
                        delete account.keys.legacyEtmKey;
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all(accounts.map(({ userId, account }) => updateAccount(userId, account)));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            throw migrator_1.IRREVERSIBLE;
        });
    }
    // Override is necessary because default implementation assumes `stateVersion` at the root, but for this version
    // it is nested inside a global object.
    updateVersion(helper, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const endVersion = direction === "up" ? this.toVersion : this.fromVersion;
            helper.currentVersion = endVersion;
            const global = (yield helper.get("global")) || {};
            yield helper.set("global", Object.assign(Object.assign({}, global), { stateVersion: endVersion }));
        });
    }
}
exports.RemoveLegacyEtmKeyMigrator = RemoveLegacyEtmKeyMigrator;
//# sourceMappingURL=6-remove-legacy-etm-key.js.map