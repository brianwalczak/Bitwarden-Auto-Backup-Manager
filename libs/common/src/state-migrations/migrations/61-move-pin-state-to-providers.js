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
exports.PinStateMigrator = exports.OLD_PIN_KEY_ENCRYPTED_MASTER_KEY = exports.USER_KEY_ENCRYPTED_PIN = exports.PIN_KEY_ENCRYPTED_USER_KEY_PERSISTENT = exports.PIN_STATE = void 0;
const migrator_1 = require("../migrator");
exports.PIN_STATE = { name: "pinUnlock" };
exports.PIN_KEY_ENCRYPTED_USER_KEY_PERSISTENT = {
    stateDefinition: exports.PIN_STATE,
    key: "pinKeyEncryptedUserKeyPersistent",
};
exports.USER_KEY_ENCRYPTED_PIN = {
    stateDefinition: exports.PIN_STATE,
    key: "userKeyEncryptedPin",
};
exports.OLD_PIN_KEY_ENCRYPTED_MASTER_KEY = {
    stateDefinition: exports.PIN_STATE,
    key: "oldPinKeyEncryptedMasterKey",
};
class PinStateMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyAccounts = yield helper.getAccounts();
            let updatedAccount = false;
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    // Migrate pinKeyEncryptedUserKey (to `pinKeyEncryptedUserKeyPersistent`)
                    if (((_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.pinKeyEncryptedUserKey) != null) {
                        yield helper.setToUser(userId, exports.PIN_KEY_ENCRYPTED_USER_KEY_PERSISTENT, account.settings.pinKeyEncryptedUserKey);
                        delete account.settings.pinKeyEncryptedUserKey;
                        updatedAccount = true;
                    }
                    // Migrate protectedPin (to `userKeyEncryptedPin`)
                    if (((_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.protectedPin) != null) {
                        yield helper.setToUser(userId, exports.USER_KEY_ENCRYPTED_PIN, account.settings.protectedPin);
                        delete account.settings.protectedPin;
                        updatedAccount = true;
                    }
                    // Migrate pinProtected (to `oldPinKeyEncryptedMasterKey`)
                    if (((_d = (_c = account === null || account === void 0 ? void 0 : account.settings) === null || _c === void 0 ? void 0 : _c.pinProtected) === null || _d === void 0 ? void 0 : _d.encrypted) != null) {
                        yield helper.setToUser(userId, exports.OLD_PIN_KEY_ENCRYPTED_MASTER_KEY, account.settings.pinProtected.encrypted);
                        delete account.settings.pinProtected;
                        updatedAccount = true;
                    }
                    if (updatedAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all([
                ...legacyAccounts.map(({ userId, account }) => migrateAccount(userId, account)),
            ]);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let updatedAccount = false;
                    const accountPinKeyEncryptedUserKeyPersistent = yield helper.getFromUser(userId, exports.PIN_KEY_ENCRYPTED_USER_KEY_PERSISTENT);
                    const accountUserKeyEncryptedPin = yield helper.getFromUser(userId, exports.USER_KEY_ENCRYPTED_PIN);
                    const accountOldPinKeyEncryptedMasterKey = yield helper.getFromUser(userId, exports.OLD_PIN_KEY_ENCRYPTED_MASTER_KEY);
                    if (!account) {
                        account = {};
                    }
                    if (accountPinKeyEncryptedUserKeyPersistent != null) {
                        account.settings.pinKeyEncryptedUserKey = accountPinKeyEncryptedUserKeyPersistent;
                        yield helper.setToUser(userId, exports.PIN_KEY_ENCRYPTED_USER_KEY_PERSISTENT, null);
                        updatedAccount = true;
                    }
                    if (accountUserKeyEncryptedPin != null) {
                        account.settings.protectedPin = accountUserKeyEncryptedPin;
                        yield helper.setToUser(userId, exports.USER_KEY_ENCRYPTED_PIN, null);
                        updatedAccount = true;
                    }
                    if (accountOldPinKeyEncryptedMasterKey != null) {
                        account.settings = Object.assign((_a = account.settings) !== null && _a !== void 0 ? _a : {}, {
                            pinProtected: {
                                encrypted: accountOldPinKeyEncryptedMasterKey,
                            },
                        });
                        yield helper.setToUser(userId, exports.OLD_PIN_KEY_ENCRYPTED_MASTER_KEY, null);
                        updatedAccount = true;
                    }
                    if (updatedAccount) {
                        yield helper.set(userId, account);
                    }
                });
            }
            yield Promise.all(accounts.map(({ userId, account }) => rollbackAccount(userId, account)));
        });
    }
}
exports.PinStateMigrator = PinStateMigrator;
//# sourceMappingURL=61-move-pin-state-to-providers.js.map