"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyDefinition = void 0;
exports.globalKeyBuilder = globalKeyBuilder;
const deserialization_helpers_1 = require("./deserialization-helpers");
/**
 * KeyDefinitions describe the precise location to store data for a given piece of state.
 * The StateDefinition is used to describe the domain of the state, and the KeyDefinition
 * sub-divides that domain into specific keys.
 */
class KeyDefinition {
    /**
     * Creates a new instance of a KeyDefinition
     * @param stateDefinition The state definition for which this key belongs to.
     * @param key The name of the key, this should be unique per domain.
     * @param options A set of options to customize the behavior of {@link KeyDefinition}. All options are required.
     * @param options.deserializer A function to use to safely convert your type from json to your expected type.
     *   Your data may be serialized/deserialized at any time and this needs callback needs to be able to faithfully re-initialize
     *   from the JSON object representation of your type.
     */
    constructor(stateDefinition, key, options) {
        this.stateDefinition = stateDefinition;
        this.key = key;
        this.options = options;
        if (options.deserializer == null) {
            throw new Error(`'deserializer' is a required property on key ${this.errorKeyName}`);
        }
        if (options.cleanupDelayMs <= 0) {
            throw new Error(`'cleanupDelayMs' must be greater than 0. Value of ${options.cleanupDelayMs} passed to key ${this.errorKeyName} `);
        }
    }
    /**
     * Gets the deserializer configured for this {@link KeyDefinition}
     */
    get deserializer() {
        return this.options.deserializer;
    }
    /**
     * Gets the number of milliseconds to wait before cleaning up the state after the last subscriber has unsubscribed.
     */
    get cleanupDelayMs() {
        var _a;
        return this.options.cleanupDelayMs < 0 ? 0 : (_a = this.options.cleanupDelayMs) !== null && _a !== void 0 ? _a : 1000;
    }
    /**
     * Creates a {@link KeyDefinition} for state that is an array.
     * @param stateDefinition The state definition to be added to the KeyDefinition
     * @param key The key to be added to the KeyDefinition
     * @param options The options to customize the final {@link KeyDefinition}.
     * @returns A {@link KeyDefinition} initialized for arrays, the options run
     * the deserializer on the provided options for each element of an array.
     *
     * @example
     * ```typescript
     * const MY_KEY = KeyDefinition.array<MyArrayElement>(MY_STATE, "key", {
     *   deserializer: (myJsonElement) => convertToElement(myJsonElement),
     * });
     * ```
     */
    static array(stateDefinition, key, 
    // We have them provide options for the element of the array, depending on future options we add, this could get a little weird.
    options) {
        return new KeyDefinition(stateDefinition, key, Object.assign(Object.assign({}, options), { deserializer: (0, deserialization_helpers_1.array)((e) => options.deserializer(e)) }));
    }
    /**
     * Creates a {@link KeyDefinition} for state that is a record.
     * @param stateDefinition The state definition to be added to the KeyDefinition
     * @param key The key to be added to the KeyDefinition
     * @param options The options to customize the final {@link KeyDefinition}.
     * @returns A {@link KeyDefinition} that contains a serializer that will run the provided deserializer for each
     * value in a record and returns every key as a string.
     *
     * @example
     * ```typescript
     * const MY_KEY = KeyDefinition.record<MyRecordValue>(MY_STATE, "key", {
     *   deserializer: (myJsonValue) => convertToValue(myJsonValue),
     * });
     * ```
     */
    static record(stateDefinition, key, 
    // We have them provide options for the value of the record, depending on future options we add, this could get a little weird.
    options) {
        return new KeyDefinition(stateDefinition, key, Object.assign(Object.assign({}, options), { deserializer: (0, deserialization_helpers_1.record)((v) => options.deserializer(v)) }));
    }
    get fullName() {
        return `${this.stateDefinition.name}_${this.key}`;
    }
    get errorKeyName() {
        return `${this.stateDefinition.name} > ${this.key}`;
    }
}
exports.KeyDefinition = KeyDefinition;
/**
 * Creates a {@link StorageKey}
 * @param keyDefinition The key definition of which data the key should point to.
 * @returns A key that is ready to be used in a storage service to get data.
 */
function globalKeyBuilder(keyDefinition) {
    return `global_${keyDefinition.stateDefinition.name}_${keyDefinition.key}`;
}
//# sourceMappingURL=key-definition.js.map