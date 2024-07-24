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
exports.MoveBiometricAutoPromptToAccount = void 0;
const migrator_1 = require("../migrator");
class MoveBiometricAutoPromptToAccount extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const global = yield helper.get("global");
            const noAutoPromptBiometrics = (_a = global === null || global === void 0 ? void 0 : global.noAutoPromptBiometrics) !== null && _a !== void 0 ? _a : false;
            const accounts = yield helper.getAccounts();
            function updateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (account == null) {
                        return;
                    }
                    if (noAutoPromptBiometrics) {
                        account.settings = Object.assign((_a = account === null || account === void 0 ? void 0 : account.settings) !== null && _a !== void 0 ? _a : {}, {
                            disableAutoBiometricsPrompt: true,
                        });
                        yield helper.set(userId, account);
                    }
                });
            }
            delete global.noAutoPromptBiometrics;
            yield Promise.all([
                ...accounts.map(({ userId, account }) => updateAccount(userId, account)),
                helper.set("global", global),
            ]);
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
exports.MoveBiometricAutoPromptToAccount = MoveBiometricAutoPromptToAccount;
//# sourceMappingURL=7-move-biometric-auto-prompt-to-account.js.map