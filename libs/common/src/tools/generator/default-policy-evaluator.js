"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPolicyEvaluator = void 0;
/** A policy evaluator that does not apply any policy */
class DefaultPolicyEvaluator {
    /** {@link PolicyEvaluator.policy} */
    get policy() {
        return {};
    }
    /** {@link PolicyEvaluator.policyInEffect} */
    get policyInEffect() {
        return false;
    }
    /** {@link PolicyEvaluator.applyPolicy} */
    applyPolicy(options) {
        return options;
    }
    /** {@link PolicyEvaluator.sanitize} */
    sanitize(options) {
        return options;
    }
}
exports.DefaultPolicyEvaluator = DefaultPolicyEvaluator;
//# sourceMappingURL=default-policy-evaluator.js.map