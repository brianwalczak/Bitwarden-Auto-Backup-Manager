"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxRateResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TaxRateResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.country = this.getResponseProperty("Country");
        this.state = this.getResponseProperty("State");
        this.postalCode = this.getResponseProperty("PostalCode");
        this.rate = this.getResponseProperty("Rate");
    }
}
exports.TaxRateResponse = TaxRateResponse;
//# sourceMappingURL=tax-rate.response.js.map