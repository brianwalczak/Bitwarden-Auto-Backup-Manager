"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingHistoryResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const billing_response_1 = require("./billing.response");
class BillingHistoryResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.invoices = [];
        this.transactions = [];
        const transactions = this.getResponseProperty("Transactions");
        const invoices = this.getResponseProperty("Invoices");
        if (transactions != null) {
            this.transactions = transactions.map((t) => new billing_response_1.BillingTransactionResponse(t));
        }
        if (invoices != null) {
            this.invoices = invoices.map((i) => new billing_response_1.BillingInvoiceResponse(i));
        }
    }
    get hasNoHistory() {
        return this.invoices.length == 0 && this.transactions.length == 0;
    }
}
exports.BillingHistoryResponse = BillingHistoryResponse;
//# sourceMappingURL=billing-history.response.js.map