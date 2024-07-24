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
exports.MoveStateVersionMigrator = void 0;
const migrator_1 = require("../migrator");
class MoveStateVersionMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = yield helper.get("global");
            if (global.stateVersion) {
                yield helper.set("stateVersion", global.stateVersion);
                delete global.stateVersion;
                yield helper.set("global", global);
            }
            else {
                throw new Error("Migration failed, state version not found");
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield helper.get("stateVersion");
            const global = yield helper.get("global");
            yield helper.set("global", Object.assign(Object.assign({}, global), { stateVersion: version }));
            yield helper.set("stateVersion", undefined);
        });
    }
    // Override is necessary because default implementation assumes `stateVersion` at the root, but this migration moves
    // it from a `global` object to root.This makes for unique rollback versioning.
    updateVersion(helper, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const endVersion = direction === "up" ? this.toVersion : this.fromVersion;
            helper.currentVersion = endVersion;
            if (direction === "up") {
                yield helper.set("stateVersion", endVersion);
            }
            else {
                const global = (yield helper.get("global")) || {};
                yield helper.set("global", Object.assign(Object.assign({}, global), { stateVersion: endVersion }));
            }
        });
    }
}
exports.MoveStateVersionMigrator = MoveStateVersionMigrator;
//# sourceMappingURL=8-move-state-version.js.map