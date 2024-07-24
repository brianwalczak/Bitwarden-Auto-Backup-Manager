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
exports.MoveEnvironmentStateToProviders = void 0;
const migrator_1 = require("../migrator");
const ENVIRONMENT_STATE = { name: "environment" };
const REGION_KEY = { key: "region", stateDefinition: ENVIRONMENT_STATE };
const URLS_KEY = { key: "urls", stateDefinition: ENVIRONMENT_STATE };
class MoveEnvironmentStateToProviders extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyGlobal = yield helper.get("global");
            // Move global data
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.region) != null) {
                yield helper.setToGlobal(REGION_KEY, legacyGlobal.region);
            }
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.environmentUrls) != null) {
                yield helper.setToGlobal(URLS_KEY, legacyGlobal.environmentUrls);
            }
            const legacyAccounts = yield helper.getAccounts();
            yield Promise.all(legacyAccounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b, _c, _d, _e;
                // Move account data
                if (((_b = account === null || account === void 0 ? void 0 : account.settings) === null || _b === void 0 ? void 0 : _b.region) != null) {
                    yield helper.setToUser(userId, REGION_KEY, account.settings.region);
                }
                if (((_c = account === null || account === void 0 ? void 0 : account.settings) === null || _c === void 0 ? void 0 : _c.environmentUrls) != null) {
                    yield helper.setToUser(userId, URLS_KEY, account.settings.environmentUrls);
                }
                // Delete old account data
                (_d = account === null || account === void 0 ? void 0 : account.settings) === null || _d === void 0 ? true : delete _d.region;
                (_e = account === null || account === void 0 ? void 0 : account.settings) === null || _e === void 0 ? true : delete _e.environmentUrls;
                yield helper.set(userId, account);
            })));
            // Delete legacy global data
            legacyGlobal === null || legacyGlobal === void 0 ? true : delete legacyGlobal.region;
            legacyGlobal === null || legacyGlobal === void 0 ? true : delete legacyGlobal.environmentUrls;
            yield helper.set("global", legacyGlobal);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            let legacyGlobal = yield helper.get("global");
            let updatedLegacyGlobal = false;
            const globalRegion = yield helper.getFromGlobal(REGION_KEY);
            if (globalRegion) {
                if (!legacyGlobal) {
                    legacyGlobal = {};
                }
                updatedLegacyGlobal = true;
                legacyGlobal.region = globalRegion;
                yield helper.setToGlobal(REGION_KEY, null);
            }
            const globalUrls = yield helper.getFromGlobal(URLS_KEY);
            if (globalUrls) {
                if (!legacyGlobal) {
                    legacyGlobal = {};
                }
                updatedLegacyGlobal = true;
                legacyGlobal.environmentUrls = globalUrls;
                yield helper.setToGlobal(URLS_KEY, null);
            }
            if (updatedLegacyGlobal) {
                yield helper.set("global", legacyGlobal);
            }
            function rollbackUser(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let updatedAccount = false;
                    const userRegion = yield helper.getFromUser(userId, REGION_KEY);
                    if (userRegion) {
                        if (!account) {
                            account = {};
                        }
                        if (!account.settings) {
                            account.settings = {};
                        }
                        updatedAccount = true;
                        account.settings.region = userRegion;
                        yield helper.setToUser(userId, REGION_KEY, null);
                    }
                    const userUrls = yield helper.getFromUser(userId, URLS_KEY);
                    if (userUrls) {
                        if (!account) {
                            account = {};
                        }
                        if (!account.settings) {
                            account.settings = {};
                        }
                        updatedAccount = true;
                        account.settings.environmentUrls = userUrls;
                        yield helper.setToUser(userId, URLS_KEY, null);
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
exports.MoveEnvironmentStateToProviders = MoveEnvironmentStateToProviders;
//# sourceMappingURL=12-move-environment-state-to-providers.js.map