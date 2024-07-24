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
exports.AddKeyTypeToOrgKeysMigrator = void 0;
const migrator_1 = require("../migrator");
class AddKeyTypeToOrgKeysMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function updateOrgKey(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const encryptedOrgKeys = (_b = (_a = account === null || account === void 0 ? void 0 : account.keys) === null || _a === void 0 ? void 0 : _a.organizationKeys) === null || _b === void 0 ? void 0 : _b.encrypted;
                    if (encryptedOrgKeys == null) {
                        return;
                    }
                    const newOrgKeys = {};
                    Object.entries(encryptedOrgKeys).forEach(([orgId, encKey]) => {
                        newOrgKeys[orgId] = {
                            type: "organization",
                            key: encKey,
                        };
                    });
                    account.keys.organizationKeys.encrypted = newOrgKeys;
                    yield helper.set(userId, account);
                });
            }
            // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all(accounts.map(({ userId, account }) => updateOrgKey(userId, account)));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function updateOrgKey(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const encryptedOrgKeys = (_b = (_a = account === null || account === void 0 ? void 0 : account.keys) === null || _a === void 0 ? void 0 : _a.organizationKeys) === null || _b === void 0 ? void 0 : _b.encrypted;
                    if (encryptedOrgKeys == null) {
                        return;
                    }
                    const newOrgKeys = {};
                    Object.entries(encryptedOrgKeys).forEach(([orgId, encKey]) => {
                        newOrgKeys[orgId] = encKey.key;
                    });
                    account.keys.organizationKeys.encrypted = newOrgKeys;
                    yield helper.set(userId, account);
                });
            }
            // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all(accounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) { return updateOrgKey(userId, account); })));
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
exports.AddKeyTypeToOrgKeysMigrator = AddKeyTypeToOrgKeysMigrator;
//# sourceMappingURL=5-add-key-type-to-org-keys.js.map