"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityCaptchaResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class IdentityCaptchaResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.siteKey = this.getResponseProperty("HCaptcha_SiteKey");
    }
}
exports.IdentityCaptchaResponse = IdentityCaptchaResponse;
//# sourceMappingURL=identity-captcha.response.js.map