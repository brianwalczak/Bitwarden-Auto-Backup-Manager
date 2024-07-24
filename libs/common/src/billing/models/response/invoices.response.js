"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceResponse = exports.InvoicesResponse = void 0;
const base_response_1 = require("@bitwarden/common/models/response/base.response");
class InvoicesResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.invoices = [];
        const invoices = this.getResponseProperty("Invoices");
        if (invoices && invoices.length) {
            this.invoices = invoices.map((t) => new InvoiceResponse(t));
        }
    }
}
exports.InvoicesResponse = InvoicesResponse;
class InvoiceResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.date = this.getResponseProperty("Date");
        this.number = this.getResponseProperty("Number");
        this.total = this.getResponseProperty("Total");
        this.status = this.getResponseProperty("Status");
        this.dueDate = this.getResponseProperty("DueDate");
        this.url = this.getResponseProperty("Url");
    }
}
exports.InvoiceResponse = InvoiceResponse;
//# sourceMappingURL=invoices.response.js.map