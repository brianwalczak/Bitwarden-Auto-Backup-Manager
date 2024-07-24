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
exports.KdfConfigMigrator = void 0;
const migrator_1 = require("../migrator");
var KdfType;
(function (KdfType) {
    KdfType[KdfType["PBKDF2_SHA256"] = 0] = "PBKDF2_SHA256";
    KdfType[KdfType["Argon2id"] = 1] = "Argon2id";
})(KdfType || (KdfType = {}));
class KdfConfig {
}
const kdfConfigKeyDefinition = {
    key: "kdfConfig",
    stateDefinition: {
        name: "kdfConfig",
    },
};
class KdfConfigMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    const iterations = (_a = account === null || account === void 0 ? void 0 : account.profile) === null || _a === void 0 ? void 0 : _a.kdfIterations;
                    const kdfType = (_b = account === null || account === void 0 ? void 0 : account.profile) === null || _b === void 0 ? void 0 : _b.kdfType;
                    const memory = (_c = account === null || account === void 0 ? void 0 : account.profile) === null || _c === void 0 ? void 0 : _c.kdfMemory;
                    const parallelism = (_d = account === null || account === void 0 ? void 0 : account.profile) === null || _d === void 0 ? void 0 : _d.kdfParallelism;
                    const kdfConfig = {
                        iterations: iterations,
                        kdfType: kdfType,
                        memory: memory,
                        parallelism: parallelism,
                    };
                    if (kdfConfig != null) {
                        yield helper.setToUser(userId, kdfConfigKeyDefinition, kdfConfig);
                        (_e = account === null || account === void 0 ? void 0 : account.profile) === null || _e === void 0 ? true : delete _e.kdfIterations;
                        (_f = account === null || account === void 0 ? void 0 : account.profile) === null || _f === void 0 ? true : delete _f.kdfType;
                        (_g = account === null || account === void 0 ? void 0 : account.profile) === null || _g === void 0 ? true : delete _g.kdfMemory;
                        (_h = account === null || account === void 0 ? void 0 : account.profile) === null || _h === void 0 ? true : delete _h.kdfParallelism;
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
                    const kdfConfig = yield helper.getFromUser(userId, kdfConfigKeyDefinition);
                    if (kdfConfig != null) {
                        account.profile.kdfIterations = kdfConfig.iterations;
                        account.profile.kdfType = kdfConfig.kdfType;
                        account.profile.kdfMemory = kdfConfig.memory;
                        account.profile.kdfParallelism = kdfConfig.parallelism;
                        yield helper.setToUser(userId, kdfConfigKeyDefinition, null);
                    }
                    yield helper.set(userId, account);
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => rollbackAccount(userId, account))]);
        });
    }
}
exports.KdfConfigMigrator = KdfConfigMigrator;
//# sourceMappingURL=59-move-kdf-config-to-state-provider.js.map