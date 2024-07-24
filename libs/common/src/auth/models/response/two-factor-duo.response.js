"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorDuoResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TwoFactorDuoResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        this.host = this.getResponseProperty("Host");
        this.clientSecret = this.getResponseProperty("ClientSecret");
        this.clientId = this.getResponseProperty("ClientId");
    }
}
exports.TwoFactorDuoResponse = TwoFactorDuoResponse;
//# sourceMappingURL=two-factor-duo.response.js.map