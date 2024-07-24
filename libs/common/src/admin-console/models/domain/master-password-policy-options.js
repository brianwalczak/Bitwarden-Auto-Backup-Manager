"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterPasswordPolicyOptions = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
class MasterPasswordPolicyOptions extends domain_base_1.default {
    constructor() {
        super(...arguments);
        this.minComplexity = 0;
        this.minLength = 0;
        this.requireUpper = false;
        this.requireLower = false;
        this.requireNumbers = false;
        this.requireSpecial = false;
        /**
         * Flag to indicate if the policy should be enforced on login.
         * If true, and the user's password does not meet the policy requirements,
         * the user will be forced to update their password.
         */
        this.enforceOnLogin = false;
    }
    static fromResponse(policy) {
        if (policy == null) {
            return null;
        }
        const options = new MasterPasswordPolicyOptions();
        options.minComplexity = policy.minComplexity;
        options.minLength = policy.minLength;
        options.requireUpper = policy.requireUpper;
        options.requireLower = policy.requireLower;
        options.requireNumbers = policy.requireNumbers;
        options.requireSpecial = policy.requireSpecial;
        options.enforceOnLogin = policy.enforceOnLogin;
        return options;
    }
}
exports.MasterPasswordPolicyOptions = MasterPasswordPolicyOptions;
//# sourceMappingURL=master-password-policy-options.js.map