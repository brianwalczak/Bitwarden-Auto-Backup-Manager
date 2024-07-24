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
exports.DeviceTrustServiceStateProviderMigrator = exports.SHOULD_TRUST_DEVICE = exports.DEVICE_KEY = void 0;
const migrator_1 = require("../migrator");
exports.DEVICE_KEY = {
    key: "deviceKey", // matches KeyDefinition.key in DeviceTrustService
    stateDefinition: {
        name: "deviceTrust", // matches StateDefinition.name in StateDefinitions
    },
};
exports.SHOULD_TRUST_DEVICE = {
    key: "shouldTrustDevice",
    stateDefinition: {
        name: "deviceTrust",
    },
};
class DeviceTrustServiceStateProviderMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    let updatedAccount = false;
                    // Migrate deviceKey
                    const existingDeviceKey = (_a = account === null || account === void 0 ? void 0 : account.keys) === null || _a === void 0 ? void 0 : _a.deviceKey;
                    if (existingDeviceKey != null) {
                        // Only migrate data that exists
                        yield helper.setToUser(userId, exports.DEVICE_KEY, existingDeviceKey);
                        delete account.keys.deviceKey;
                        updatedAccount = true;
                    }
                    // Migrate shouldTrustDevice
                    const existingShouldTrustDevice = (_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.trustDeviceChoiceForDecryption;
                    if (existingShouldTrustDevice != null) {
                        yield helper.setToUser(userId, exports.SHOULD_TRUST_DEVICE, existingShouldTrustDevice);
                        delete account.settings.trustDeviceChoiceForDecryption;
                        updatedAccount = true;
                    }
                    if (updatedAccount) {
                        // Save the migrated account
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
                    // Rollback deviceKey
                    const migratedDeviceKey = yield helper.getFromUser(userId, exports.DEVICE_KEY);
                    if ((account === null || account === void 0 ? void 0 : account.keys) && migratedDeviceKey != null) {
                        account.keys.deviceKey = migratedDeviceKey;
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, exports.DEVICE_KEY, null);
                    // Rollback shouldTrustDevice
                    const migratedShouldTrustDevice = yield helper.getFromUser(userId, exports.SHOULD_TRUST_DEVICE);
                    if ((account === null || account === void 0 ? void 0 : account.settings) && migratedShouldTrustDevice != null) {
                        account.settings.trustDeviceChoiceForDecryption = migratedShouldTrustDevice;
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, exports.SHOULD_TRUST_DEVICE, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.DeviceTrustServiceStateProviderMigrator = DeviceTrustServiceStateProviderMigrator;
//# sourceMappingURL=53-migrate-device-trust-svc-to-state-providers.js.map