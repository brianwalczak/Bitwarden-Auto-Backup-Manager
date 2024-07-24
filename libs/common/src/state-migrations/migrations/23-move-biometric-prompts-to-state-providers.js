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
exports.MoveBiometricPromptsToStateProviders = exports.PROMPT_AUTOMATICALLY = exports.DISMISSED_BIOMETRIC_REQUIRE_PASSWORD_ON_START_CALLOUT = void 0;
const migrator_1 = require("../migrator");
// prompt cancelled is refreshed on every app start/quit/unlock, so we don't need to migrate it
exports.DISMISSED_BIOMETRIC_REQUIRE_PASSWORD_ON_START_CALLOUT = {
    key: "dismissedBiometricRequirePasswordOnStartCallout",
    stateDefinition: { name: "biometricSettings" },
};
exports.PROMPT_AUTOMATICALLY = {
    key: "promptAutomatically",
    stateDefinition: { name: "biometricSettings" },
};
class MoveBiometricPromptsToStateProviders extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyAccounts = yield helper.getAccounts();
            yield Promise.all(legacyAccounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b, _c, _d, _e;
                if (account == null) {
                    return;
                }
                // Move account data
                if (((_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.dismissedBiometricRequirePasswordOnStartCallout) != null) {
                    yield helper.setToUser(userId, exports.DISMISSED_BIOMETRIC_REQUIRE_PASSWORD_ON_START_CALLOUT, account.settings.dismissedBiometricRequirePasswordOnStartCallout);
                }
                if (((_c = account === null || account === void 0 ? void 0 : account.settings) === null || _c === void 0 ? void 0 : _c.disableAutoBiometricsPrompt) != null) {
                    yield helper.setToUser(userId, exports.PROMPT_AUTOMATICALLY, !account.settings.disableAutoBiometricsPrompt);
                }
                // Delete old account data
                (_d = account === null || account === void 0 ? void 0 : account.settings) === null || _d === void 0 ? true : delete _d.dismissedBiometricRequirePasswordOnStartCallout;
                (_e = account === null || account === void 0 ? void 0 : account.settings) === null || _e === void 0 ? true : delete _e.disableAutoBiometricsPrompt;
                yield helper.set(userId, account);
            })));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            function rollbackUser(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    let updatedAccount = false;
                    const userDismissed = yield helper.getFromUser(userId, exports.DISMISSED_BIOMETRIC_REQUIRE_PASSWORD_ON_START_CALLOUT);
                    if (userDismissed) {
                        account !== null && account !== void 0 ? account : (account = {});
                        (_a = account.settings) !== null && _a !== void 0 ? _a : (account.settings = {});
                        updatedAccount = true;
                        account.settings.dismissedBiometricRequirePasswordOnStartCallout = userDismissed;
                        yield helper.setToUser(userId, exports.DISMISSED_BIOMETRIC_REQUIRE_PASSWORD_ON_START_CALLOUT, null);
                    }
                    const userPromptAutomatically = yield helper.getFromUser(userId, exports.PROMPT_AUTOMATICALLY);
                    if (userPromptAutomatically != null) {
                        account !== null && account !== void 0 ? account : (account = {});
                        (_b = account.settings) !== null && _b !== void 0 ? _b : (account.settings = {});
                        updatedAccount = true;
                        account.settings.disableAutoBiometricsPrompt = !userPromptAutomatically;
                        yield helper.setToUser(userId, exports.PROMPT_AUTOMATICALLY, null);
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
exports.MoveBiometricPromptsToStateProviders = MoveBiometricPromptsToStateProviders;
//# sourceMappingURL=23-move-biometric-prompts-to-state-providers.js.map