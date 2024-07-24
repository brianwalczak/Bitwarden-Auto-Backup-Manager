"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateDefinition = void 0;
/**
 * Defines the base location and instruction of where this state is expected to be located.
 */
class StateDefinition {
    /**
     * Creates a new instance of {@link StateDefinition}, the creation of which is owned by the platform team.
     * @param name The name of the state, this needs to be unique from all other {@link StateDefinition}'s.
     * @param defaultStorageLocation The location of where this state should be stored.
     */
    constructor(name, defaultStorageLocation, storageLocationOverrides) {
        this.name = name;
        this.defaultStorageLocation = defaultStorageLocation;
        this.storageLocationOverrides = storageLocationOverrides !== null && storageLocationOverrides !== void 0 ? storageLocationOverrides : {};
    }
}
exports.StateDefinition = StateDefinition;
//# sourceMappingURL=state-definition.js.map