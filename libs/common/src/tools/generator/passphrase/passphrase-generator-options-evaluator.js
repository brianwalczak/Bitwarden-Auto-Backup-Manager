"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassphraseGeneratorOptionsEvaluator = exports.DefaultBoundaries = void 0;
const passphrase_generation_options_1 = require("./passphrase-generation-options");
function initializeBoundaries() {
    const numWords = Object.freeze({
        min: 3,
        max: 20,
    });
    return Object.freeze({
        numWords,
    });
}
/** Immutable default boundaries for passphrase generation.
 * These are used when the policy does not override a value.
 */
exports.DefaultBoundaries = initializeBoundaries();
/** Enforces policy for passphrase generation options.
 */
class PassphraseGeneratorOptionsEvaluator {
    /** Instantiates the evaluator.
     * @param policy The policy applied by the evaluator. When this conflicts with
     *               the defaults, the policy takes precedence.
     */
    constructor(policy) {
        function createBoundary(value, defaultBoundary) {
            const boundary = {
                min: Math.max(defaultBoundary.min, value),
                max: Math.max(defaultBoundary.max, value),
            };
            return boundary;
        }
        this.policy = structuredClone(policy);
        this.numWords = createBoundary(policy.minNumberWords, exports.DefaultBoundaries.numWords);
    }
    /** {@link PolicyEvaluator.policyInEffect} */
    get policyInEffect() {
        const policies = [
            this.policy.capitalize,
            this.policy.includeNumber,
            this.policy.minNumberWords > exports.DefaultBoundaries.numWords.min,
        ];
        return policies.includes(true);
    }
    /** Apply policy to the input options.
     *  @param options The options to build from. These options are not altered.
     *  @returns A new password generation request with policy applied.
     */
    applyPolicy(options) {
        function fitToBounds(value, boundaries) {
            const { min, max } = boundaries;
            const withUpperBound = Math.min(value !== null && value !== void 0 ? value : boundaries.min, max);
            const withLowerBound = Math.max(withUpperBound, min);
            return withLowerBound;
        }
        // apply policy overrides
        const capitalize = this.policy.capitalize || options.capitalize || false;
        const includeNumber = this.policy.includeNumber || options.includeNumber || false;
        // apply boundaries
        const numWords = fitToBounds(options.numWords, this.numWords);
        return Object.assign(Object.assign({}, options), { numWords,
            capitalize,
            includeNumber });
    }
    /** Ensures internal options consistency.
     *  @param options The options to cascade. These options are not altered.
     *  @returns A passphrase generation request with cascade applied.
     */
    sanitize(options) {
        var _a, _b;
        // ensure words are separated by a single character or the empty string
        const wordSeparator = options.wordSeparator === ""
            ? ""
            : (_b = (_a = options.wordSeparator) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : passphrase_generation_options_1.DefaultPassphraseGenerationOptions.wordSeparator;
        return Object.assign(Object.assign({}, options), { wordSeparator });
    }
}
exports.PassphraseGeneratorOptionsEvaluator = PassphraseGeneratorOptionsEvaluator;
//# sourceMappingURL=passphrase-generator-options-evaluator.js.map