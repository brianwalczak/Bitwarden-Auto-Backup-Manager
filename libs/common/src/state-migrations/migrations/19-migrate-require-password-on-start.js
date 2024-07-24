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
exports.RequirePasswordOnStartMigrator = exports.REQUIRE_PASSWORD_ON_START = void 0;
const migrator_1 = require("../migrator");
// Biometric text, no auto prompt text, fingerprint validated, and prompt cancelled are refreshed on every app start, so we don't need to migrate them
exports.REQUIRE_PASSWORD_ON_START = {
    key: "requirePasswordOnStart",
    stateDefinition: { name: "biometricSettings" },
};
class RequirePasswordOnStartMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyAccounts = yield helper.getAccounts();
            yield Promise.all(legacyAccounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b;
                // Move account data
                if (((_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.requirePasswordOnStart) != null) {
                    yield helper.setToUser(userId, exports.REQUIRE_PASSWORD_ON_START, account.settings.requirePasswordOnStart);
                    // Delete old account data
                    delete account.settings.requirePasswordOnStart;
                    yield helper.set(userId, account);
                }
            })));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            function rollbackUser(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const requirePassword = yield helper.getFromUser(userId, exports.REQUIRE_PASSWORD_ON_START);
                    if (requirePassword) {
                        account !== null && account !== void 0 ? account : (account = {});
                        (_a = account.settings) !== null && _a !== void 0 ? _a : (account.settings = {});
                        account.settings.requirePasswordOnStart = requirePassword;
                        yield helper.setToUser(userId, exports.REQUIRE_PASSWORD_ON_START, null);
                        yield helper.set(userId, account);
                    }
                });
            }
            const accounts = yield helper.getAccounts();
            yield Promise.all(accounts.map(({ userId, account }) => rollbackUser(userId, account)));
        });
    }
}
exports.RequirePasswordOnStartMigrator = RequirePasswordOnStartMigrator;
//# sourceMappingURL=19-migrate-require-password-on-start.js.map