"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class RegisterResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.captchaBypassToken = this.getResponseProperty("CaptchaBypassToken");
    }
}
exports.RegisterResponse = RegisterResponse;
//# sourceMappingURL=register.response.js.map