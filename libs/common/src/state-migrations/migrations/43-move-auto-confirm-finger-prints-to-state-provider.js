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
exports.AutoConfirmFingerPrintsMigrator = void 0;
const migrator_1 = require("../migrator");
const ORGANIZATION_MANAGEMENT_PREFERENCES = {
    name: "organizationManagementPreferences",
};
const AUTO_CONFIRM_FINGERPRINTS = {
    key: "autoConfirmFingerPrints",
    stateDefinition: ORGANIZATION_MANAGEMENT_PREFERENCES,
};
class AutoConfirmFingerPrintsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyAccounts = yield helper.getAccounts();
            yield Promise.all(legacyAccounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b, _c;
                if (((_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.autoConfirmFingerPrints) != null) {
                    yield helper.setToUser(userId, AUTO_CONFIRM_FINGERPRINTS, account.settings.autoConfirmFingerPrints);
                    (_c = account === null || account === void 0 ? void 0 : account.settings) === null || _c === void 0 ? true : delete _c.autoConfirmFingerPrints;
                    yield helper.set(userId, account);
                }
            })));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            function rollbackUser(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updatedAccount = false;
                    const autoConfirmFingerPrints = yield helper.getFromUser(userId, AUTO_CONFIRM_FINGERPRINTS);
                    if (autoConfirmFingerPrints) {
                        if (!account) {
                            account = {};
                        }
                        updatedAccount = true;
                        account.settings.autoConfirmFingerPrints = autoConfirmFingerPrints;
                        yield helper.setToUser(userId, AUTO_CONFIRM_FINGERPRINTS, null);
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
exports.AutoConfirmFingerPrintsMigrator = AutoConfirmFingerPrintsMigrator;
//# sourceMappingURL=43-move-auto-confirm-finger-prints-to-state-provider.js.map