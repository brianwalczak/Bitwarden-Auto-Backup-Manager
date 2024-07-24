"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeriveDefinition = void 0;
/**
 * DeriveDefinitions describe state derived from another observable, the value type of which is given by `TFrom`.
 *
 * The StateDefinition is used to describe the domain of the state, and the DeriveDefinition
 * sub-divides that domain into specific keys. These keys are used to cache data in memory and enables derived state to
 * be calculated once regardless of multiple execution contexts.
 */
class DeriveDefinition {
    /**
     * Creates a new instance of a DeriveDefinition. Derived state is always stored in memory, so the storage location
     * defined in @link{StateDefinition} is ignored.
     *
     * @param stateDefinition The state definition for which this key belongs to.
     * @param uniqueDerivationName The name of the key, this should be unique per domain.
     * @param options A set of options to customize the behavior of {@link DeriveDefinition}.
     * @param options.derive A function to use to convert values from TFrom to TTo. This is called on each emit of the parent state observable
     * and the resulting value will be emitted from the derived state observable.
     * @param options.cleanupDelayMs The number of milliseconds to wait before cleaning up the state after the last subscriber has unsubscribed.
     * Defaults to 1000ms.
     * @param options.dependencyShape An object defining the dependencies of the derive function. The keys of the object are the names of the dependencies
     * and the values are the types of the dependencies.
     * for example:
     * ```
     * {
     *   myService: MyService,
     *   myOtherService: MyOtherService,
     * }
     * ```
     *
     * @param options.deserializer A function to use to safely convert your type from json to your expected type.
     *   Your data may be serialized/deserialized at any time and this needs callback needs to be able to faithfully re-initialize
     *   from the JSON object representation of your type.
     */
    constructor(stateDefinition, uniqueDerivationName, options) {
        this.stateDefinition = stateDefinition;
        this.uniqueDerivationName = uniqueDerivationName;
        this.options = options;
    }
    /**
     * Factory that produces a {@link DeriveDefinition} from a {@link KeyDefinition} or {@link DeriveDefinition} and new name.
     *
     * If a `KeyDefinition` is passed in, the returned definition will have the same key as the given key definition, but
     * will not collide with it in storage, even if they both reside in memory.
     *
     * If a `DeriveDefinition` is passed in, the returned definition will instead use the name given in the second position
     * of the tuple. It is up to you to ensure this is unique within the domain of derived state.
     *
     * @param options A set of options to customize the behavior of {@link DeriveDefinition}.
     * @param options.derive A function to use to convert values from TFrom to TTo. This is called on each emit of the parent state observable
     * and the resulting value will be emitted from the derived state observable.
     * @param options.cleanupDelayMs The number of milliseconds to wait before cleaning up the state after the last subscriber has unsubscribed.
     * Defaults to 1000ms.
     * @param options.dependencyShape An object defining the dependencies of the derive function. The keys of the object are the names of the dependencies
     * and the values are the types of the dependencies.
     * for example:
     * ```
     * {
     *   myService: MyService,
     *   myOtherService: MyOtherService,
     * }
     * ```
     *
     * @param options.deserializer A function to use to safely convert your type from json to your expected type.
     *   Your data may be serialized/deserialized at any time and this needs callback needs to be able to faithfully re-initialize
     *   from the JSON object representation of your type.
     * @param definition
     * @param options
     * @returns
     */
    static from(definition, options) {
        if (isFromDeriveDefinition(definition)) {
            return new DeriveDefinition(definition[0].stateDefinition, definition[1], options);
        }
        else {
            return new DeriveDefinition(definition.stateDefinition, definition.key, options);
        }
    }
    static fromWithUserId(definition, options) {
        if (isFromDeriveDefinition(definition)) {
            return new DeriveDefinition(definition[0].stateDefinition, definition[1], options);
        }
        else {
            return new DeriveDefinition(definition.stateDefinition, definition.key, options);
        }
    }
    get derive() {
        return this.options.derive;
    }
    deserialize(serialized) {
        return this.options.deserializer(serialized);
    }
    get cleanupDelayMs() {
        var _a;
        return this.options.cleanupDelayMs < 0 ? 0 : (_a = this.options.cleanupDelayMs) !== null && _a !== void 0 ? _a : 1000;
    }
    get clearOnCleanup() {
        var _a;
        return (_a = this.options.clearOnCleanup) !== null && _a !== void 0 ? _a : true;
    }
    buildCacheKey() {
        return `derived_${this.stateDefinition.name}_${this.uniqueDerivationName}`;
    }
    /**
     * Creates a {@link StorageKey} that points to the data for the given derived definition.
     * @returns A key that is ready to be used in a storage service to get data.
     */
    get storageKey() {
        return `derived_${this.stateDefinition.name}_${this.uniqueDerivationName}`;
    }
}
exports.DeriveDefinition = DeriveDefinition;
function isFromDeriveDefinition(definition) {
    return Array.isArray(definition);
}
//# sourceMappingURL=derive-definition.js.map