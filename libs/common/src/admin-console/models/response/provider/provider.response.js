"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class ProviderResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.name = this.getResponseProperty("Name");
        this.businessName = this.getResponseProperty("BusinessName");
        this.billingEmail = this.getResponseProperty("BillingEmail");
        this.creationDate = this.getResponseProperty("CreationDate");
        this.type = this.getResponseProperty("Type");
    }
}
exports.ProviderResponse = ProviderResponse;
//# sourceMappingURL=provider.response.js.map