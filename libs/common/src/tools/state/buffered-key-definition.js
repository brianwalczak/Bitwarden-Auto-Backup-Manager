"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferedKeyDefinition = void 0;
const state_1 = require("../../platform/state");
/** Storage and mapping settings for data stored by a `BufferedState`.
 */
class BufferedKeyDefinition {
    /**
     * Defines a buffered state
     * @param stateDefinition The domain of the buffer
     * @param key Domain key that identifies the buffered value. This key must
     *    not be reused in any capacity.
     * @param options Configures the operation of the buffered state.
     */
    constructor(stateDefinition, key, options) {
        this.stateDefinition = stateDefinition;
        this.key = key;
        this.options = options;
    }
    /** Converts the buffered key definition to a state provider
     *  key definition
     */
    toKeyDefinition() {
        const bufferedKey = new state_1.UserKeyDefinition(this.stateDefinition, this.key, this.options);
        return bufferedKey;
    }
    /** Checks whether the dependency triggers an overwrite. */
    shouldOverwrite(dependency) {
        var _a;
        const shouldOverwrite = (_a = this.options) === null || _a === void 0 ? void 0 : _a.shouldOverwrite;
        if (shouldOverwrite) {
            return shouldOverwrite(dependency);
        }
        return dependency ? true : false;
    }
    /** Converts the input data format to its output format.
     *  @returns the converted value.
     */
    map(input, dependency) {
        var _a;
        const map = (_a = this.options) === null || _a === void 0 ? void 0 : _a.map;
        if (map) {
            return map(input, dependency);
        }
        return Promise.resolve(input);
    }
    /** Checks whether the input type can be converted to the output type.
     *  @returns `true` if the definition is defined and valid, otherwise `false`.
     */
    isValid(input, dependency) {
        var _a;
        if (input === null) {
            return Promise.resolve(false);
        }
        const isValid = (_a = this.options) === null || _a === void 0 ? void 0 : _a.isValid;
        if (isValid) {
            return isValid(input, dependency);
        }
        return Promise.resolve(input ? true : false);
    }
}
exports.BufferedKeyDefinition = BufferedKeyDefinition;
//# sourceMappingURL=buffered-key-definition.js.map