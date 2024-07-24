"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthenticatorResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TwoFactorAuthenticatorResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        this.key = this.getResponseProperty("Key");
    }
}
exports.TwoFactorAuthenticatorResponse = TwoFactorAuthenticatorResponse;
//# sourceMappingURL=two-factor-authenticator.response.js.map