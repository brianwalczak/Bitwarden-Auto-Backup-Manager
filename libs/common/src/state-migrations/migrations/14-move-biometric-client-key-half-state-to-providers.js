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
exports.MoveBiometricClientKeyHalfToStateProviders = exports.CLIENT_KEY_HALF = void 0;
const migrator_1 = require("../migrator");
// Biometric text, no auto prompt text, fingerprint validated, and prompt cancelled are refreshed on every app start, so we don't need to migrate them
exports.CLIENT_KEY_HALF = {
    key: "clientKeyHalf",
    stateDefinition: { name: "biometricSettings" },
};
class MoveBiometricClientKeyHalfToStateProviders extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyAccounts = yield helper.getAccounts();
            yield Promise.all(legacyAccounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b, _c;
                // Move account data
                if (((_b = account === null || account === void 0 ? void 0 : account.keys) === null || _b === void 0 ? void 0 : _b.biometricEncryptionClientKeyHalf) != null) {
                    yield helper.setToUser(userId, exports.CLIENT_KEY_HALF, account.keys.biometricEncryptionClientKeyHalf);
                    // Delete old account data
                    (_c = account === null || account === void 0 ? void 0 : account.keys) === null || _c === void 0 ? true : delete _c.biometricEncryptionClientKeyHalf;
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
                    let updatedAccount = false;
                    const userKeyHalf = yield helper.getFromUser(userId, exports.CLIENT_KEY_HALF);
                    if (userKeyHalf) {
                        account !== null && account !== void 0 ? account : (account = {});
                        (_a = account.keys) !== null && _a !== void 0 ? _a : (account.keys = {});
                        updatedAccount = true;
                        account.keys.biometricEncryptionClientKeyHalf = userKeyHalf;
                        yield helper.setToUser(userId, exports.CLIENT_KEY_HALF, null);
                    }
                    if (updatedAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
            const accounts = yield helper.getAccounts();
            yield Promise.all(accounts.map(({ userId, account }) => rollbackUser(userId, account)));
        });
    }
}
exports.MoveBiometricClientKeyHalfToStateProviders = MoveBiometricClientKeyHalfToStateProviders;
//# sourceMappingURL=14-move-biometric-client-key-half-state-to-providers.js.map