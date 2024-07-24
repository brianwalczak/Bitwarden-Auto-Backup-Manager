"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxInfoResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TaxInfoResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.taxId = this.getResponseProperty("TaxIdNumber");
        if (!this.taxId) {
            this.taxId = this.getResponseProperty("TaxId");
        }
        this.taxIdType = this.getResponseProperty("TaxIdType");
        this.line1 = this.getResponseProperty("Line1");
        this.line2 = this.getResponseProperty("Line2");
        this.city = this.getResponseProperty("City");
        this.state = this.getResponseProperty("State");
        this.postalCode = this.getResponseProperty("PostalCode");
        this.country = this.getResponseProperty("Country");
    }
}
exports.TaxInfoResponse = TaxInfoResponse;
//# sourceMappingURL=tax-info.response.js.map