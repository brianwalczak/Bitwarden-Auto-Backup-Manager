"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResult = void 0;
const utils_1 = require("../../../platform/misc/utils");
const force_set_password_reason_1 = require("./force-set-password-reason");
class AuthResult {
    constructor() {
        this.captchaSiteKey = "";
        // TODO: PM-3287 - Remove this after 3 releases of backwards compatibility. - Target release 2023.12 for removal
        /**
         * @deprecated
         * Replace with using UserDecryptionOptions to determine if the user does
         * not have a master password and is not using Key Connector.
         * */
        this.resetMasterPassword = false;
        this.forcePasswordReset = force_set_password_reason_1.ForceSetPasswordReason.None;
        this.twoFactorProviders = null;
    }
    get requiresCaptcha() {
        return !utils_1.Utils.isNullOrWhitespace(this.captchaSiteKey);
    }
    get requiresTwoFactor() {
        return this.twoFactorProviders != null;
    }
}
exports.AuthResult = AuthResult;
//# sourceMappingURL=auth-result.js.map