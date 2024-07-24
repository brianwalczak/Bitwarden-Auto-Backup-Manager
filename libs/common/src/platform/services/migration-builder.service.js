"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationBuilderService = void 0;
const state_migrations_1 = require("../../state-migrations");
class MigrationBuilderService {
    build() {
        var _a;
        return ((_a = this.migrationBuilderCache) !== null && _a !== void 0 ? _a : (this.migrationBuilderCache = (0, state_migrations_1.createMigrationBuilder)()));
    }
}
exports.MigrationBuilderService = MigrationBuilderService;
//# sourceMappingURL=migration-builder.service.js.map