"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingTransactionResponse = exports.BillingInvoiceResponse = exports.BillingSourceResponse = exports.BillingResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class BillingResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.balance = this.getResponseProperty("Balance");
        const paymentSource = this.getResponseProperty("PaymentSource");
        this.paymentSource = paymentSource == null ? null : new BillingSourceResponse(paymentSource);
    }
}
exports.BillingResponse = BillingResponse;
class BillingSourceResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty("Type");
        this.cardBrand = this.getResponseProperty("CardBrand");
        this.description = this.getResponseProperty("Description");
        this.needsVerification = this.getResponseProperty("NeedsVerification");
    }
}
exports.BillingSourceResponse = BillingSourceResponse;
class BillingInvoiceResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.url = this.getResponseProperty("Url");
        this.pdfUrl = this.getResponseProperty("PdfUrl");
        this.number = this.getResponseProperty("Number");
        this.paid = this.getResponseProperty("Paid");
        this.date = this.getResponseProperty("Date");
        this.amount = this.getResponseProperty("Amount");
    }
}
exports.BillingInvoiceResponse = BillingInvoiceResponse;
class BillingTransactionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.createdDate = this.getResponseProperty("CreatedDate");
        this.amount = this.getResponseProperty("Amount");
        this.refunded = this.getResponseProperty("Refunded");
        this.partiallyRefunded = this.getResponseProperty("PartiallyRefunded");
        this.refundedAmount = this.getResponseProperty("RefundedAmount");
        this.type = this.getResponseProperty("Type");
        this.paymentMethodType = this.getResponseProperty("PaymentMethodType");
        this.details = this.getResponseProperty("Details");
    }
}
exports.BillingTransactionResponse = BillingTransactionResponse;
//# sourceMappingURL=billing.response.js.map