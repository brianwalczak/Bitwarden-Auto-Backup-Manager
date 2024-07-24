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
exports.KeyConnectorMigrator = void 0;
const migrator_1 = require("../migrator");
const usesKeyConnectorKeyDefinition = {
    key: "usesKeyConnector",
    stateDefinition: {
        name: "keyConnector",
    },
};
const convertAccountToKeyConnectorKeyDefinition = {
    key: "convertAccountToKeyConnector",
    stateDefinition: {
        name: "keyConnector",
    },
};
class KeyConnectorMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const usesKeyConnector = (_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.usesKeyConnector;
                    const convertAccountToKeyConnector = (_b = account === null || account === void 0 ? void 0 : account.profile) === null || _b === void 0 ? void 0 : _b.convertAccountToKeyConnector;
                    if (usesKeyConnector == null && convertAccountToKeyConnector == null) {
                        return;
                    }
                    if (usesKeyConnector != null) {
                        yield helper.setToUser(userId, usesKeyConnectorKeyDefinition, usesKeyConnector);
                        delete account.profile.usesKeyConnector;
                    }
                    if (convertAccountToKeyConnector != null) {
                        yield helper.setToUser(userId, convertAccountToKeyConnectorKeyDefinition, convertAccountToKeyConnector);
                        delete account.profile.convertAccountToKeyConnector;
                    }
                    yield helper.set(userId, account);
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
                    const usesKeyConnector = yield helper.getFromUser(userId, usesKeyConnectorKeyDefinition);
                    const convertAccountToKeyConnector = yield helper.getFromUser(userId, convertAccountToKeyConnectorKeyDefinition);
                    if (usesKeyConnector == null && convertAccountToKeyConnector == null) {
                        return;
                    }
                    if (usesKeyConnector != null) {
                        account.profile.usesKeyConnector = usesKeyConnector;
                        yield helper.setToUser(userId, usesKeyConnectorKeyDefinition, null);
                    }
                    if (convertAccountToKeyConnector != null) {
                        account.profile.convertAccountToKeyConnector = convertAccountToKeyConnector;
                        yield helper.setToUser(userId, convertAccountToKeyConnectorKeyDefinition, null);
                    }
                    yield helper.set(userId, account);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.KeyConnectorMigrator = KeyConnectorMigrator;
//# sourceMappingURL=50-move-key-connector-to-state-provider.js.map