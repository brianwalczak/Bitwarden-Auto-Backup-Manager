"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordGeneratorPolicyOptions = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
/** Enterprise policy for the password generator.
 * @see PolicyType.PasswordGenerator
 */
class PasswordGeneratorPolicyOptions extends domain_base_1.default {
    constructor() {
        super(...arguments);
        /** The default kind of credential to generate */
        this.defaultType = "";
        /** The minimum length of generated passwords.
         *  When this is less than or equal to zero, it is ignored.
         *  If this is less than the total number of characters required by
         *  the policy's other settings, then it is ignored.
         *  This field is not used for passphrases.
         */
        this.minLength = 0;
        /** When this is true, an uppercase character must be part of
         *  the generated password.
         *  This field is not used for passphrases.
         */
        this.useUppercase = false;
        /** When this is true, a lowercase character must be part of
         *  the generated password. This field is not used for passphrases.
         */
        this.useLowercase = false;
        /** When this is true, at least one digit must be part of the generated
         *  password. This field is not used for passphrases.
         */
        this.useNumbers = false;
        /** The quantity of digits to include in the generated password.
         *  When this is less than or equal to zero, it is ignored.
         *  This field is not used for passphrases.
         */
        this.numberCount = 0;
        /** When this is true, at least one digit must be part of the generated
         *  password. This field is not used for passphrases.
         */
        this.useSpecial = false;
        /** The quantity of special characters to include in the generated
         *  password. When this is less than or equal to zero, it is ignored.
         *  This field is not used for passphrases.
         */
        this.specialCount = 0;
        /** The minimum number of words required by generated passphrases.
         *  This field is not used for passwords.
         */
        this.minNumberWords = 0;
        /** When this is true, the first letter of each word in the passphrase
         *  is capitalized. This field is not used for passwords.
         */
        this.capitalize = false;
        /** When this is true, a number is included within the passphrase.
         *  This field is not used for passwords.
         */
        this.includeNumber = false;
    }
    /** Checks whether the policy affects the password generator.
     * @returns True if at least one password or passphrase requirement has been set.
     * If it returns False, then no requirements have been set and the policy should
     * not be enforced.
     */
    inEffect() {
        return (this.defaultType ||
            this.minLength > 0 ||
            this.numberCount > 0 ||
            this.specialCount > 0 ||
            this.useUppercase ||
            this.useLowercase ||
            this.useNumbers ||
            this.useSpecial ||
            this.minNumberWords > 0 ||
            this.capitalize ||
            this.includeNumber);
    }
    /** Creates a copy of the policy.
     */
    clone() {
        const policy = new PasswordGeneratorPolicyOptions();
        Object.assign(policy, this);
        return policy;
    }
}
exports.PasswordGeneratorPolicyOptions = PasswordGeneratorPolicyOptions;
//# sourceMappingURL=password-generator-policy-options.js.map