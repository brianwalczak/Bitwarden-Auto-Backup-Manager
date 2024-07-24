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
exports.MoveBiometricUnlockToStateProviders = exports.BIOMETRIC_UNLOCK_ENABLED = void 0;
const migrator_1 = require("../migrator");
exports.BIOMETRIC_UNLOCK_ENABLED = {
    key: "biometricUnlockEnabled",
    stateDefinition: { name: "biometricSettings" },
};
class MoveBiometricUnlockToStateProviders extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyAccounts = yield helper.getAccounts();
            yield Promise.all(legacyAccounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b, _c;
                if (account == null) {
                    return;
                }
                // Move account data
                if (((_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.biometricUnlock) != null) {
                    yield helper.setToUser(userId, exports.BIOMETRIC_UNLOCK_ENABLED, account.settings.biometricUnlock);
                }
                // Delete old account data
                (_c = account === null || account === void 0 ? void 0 : account.settings) === null || _c === void 0 ? true : delete _c.biometricUnlock;
                yield helper.set(userId, account);
            })));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            function rollbackUser(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const biometricUnlock = yield helper.getFromUser(userId, exports.BIOMETRIC_UNLOCK_ENABLED);
                    if (biometricUnlock != null) {
                        account !== null && account !== void 0 ? account : (account = {});
                        (_a = account.settings) !== null && _a !== void 0 ? _a : (account.settings = {});
                        account.settings.biometricUnlock = biometricUnlock;
                        yield helper.setToUser(userId, exports.BIOMETRIC_UNLOCK_ENABLED, null);
                        yield helper.set(userId, account);
                    }
                });
            }
            const accounts = yield helper.getAccounts();
            yield Promise.all(accounts.map(({ userId, account }) => rollbackUser(userId, account)));
        });
    }
}
exports.MoveBiometricUnlockToStateProviders = MoveBiometricUnlockToStateProviders;
//# sourceMappingURL=28-move-biometric-unlock-to-state-providers.js.map