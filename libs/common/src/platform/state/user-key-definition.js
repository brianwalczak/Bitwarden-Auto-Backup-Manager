"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserKeyDefinition = void 0;
const utils_1 = require("../misc/utils");
const deserialization_helpers_1 = require("./deserialization-helpers");
const USER_KEY_DEFINITION_MARKER = Symbol("UserKeyDefinition");
class UserKeyDefinition {
    constructor(stateDefinition, key, options) {
        this.stateDefinition = stateDefinition;
        this.key = key;
        this.options = options;
        this[_a] = true;
        if (options.deserializer == null) {
            throw new Error(`'deserializer' is a required property on key ${this.errorKeyName}`);
        }
        if (options.cleanupDelayMs <= 0) {
            throw new Error(`'cleanupDelayMs' must be greater than 0. Value of ${options.cleanupDelayMs} passed to key ${this.errorKeyName} `);
        }
        // Filter out repeat values
        this.clearOn = Array.from(new Set(options.clearOn));
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
        var _b;
        return this.options.cleanupDelayMs < 0 ? 0 : (_b = this.options.cleanupDelayMs) !== null && _b !== void 0 ? _b : 1000;
    }
    /**
     * Creates a {@link UserKeyDefinition} for state that is an array.
     * @param stateDefinition The state definition to be added to the UserKeyDefinition
     * @param key The key to be added to the KeyDefinition
     * @param options The options to customize the final {@link UserKeyDefinition}.
     * @returns A {@link UserKeyDefinition} initialized for arrays, the options run
     * the deserializer on the provided options for each element of an array
     * **unless that array is null, in which case it will return an empty list.**
     *
     * @example
     * ```typescript
     * const MY_KEY = UserKeyDefinition.array<MyArrayElement>(MY_STATE, "key", {
     *   deserializer: (myJsonElement) => convertToElement(myJsonElement),
     * });
     * ```
     */
    static array(stateDefinition, key, 
    // We have them provide options for the element of the array, depending on future options we add, this could get a little weird.
    options) {
        return new UserKeyDefinition(stateDefinition, key, Object.assign(Object.assign({}, options), { deserializer: (0, deserialization_helpers_1.array)((e) => options.deserializer(e)) }));
    }
    /**
     * Creates a {@link UserKeyDefinition} for state that is a record.
     * @param stateDefinition The state definition to be added to the UserKeyDefinition
     * @param key The key to be added to the KeyDefinition
     * @param options The options to customize the final {@link UserKeyDefinition}.
     * @returns A {@link UserKeyDefinition} that contains a serializer that will run the provided deserializer for each
     * value in a record and returns every key as a string **unless that record is null, in which case it will return an record.**
     *
     * @example
     * ```typescript
     * const MY_KEY = UserKeyDefinition.record<MyRecordValue>(MY_STATE, "key", {
     *   deserializer: (myJsonValue) => convertToValue(myJsonValue),
     * });
     * ```
     */
    static record(stateDefinition, key, 
    // We have them provide options for the value of the record, depending on future options we add, this could get a little weird.
    options) {
        return new UserKeyDefinition(stateDefinition, key, Object.assign(Object.assign({}, options), { deserializer: (0, deserialization_helpers_1.record)((v) => options.deserializer(v)) }));
    }
    get fullName() {
        return `${this.stateDefinition.name}_${this.key}`;
    }
    buildKey(userId) {
        if (!utils_1.Utils.isGuid(userId)) {
            throw new Error(`You cannot build a user key without a valid UserId, building for key ${this.fullName}`);
        }
        return `user_${userId}_${this.stateDefinition.name}_${this.key}`;
    }
    get errorKeyName() {
        return `${this.stateDefinition.name} > ${this.key}`;
    }
}
exports.UserKeyDefinition = UserKeyDefinition;
_a = USER_KEY_DEFINITION_MARKER;
//# sourceMappingURL=user-key-definition.js.map