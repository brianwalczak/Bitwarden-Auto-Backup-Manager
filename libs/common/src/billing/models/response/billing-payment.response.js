"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingPaymentResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const billing_response_1 = require("./billing.response");
class BillingPaymentResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.balance = this.getResponseProperty("Balance");
        const paymentSource = this.getResponseProperty("PaymentSource");
        this.paymentSource = paymentSource == null ? null : new billing_response_1.BillingSourceResponse(paymentSource);
    }
}
exports.BillingPaymentResponse = BillingPaymentResponse;
//# sourceMappingURL=billing-payment.response.js.map