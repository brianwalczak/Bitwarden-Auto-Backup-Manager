"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsoPreValidateResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class SsoPreValidateResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.token = this.getResponseProperty("Token");
    }
}
exports.SsoPreValidateResponse = SsoPreValidateResponse;
//# sourceMappingURL=sso-pre-validate.response.js.map