"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaskedPaymentMethodResponse = void 0;
const base_response_1 = require("@bitwarden/common/models/response/base.response");
class MaskedPaymentMethodResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty("Type");
        this.description = this.getResponseProperty("Description");
        this.needsVerification = this.getResponseProperty("NeedsVerification");
    }
}
exports.MaskedPaymentMethodResponse = MaskedPaymentMethodResponse;
//# sourceMappingURL=masked-payment-method.response.js.map