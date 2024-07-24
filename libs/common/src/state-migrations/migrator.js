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
exports.Migrator = exports.IRREVERSIBLE = void 0;
exports.IRREVERSIBLE = new Error("Irreversible migration");
class Migrator {
    constructor(fromVersion, toVersion) {
        this.fromVersion = fromVersion;
        this.toVersion = toVersion;
        if (fromVersion == null || toVersion == null) {
            throw new Error("Invalid migration");
        }
        if (fromVersion > toVersion) {
            throw new Error("Invalid migration");
        }
    }
    shouldMigrate(helper, direction) {
        const startVersion = direction === "up" ? this.fromVersion : this.toVersion;
        return Promise.resolve(helper.currentVersion === startVersion);
    }
    updateVersion(helper, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const endVersion = direction === "up" ? this.toVersion : this.fromVersion;
            helper.currentVersion = endVersion;
            yield helper.set("stateVersion", endVersion);
        });
    }
}
exports.Migrator = Migrator;
//# sourceMappingURL=migrator.js.map