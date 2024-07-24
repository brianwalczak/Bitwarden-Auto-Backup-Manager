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
exports.MergeEnvironmentState = void 0;
const migrator_1 = require("../migrator");
const ENVIRONMENT_STATE = { name: "environment" };
const ENVIRONMENT_REGION = {
    key: "region",
    stateDefinition: ENVIRONMENT_STATE,
};
const ENVIRONMENT_URLS = {
    key: "urls",
    stateDefinition: ENVIRONMENT_STATE,
};
const ENVIRONMENT_ENVIRONMENT = {
    key: "environment",
    stateDefinition: ENVIRONMENT_STATE,
};
class MergeEnvironmentState extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    const region = yield helper.getFromUser(userId, ENVIRONMENT_REGION);
                    const urls = yield helper.getFromUser(userId, ENVIRONMENT_URLS);
                    if (region == null && urls == null) {
                        return;
                    }
                    yield helper.setToUser(userId, ENVIRONMENT_ENVIRONMENT, {
                        region,
                        urls,
                    });
                    yield helper.removeFromUser(userId, ENVIRONMENT_REGION);
                    yield helper.removeFromUser(userId, ENVIRONMENT_URLS);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
            const region = yield helper.getFromGlobal(ENVIRONMENT_REGION);
            const urls = yield helper.getFromGlobal(ENVIRONMENT_URLS);
            if (region == null && urls == null) {
                return;
            }
            yield helper.setToGlobal(ENVIRONMENT_ENVIRONMENT, {
                region,
                urls,
            });
            yield helper.removeFromGlobal(ENVIRONMENT_REGION);
            yield helper.removeFromGlobal(ENVIRONMENT_URLS);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function rollbackAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    const state = (yield helper.getFromUser(userId, ENVIRONMENT_ENVIRONMENT));
                    yield helper.setToUser(userId, ENVIRONMENT_REGION, state === null || state === void 0 ? void 0 : state.region);
                    yield helper.setToUser(userId, ENVIRONMENT_URLS, state === null || state === void 0 ? void 0 : state.urls);
                    yield helper.removeFromUser(userId, ENVIRONMENT_ENVIRONMENT);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
            const state = (yield helper.getFromGlobal(ENVIRONMENT_ENVIRONMENT));
            yield helper.setToGlobal(ENVIRONMENT_REGION, state === null || state === void 0 ? void 0 : state.region);
            yield helper.setToGlobal(ENVIRONMENT_URLS, state === null || state === void 0 ? void 0 : state.urls);
            yield helper.removeFromGlobal(ENVIRONMENT_ENVIRONMENT);
        });
    }
}
exports.MergeEnvironmentState = MergeEnvironmentState;
//# sourceMappingURL=45-merge-environment-state.js.map