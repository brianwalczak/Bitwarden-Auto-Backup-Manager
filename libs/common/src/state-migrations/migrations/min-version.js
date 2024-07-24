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
exports.MinVersionMigrator = void 0;
exports.minVersionError = minVersionError;
const migrate_1 = require("../migrate");
const migrator_1 = require("../migrator");
function minVersionError(current) {
    return `Your local data is too old to be migrated. Your current state version is ${current}, but minimum version is ${migrate_1.MIN_VERSION}.`;
}
class MinVersionMigrator extends migrator_1.Migrator {
    constructor() {
        super(0, migrate_1.MIN_VERSION);
    }
    // Overrides the default implementation to catch any version that may be passed in.
    shouldMigrate(helper) {
        return Promise.resolve(helper.currentVersion < migrate_1.MIN_VERSION);
    }
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            if (helper.currentVersion < migrate_1.MIN_VERSION) {
                throw new Error(minVersionError(helper.currentVersion));
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            throw migrator_1.IRREVERSIBLE;
        });
    }
}
exports.MinVersionMigrator = MinVersionMigrator;
//# sourceMappingURL=min-version.js.map