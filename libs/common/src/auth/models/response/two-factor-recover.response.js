"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorRecoverResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TwoFactorRecoverResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.code = this.getResponseProperty("Code");
    }
}
exports.TwoFactorRecoverResponse = TwoFactorRecoverResponse;
//# sourceMappingURL=two-factor-recover.response.js.map