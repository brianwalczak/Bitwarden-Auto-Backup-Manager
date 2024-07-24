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
exports.RemoveRefreshTokenMigratedFlagMigrator = exports.REFRESH_TOKEN_MIGRATED_TO_SECURE_STORAGE = void 0;
const migrator_1 = require("../migrator");
exports.REFRESH_TOKEN_MIGRATED_TO_SECURE_STORAGE = {
    key: "refreshTokenMigratedToSecureStorage", // matches KeyDefinition.key
    stateDefinition: {
        name: "token", // matches StateDefinition.name in StateDefinitions
    },
};
class RemoveRefreshTokenMigratedFlagMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    const refreshTokenMigratedFlag = yield helper.getFromUser(userId, exports.REFRESH_TOKEN_MIGRATED_TO_SECURE_STORAGE);
                    if (refreshTokenMigratedFlag != null) {
                        // Only delete the flag if it exists
                        yield helper.removeFromUser(userId, exports.REFRESH_TOKEN_MIGRATED_TO_SECURE_STORAGE);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            throw migrator_1.IRREVERSIBLE;
        });
    }
}
exports.RemoveRefreshTokenMigratedFlagMigrator = RemoveRefreshTokenMigratedFlagMigrator;
//# sourceMappingURL=58-remove-refresh-token-migrated-state-provider-flag.js.map