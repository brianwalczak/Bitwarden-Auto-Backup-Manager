"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorEmailResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TwoFactorEmailResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        this.email = this.getResponseProperty("Email");
    }
}
exports.TwoFactorEmailResponse = TwoFactorEmailResponse;
//# sourceMappingURL=two-factor-email.response.js.map