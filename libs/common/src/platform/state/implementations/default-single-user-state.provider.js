"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSingleUserStateProvider = void 0;
const default_single_user_state_1 = require("./default-single-user-state");
class DefaultSingleUserStateProvider {
    constructor(storageServiceProvider, stateEventRegistrarService) {
        this.storageServiceProvider = storageServiceProvider;
        this.stateEventRegistrarService = stateEventRegistrarService;
        this.cache = {};
    }
    get(userId, keyDefinition) {
        const [location, storageService] = this.storageServiceProvider.get(keyDefinition.stateDefinition.defaultStorageLocation, keyDefinition.stateDefinition.storageLocationOverrides);
        const cacheKey = this.buildCacheKey(location, userId, keyDefinition);
        const existingUserState = this.cache[cacheKey];
        if (existingUserState != null) {
            // I have to cast out of the unknown generic but this should be safe if rules
            // around domain token are made
            return existingUserState;
        }
        const newUserState = new default_single_user_state_1.DefaultSingleUserState(userId, keyDefinition, storageService, this.stateEventRegistrarService);
        this.cache[cacheKey] = newUserState;
        return newUserState;
    }
    buildCacheKey(location, userId, keyDefinition) {
        return `${location}_${keyDefinition.fullName}_${userId}`;
    }
}
exports.DefaultSingleUserStateProvider = DefaultSingleUserStateProvider;
//# sourceMappingURL=default-single-user-state.provider.js.map