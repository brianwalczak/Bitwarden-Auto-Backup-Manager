"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policies = void 0;
const passphrase_1 = require("./passphrase");
const passphrase_generator_policy_1 = require("./passphrase/passphrase-generator-policy");
const password_1 = require("./password");
const password_generator_policy_1 = require("./password/password-generator-policy");
const PASSPHRASE = Object.freeze({
    disabledValue: passphrase_generator_policy_1.DisabledPassphraseGeneratorPolicy,
    combine: passphrase_generator_policy_1.leastPrivilege,
    createEvaluator: (policy) => new passphrase_1.PassphraseGeneratorOptionsEvaluator(policy),
});
const PASSWORD = Object.freeze({
    disabledValue: password_generator_policy_1.DisabledPasswordGeneratorPolicy,
    combine: password_generator_policy_1.leastPrivilege,
    createEvaluator: (policy) => new password_1.PasswordGeneratorOptionsEvaluator(policy),
});
/** Policy configurations */
exports.Policies = Object.freeze({
    /** Passphrase policy configuration */
    Passphrase: PASSPHRASE,
    /** Passphrase policy configuration */
    Password: PASSWORD,
});
//# sourceMappingURL=policies.js.map