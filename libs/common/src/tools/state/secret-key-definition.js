"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretKeyDefinition = void 0;
const state_1 = require("../../platform/state");
/** Encryption and storage settings for data stored by a `SecretState`.
 */
class SecretKeyDefinition {
    constructor(stateDefinition, key, classifier, options, 
    // type erasure is necessary here because typescript doesn't support
    // higher kinded types that generalize over collections. The invariants
    // needed to make this typesafe are maintained by the static factories.
    deconstruct, reconstruct) {
        this.stateDefinition = stateDefinition;
        this.key = key;
        this.classifier = classifier;
        this.options = options;
        this.deconstruct = deconstruct;
        this.reconstruct = reconstruct;
    }
    /** Converts the secret key to the `KeyDefinition` used for secret storage. */
    toEncryptedStateKey() {
        const secretKey = new state_1.UserKeyDefinition(this.stateDefinition, this.key, {
            cleanupDelayMs: this.options.cleanupDelayMs,
            deserializer: (jsonValue) => jsonValue,
            // Clear encrypted state on logout
            clearOn: this.options.clearOn,
        });
        return secretKey;
    }
    /**
     * Define a secret state for a single value
     * @param stateDefinition The domain of the secret's durable state.
     * @param key Domain key that identifies the stored value. This key must not be reused
     *    in any capacity.
     * @param classifier Partitions the value into encrypted, discarded, and public data.
     * @param options Configures the operation of the secret state.
     */
    static value(stateDefinition, key, classifier, options) {
        return new SecretKeyDefinition(stateDefinition, key, classifier, options, (value) => [[null, value]], ([[, inner]]) => inner);
    }
    /**
     * Define a secret state for an array of values. Each item is encrypted separately.
     * @param stateDefinition The domain of the secret's durable state.
     * @param key Domain key that identifies the stored items. This key must not be reused
     *    in any capacity.
     * @param classifier Partitions each item into encrypted, discarded, and public data.
     * @param options Configures the operation of the secret state.
     */
    static array(stateDefinition, key, classifier, options) {
        return new SecretKeyDefinition(stateDefinition, key, classifier, options, (value) => value.map((v, id) => [id, v]), (values) => values.map(([, v]) => v));
    }
    /**
     * Define a secret state for a record. Each property is encrypted separately.
     * @param stateDefinition The domain of the secret's durable state.
     * @param key Domain key that identifies the stored properties. This key must not be reused
     *    in any capacity.
     * @param classifier Partitions each property into encrypted, discarded, and public data.
     * @param options Configures the operation of the secret state.
     */
    static record(stateDefinition, key, classifier, options) {
        return new SecretKeyDefinition(stateDefinition, key, classifier, options, (value) => Object.entries(value), (values) => Object.fromEntries(values));
    }
}
exports.SecretKeyDefinition = SecretKeyDefinition;
//# sourceMappingURL=secret-key-definition.js.map