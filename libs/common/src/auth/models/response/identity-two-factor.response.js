"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityTwoFactorResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const master_password_policy_response_1 = require("./master-password-policy.response");
class IdentityTwoFactorResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.captchaToken = this.getResponseProperty("CaptchaBypassToken");
        this.twoFactorProviders = this.getResponseProperty("TwoFactorProviders");
        this.twoFactorProviders2 = this.getResponseProperty("TwoFactorProviders2");
        this.masterPasswordPolicy = new master_password_policy_response_1.MasterPasswordPolicyResponse(this.getResponseProperty("MasterPasswordPolicy"));
        this.ssoEmail2faSessionToken = this.getResponseProperty("SsoEmail2faSessionToken");
        this.email = this.getResponseProperty("Email");
    }
}
exports.IdentityTwoFactorResponse = IdentityTwoFactorResponse;
//# sourceMappingURL=identity-two-factor.response.js.map