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
exports.MigrationRunner = void 0;
const state_migrations_1 = require("../../state-migrations");
const migrate_1 = require("../../state-migrations/migrate");
const migration_helper_1 = require("../../state-migrations/migration-helper");
class MigrationRunner {
    constructor(diskStorage, logService, migrationBuilderService, clientType) {
        this.diskStorage = diskStorage;
        this.logService = logService;
        this.migrationBuilderService = migrationBuilderService;
        this.clientType = clientType;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const migrationHelper = new migration_helper_1.MigrationHelper(yield (0, migrate_1.currentVersion)(this.diskStorage, this.logService), this.diskStorage, this.logService, "general", this.clientType);
            if (migrationHelper.currentVersion < 0) {
                // Cannot determine state, assuming empty so we don't repeatedly apply a migration.
                yield this.diskStorage.save("stateVersion", migrate_1.CURRENT_VERSION);
                return;
            }
            const migrationBuilder = this.migrationBuilderService.build();
            yield migrationBuilder.migrate(migrationHelper);
        });
    }
    waitForCompletion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, state_migrations_1.waitForMigrations)(this.diskStorage, this.logService);
        });
    }
}
exports.MigrationRunner = MigrationRunner;
//# sourceMappingURL=migration-runner.js.map