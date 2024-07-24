"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisabledGeneratorNavigationPolicy = void 0;
exports.preferPassword = preferPassword;
const enums_1 = require("../../../admin-console/enums");
/** Reduces a policy into an accumulator by preferring the password generator
 *  type to other generator types.
 *  @param acc the accumulator
 *  @param policy the policy to reduce
 *  @returns the resulting `GeneratorNavigationPolicy`
 */
function preferPassword(acc, policy) {
    const isEnabled = policy.type === enums_1.PolicyType.PasswordGenerator && policy.enabled;
    if (!isEnabled) {
        return acc;
    }
    const isOverridable = acc.defaultType !== "password" && policy.data.defaultType;
    const result = isOverridable ? Object.assign(Object.assign({}, acc), { defaultType: policy.data.defaultType }) : acc;
    return result;
}
/** The default options for password generation policy. */
exports.DisabledGeneratorNavigationPolicy = Object.freeze({
    defaultType: undefined,
});
//# sourceMappingURL=generator-navigation-policy.js.map