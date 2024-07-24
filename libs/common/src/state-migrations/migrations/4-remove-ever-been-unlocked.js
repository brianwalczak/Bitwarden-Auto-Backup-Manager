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
exports.RemoveEverBeenUnlockedMigrator = void 0;
const migrator_1 = require("../migrator");
class RemoveEverBeenUnlockedMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function removeEverBeenUnlocked(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (((_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.everBeenUnlocked) != null) {
                        delete account.profile.everBeenUnlocked;
                        return helper.set(userId, account);
                    }
                });
            }
            // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all(accounts.map(({ userId, account }) => removeEverBeenUnlocked(userId, account)));
        });
    }
    rollback(helper) {
        throw migrator_1.IRREVERSIBLE;
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
exports.RemoveEverBeenUnlockedMigrator = RemoveEverBeenUnlockedMigrator;
//# sourceMappingURL=4-remove-ever-been-unlocked.js.map