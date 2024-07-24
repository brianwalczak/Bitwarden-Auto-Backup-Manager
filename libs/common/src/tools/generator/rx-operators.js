"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPolicyToEvaluator = mapPolicyToEvaluator;
exports.newDefaultEvaluator = newDefaultEvaluator;
const rxjs_1 = require("rxjs");
const rx_1 = require("@bitwarden/common/tools/rx");
const default_policy_evaluator_1 = require("./default-policy-evaluator");
/** Maps an administrative console policy to a policy evaluator using the provided configuration.
 *  @param configuration the configuration that constructs the evaluator.
 */
function mapPolicyToEvaluator(configuration) {
    return (0, rxjs_1.pipe)((0, rx_1.reduceCollection)(configuration.combine, configuration.disabledValue), (0, rx_1.distinctIfShallowMatch)(), (0, rxjs_1.map)(configuration.createEvaluator));
}
/** Constructs a method that maps a policy to the default (no-op) policy. */
function newDefaultEvaluator() {
    return () => {
        return (0, rxjs_1.pipe)((0, rxjs_1.map)((_) => new default_policy_evaluator_1.DefaultPolicyEvaluator()));
    };
}
//# sourceMappingURL=rx-operators.js.map