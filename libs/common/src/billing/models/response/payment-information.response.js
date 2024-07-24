"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentInformationResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const masked_payment_method_response_1 = require("./masked-payment-method.response");
const tax_info_response_1 = require("./tax-info.response");
class PaymentInformationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.accountCredit = this.getResponseProperty("AccountCredit");
        const paymentMethod = this.getResponseProperty("PaymentMethod");
        if (paymentMethod) {
            this.paymentMethod = new masked_payment_method_response_1.MaskedPaymentMethodResponse(paymentMethod);
        }
        const taxInformation = this.getResponseProperty("TaxInformation");
        if (taxInformation) {
            this.taxInformation = new tax_info_response_1.TaxInfoResponse(taxInformation);
        }
    }
}
exports.PaymentInformationResponse = PaymentInformationResponse;
//# sourceMappingURL=payment-information.response.js.map