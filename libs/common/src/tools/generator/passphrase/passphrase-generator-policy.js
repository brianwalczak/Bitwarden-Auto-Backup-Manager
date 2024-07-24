"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisabledPassphraseGeneratorPolicy = void 0;
exports.leastPrivilege = leastPrivilege;
const enums_1 = require("../../../admin-console/enums");
/** The default options for password generation policy. */
exports.DisabledPassphraseGeneratorPolicy = Object.freeze({
    minNumberWords: 0,
    capitalize: false,
    includeNumber: false,
});
/** Reduces a policy into an accumulator by accepting the most restrictive
 *  values from each policy.
 *  @param acc the accumulator
 *  @param policy the policy to reduce
 *  @returns the most restrictive values between the policy and accumulator.
 */
function leastPrivilege(acc, policy) {
    var _a;
    if (policy.type !== enums_1.PolicyType.PasswordGenerator) {
        return acc;
    }
    return {
        minNumberWords: Math.max(acc.minNumberWords, (_a = policy.data.minNumberWords) !== null && _a !== void 0 ? _a : acc.minNumberWords),
        capitalize: policy.data.capitalize || acc.capitalize,
        includeNumber: policy.data.includeNumber || acc.includeNumber,
    };
}
//# sourceMappingURL=passphrase-generator-policy.js.map