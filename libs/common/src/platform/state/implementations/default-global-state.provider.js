"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGlobalStateProvider = void 0;
const default_global_state_1 = require("./default-global-state");
class DefaultGlobalStateProvider {
    constructor(storageServiceProvider) {
        this.storageServiceProvider = storageServiceProvider;
        this.globalStateCache = {};
    }
    get(keyDefinition) {
        const [location, storageService] = this.storageServiceProvider.get(keyDefinition.stateDefinition.defaultStorageLocation, keyDefinition.stateDefinition.storageLocationOverrides);
        const cacheKey = this.buildCacheKey(location, keyDefinition);
        const existingGlobalState = this.globalStateCache[cacheKey];
        if (existingGlobalState != null) {
            // The cast into the actual generic is safe because of rules around key definitions
            // being unique.
            return existingGlobalState;
        }
        const newGlobalState = new default_global_state_1.DefaultGlobalState(keyDefinition, storageService);
        this.globalStateCache[cacheKey] = newGlobalState;
        return newGlobalState;
    }
    buildCacheKey(location, keyDefinition) {
        return `${location}_${keyDefinition.fullName}`;
    }
}
exports.DefaultGlobalStateProvider = DefaultGlobalStateProvider;
//# sourceMappingURL=default-global-state.provider.js.map