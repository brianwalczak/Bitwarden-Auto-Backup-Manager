"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordGeneratorOptionsEvaluator = exports.DefaultBoundaries = void 0;
function initializeBoundaries() {
    const length = Object.freeze({
        min: 5,
        max: 128,
    });
    const minDigits = Object.freeze({
        min: 0,
        max: 9,
    });
    const minSpecialCharacters = Object.freeze({
        min: 0,
        max: 9,
    });
    return Object.freeze({
        length,
        minDigits,
        minSpecialCharacters,
    });
}
/** Immutable default boundaries for password generation.
 * These are used when the policy does not override a value.
 */
exports.DefaultBoundaries = initializeBoundaries();
/** Enforces policy for password generation.
 */
class PasswordGeneratorOptionsEvaluator {
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
        this.minDigits = createBoundary(policy.numberCount, exports.DefaultBoundaries.minDigits);
        this.minSpecialCharacters = createBoundary(policy.specialCount, exports.DefaultBoundaries.minSpecialCharacters);
        // the overall length should be at least as long as the sum of the minimums
        const minConsistentLength = this.minDigits.min + this.minSpecialCharacters.min;
        const minPolicyLength = policy.minLength > 0 ? policy.minLength : exports.DefaultBoundaries.length.min;
        const minLength = Math.max(minPolicyLength, minConsistentLength, exports.DefaultBoundaries.length.min);
        this.length = {
            min: minLength,
            max: Math.max(exports.DefaultBoundaries.length.max, minLength),
        };
    }
    /** {@link PolicyEvaluator.policyInEffect} */
    get policyInEffect() {
        const policies = [
            this.policy.useUppercase,
            this.policy.useLowercase,
            this.policy.useNumbers,
            this.policy.useSpecial,
            this.policy.minLength > exports.DefaultBoundaries.length.min,
            this.policy.numberCount > exports.DefaultBoundaries.minDigits.min,
            this.policy.specialCount > exports.DefaultBoundaries.minSpecialCharacters.min,
        ];
        return policies.includes(true);
    }
    /** {@link PolicyEvaluator.applyPolicy} */
    applyPolicy(options) {
        function fitToBounds(value, boundaries) {
            const { min, max } = boundaries;
            const withUpperBound = Math.min(value || 0, max);
            const withLowerBound = Math.max(withUpperBound, min);
            return withLowerBound;
        }
        // apply policy overrides
        const uppercase = this.policy.useUppercase || options.uppercase || false;
        const lowercase = this.policy.useLowercase || options.lowercase || false;
        // these overrides can cascade numeric fields to boolean fields
        const number = this.policy.useNumbers || options.number || options.minNumber > 0;
        const special = this.policy.useSpecial || options.special || options.minSpecial > 0;
        // apply boundaries; the boundaries can cascade boolean fields to numeric fields
        const length = fitToBounds(options.length, this.length);
        const minNumber = fitToBounds(options.minNumber, this.minDigits);
        const minSpecial = fitToBounds(options.minSpecial, this.minSpecialCharacters);
        return Object.assign(Object.assign({}, options), { length,
            uppercase,
            lowercase,
            number,
            minNumber,
            special,
            minSpecial });
    }
    /** {@link PolicyEvaluator.sanitize} */
    sanitize(options) {
        var _a;
        function cascade(enabled, value) {
            const enabledResult = enabled !== null && enabled !== void 0 ? enabled : value > 0;
            const valueResult = enabledResult ? value || 1 : 0;
            return [enabledResult, valueResult];
        }
        const [lowercase, minLowercase] = cascade(options.lowercase, options.minLowercase);
        const [uppercase, minUppercase] = cascade(options.uppercase, options.minUppercase);
        const [number, minNumber] = cascade(options.number, options.minNumber);
        const [special, minSpecial] = cascade(options.special, options.minSpecial);
        // minimums can only increase the length
        const minConsistentLength = minLowercase + minUppercase + minNumber + minSpecial;
        const minLength = Math.max(minConsistentLength, this.length.min);
        const length = Math.max((_a = options.length) !== null && _a !== void 0 ? _a : minLength, minLength);
        return Object.assign(Object.assign({}, options), { length,
            minLength,
            lowercase,
            minLowercase,
            uppercase,
            minUppercase,
            number,
            minNumber,
            special,
            minSpecial });
    }
}
exports.PasswordGeneratorOptionsEvaluator = PasswordGeneratorOptionsEvaluator;
//# sourceMappingURL=password-generator-options-evaluator.js.map