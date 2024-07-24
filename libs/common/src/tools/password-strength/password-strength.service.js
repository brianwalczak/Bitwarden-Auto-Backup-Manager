"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordStrengthService = void 0;
const zxcvbn = require("zxcvbn");
class PasswordStrengthService {
    /**
     * Calculates a password strength score using zxcvbn.
     * @param password The password to calculate the strength of.
     * @param emailInput An unparsed email address to use as user input.
     * @param userInputs An array of additional user inputs to use when calculating the strength.
     */
    getPasswordStrength(password, emailInput = null, userInputs = null) {
        if (password == null || password.length === 0) {
            return null;
        }
        const globalUserInputs = [
            "bitwarden",
            "bit",
            "warden",
            ...(userInputs !== null && userInputs !== void 0 ? userInputs : []),
            ...this.emailToUserInputs(emailInput),
        ];
        // Use a hash set to get rid of any duplicate user inputs
        const finalUserInputs = Array.from(new Set(globalUserInputs));
        const result = zxcvbn(password, finalUserInputs);
        return result;
    }
    /**
     * Convert an email address into a list of user inputs for zxcvbn by
     * taking the local part of the email address and splitting it into words.
     * @param email
     * @private
     */
    emailToUserInputs(email) {
        if (email == null || email.length === 0) {
            return [];
        }
        const atPosition = email.indexOf("@");
        if (atPosition < 0) {
            return [];
        }
        return email
            .substring(0, atPosition)
            .trim()
            .toLowerCase()
            .split(/[^A-Za-z0-9]/);
    }
}
exports.PasswordStrengthService = PasswordStrengthService;
//# sourceMappingURL=password-strength.service.js.map