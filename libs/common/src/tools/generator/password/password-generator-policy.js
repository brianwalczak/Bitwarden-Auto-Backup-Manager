"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisabledPasswordGeneratorPolicy = void 0;
exports.leastPrivilege = leastPrivilege;
const enums_1 = require("../../../admin-console/enums");
/** The default options for password generation policy. */
exports.DisabledPasswordGeneratorPolicy = Object.freeze({
    minLength: 0,
    useUppercase: false,
    useLowercase: false,
    useNumbers: false,
    numberCount: 0,
    useSpecial: false,
    specialCount: 0,
});
/** Reduces a policy into an accumulator by accepting the most restrictive
 *  values from each policy.
 *  @param acc the accumulator
 *  @param policy the policy to reduce
 *  @returns the most restrictive values between the policy and accumulator.
 */
function leastPrivilege(acc, policy) {
    var _a, _b, _c;
    if (policy.type !== enums_1.PolicyType.PasswordGenerator || !policy.enabled) {
        return acc;
    }
    return {
        minLength: Math.max(acc.minLength, (_a = policy.data.minLength) !== null && _a !== void 0 ? _a : acc.minLength),
        useUppercase: policy.data.useUpper || acc.useUppercase,
        useLowercase: policy.data.useLower || acc.useLowercase,
        useNumbers: policy.data.useNumbers || acc.useNumbers,
        numberCount: Math.max(acc.numberCount, (_b = policy.data.minNumbers) !== null && _b !== void 0 ? _b : acc.numberCount),
        useSpecial: policy.data.useSpecial || acc.useSpecial,
        specialCount: Math.max(acc.specialCount, (_c = policy.data.minSpecial) !== null && _c !== void 0 ? _c : acc.specialCount),
    };
}
//# sourceMappingURL=password-generator-policy.js.map