"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const profile_response_1 = require("../../../models/response/profile.response");
class PaymentResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        const userProfile = this.getResponseProperty("UserProfile");
        if (userProfile != null) {
            this.userProfile = new profile_response_1.ProfileResponse(userProfile);
        }
        this.paymentIntentClientSecret = this.getResponseProperty("PaymentIntentClientSecret");
        this.success = this.getResponseProperty("Success");
    }
}
exports.PaymentResponse = PaymentResponse;
//# sourceMappingURL=payment.response.js.map