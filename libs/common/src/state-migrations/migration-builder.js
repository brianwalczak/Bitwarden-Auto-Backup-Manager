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
exports.MigrationBuilder = void 0;
class MigrationBuilder {
    /** Create a new MigrationBuilder with an empty buffer of migrations to perform.
     *
     * Add migrations to the buffer with {@link with} and {@link rollback}.
     * @returns A new MigrationBuilder.
     */
    static create() {
        return new MigrationBuilder([]);
    }
    constructor(migrations) {
        this.migrations = migrations;
    }
    /** Add a migrator to the MigrationBuilder. Types are updated such that the chained MigrationBuilder must currently be
     * at state version equal to the from version of the migrator. Return as MigrationBuilder<TTo> where TTo is the to
     * version of the migrator, so that the next migrator can be chained.
     *
     * @param migrate A migrator class or a tuple of a migrator class, the from version, and the to version. A tuple is
     * required to instantiate version numbers unless a default constructor is defined.
     * @returns A new MigrationBuilder with the to version of the migrator as the current version.
     */
    with(...migrate) {
        return this.addMigrator(migrate, "up");
    }
    /** Add a migrator to rollback on the MigrationBuilder's list of migrations. As with {@link with}, types of
     * MigrationBuilder and Migrator must align. However, this time the migration is reversed so TCurrent of the
     * MigrationBuilder must be equal to the to version of the migrator. Return as MigrationBuilder<TFrom> where TFrom
     * is the from version of the migrator, so that the next migrator can be chained.
     *
     * @param migrate A migrator class or a tuple of a migrator class, the from version, and the to version. A tuple is
     * required to instantiate version numbers unless a default constructor is defined.
     * @returns A new MigrationBuilder with the from version of the migrator as the current version.
     */
    rollback(...migrate) {
        if (migrate.length === 3) {
            migrate = [migrate[0], migrate[2], migrate[1]];
        }
        return this.addMigrator(migrate, "down");
    }
    /** Execute the migrations as defined in the MigrationBuilder's migrator buffer */
    migrate(helper) {
        return this.migrations.reduce((promise, migrator) => promise.then(() => __awaiter(this, void 0, void 0, function* () {
            yield this.runMigrator(migrator.migrator, helper, migrator.direction);
        })), Promise.resolve());
    }
    addMigrator(migrate, direction = "up") {
        const newMigration = migrate.length === 1
            ? { migrator: new migrate[0](), direction }
            : { migrator: new migrate[0](migrate[1], migrate[2]), direction };
        return new MigrationBuilder([...this.migrations, newMigration]);
    }
    runMigrator(migrator, helper, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const shouldMigrate = yield migrator.shouldMigrate(helper, direction);
            helper.info(`Migrator ${migrator.constructor.name} (to version ${migrator.toVersion}) should migrate: ${shouldMigrate} - ${direction}`);
            if (shouldMigrate) {
                const method = direction === "up" ? migrator.migrate : migrator.rollback;
                yield method.bind(migrator)(helper);
                helper.info(`Migrator ${migrator.constructor.name} (to version ${migrator.toVersion}) migrated - ${direction}`);
                yield migrator.updateVersion(helper, direction);
                helper.info(`Migrator ${migrator.constructor.name} (to version ${migrator.toVersion}) updated version - ${direction}`);
            }
        });
    }
}
exports.MigrationBuilder = MigrationBuilder;
//# sourceMappingURL=migration-builder.js.map