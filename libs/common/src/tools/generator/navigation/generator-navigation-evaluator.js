"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorNavigationEvaluator = void 0;
const generator_navigation_1 = require("./generator-navigation");
/** Enforces policy for generator navigation options.
 */
class GeneratorNavigationEvaluator {
    /** Instantiates the evaluator.
     * @param policy The policy applied by the evaluator. When this conflicts with
     *               the defaults, the policy takes precedence.
     */
    constructor(policy) {
        this.policy = policy;
    }
    /** {@link PolicyEvaluator.policyInEffect} */
    get policyInEffect() {
        var _a;
        return ((_a = this.policy) === null || _a === void 0 ? void 0 : _a.defaultType) ? true : false;
    }
    /** Apply policy to the input options.
     *  @param options The options to build from. These options are not altered.
     *  @returns A new password generation request with policy applied.
     */
    applyPolicy(options) {
        return options;
    }
    /** Ensures internal options consistency.
     *  @param options The options to cascade. These options are not altered.
     *  @returns A passphrase generation request with cascade applied.
     */
    sanitize(options) {
        var _a;
        const defaultType = this.policyInEffect
            ? this.policy.defaultType
            : generator_navigation_1.DefaultGeneratorNavigation.type;
        return Object.assign(Object.assign({}, options), { type: (_a = options.type) !== null && _a !== void 0 ? _a : defaultType });
    }
}
exports.GeneratorNavigationEvaluator = GeneratorNavigationEvaluator;
//# sourceMappingURL=generator-navigation-evaluator.js.map