"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDerivedStateProvider = void 0;
const default_derived_state_1 = require("./default-derived-state");
class DefaultDerivedStateProvider {
    constructor() {
        this.cache = {};
    }
    get(parentState$, deriveDefinition, dependencies) {
        const cacheKey = deriveDefinition.buildCacheKey();
        const existingDerivedState = this.cache[cacheKey];
        if (existingDerivedState != null) {
            // I have to cast out of the unknown generic but this should be safe if rules
            // around domain token are made
            return existingDerivedState;
        }
        const newDerivedState = this.buildDerivedState(parentState$, deriveDefinition, dependencies);
        this.cache[cacheKey] = newDerivedState;
        return newDerivedState;
    }
    buildDerivedState(parentState$, deriveDefinition, dependencies) {
        return new default_derived_state_1.DefaultDerivedState(parentState$, deriveDefinition, dependencies);
    }
}
exports.DefaultDerivedStateProvider = DefaultDerivedStateProvider;
//# sourceMappingURL=default-derived-state.provider.js.map