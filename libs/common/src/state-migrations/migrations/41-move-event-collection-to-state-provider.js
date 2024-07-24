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
exports.EventCollectionMigrator = void 0;
const migrator_1 = require("../migrator");
const EVENT_COLLECTION = {
    stateDefinition: {
        name: "eventCollection",
    },
    key: "eventCollection",
};
class EventCollectionMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const value = (_a = account === null || account === void 0 ? void 0 : account.data) === null || _a === void 0 ? void 0 : _a.eventCollection;
                    if (value != null) {
                        yield helper.setToUser(userId, EVENT_COLLECTION, value);
                        delete account.data.eventCollection;
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
                    const value = yield helper.getFromUser(userId, EVENT_COLLECTION);
                    if (account) {
                        account.data = Object.assign((_a = account.data) !== null && _a !== void 0 ? _a : {}, {
                            eventCollection: value,
                        });
                        yield helper.set(userId, account);
                    }
                    yield helper.setToUser(userId, EVENT_COLLECTION, null);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.EventCollectionMigrator = EventCollectionMigrator;
//# sourceMappingURL=41-move-event-collection-to-state-provider.js.map