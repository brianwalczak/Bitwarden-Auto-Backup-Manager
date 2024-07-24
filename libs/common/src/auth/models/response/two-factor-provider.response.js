"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorProviderResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TwoFactorProviderResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        this.type = this.getResponseProperty("Type");
    }
}
exports.TwoFactorProviderResponse = TwoFactorProviderResponse;
//# sourceMappingURL=two-factor-provider.response.js.map