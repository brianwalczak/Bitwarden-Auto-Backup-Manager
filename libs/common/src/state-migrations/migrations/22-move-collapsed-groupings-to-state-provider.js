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
exports.CollapsedGroupingsMigrator = void 0;
const migrator_1 = require("../migrator");
const COLLAPSED_GROUPINGS = {
    key: "collapsedGroupings",
    stateDefinition: {
        name: "vaultFilter",
    },
};
class CollapsedGroupingsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const value = (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.collapsedGroupings;
                    if (value != null) {
                        yield helper.setToUser(userId, COLLAPSED_GROUPINGS, value);
                        delete account.settings.collapsedGroupings;
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
                    var _a;
                    const value = yield helper.getFromUser(userId, COLLAPSED_GROUPINGS);
                    if (account) {
                        account.settings = Object.assign((_a = account.settings) !== null && _a !== void 0 ? _a : {}, {
                            collapsedGroupings: value,
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, COLLAPSED_GROUPINGS, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.CollapsedGroupingsMigrator = CollapsedGroupingsMigrator;
//# sourceMappingURL=22-move-collapsed-groupings-to-state-provider.js.map