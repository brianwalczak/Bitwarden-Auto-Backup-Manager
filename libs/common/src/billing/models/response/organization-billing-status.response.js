"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBillingStatusResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationBillingStatusResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.organizationName = this.getResponseProperty("OrganizationName");
        this.risksSubscriptionFailure = this.getResponseProperty("RisksSubscriptionFailure");
    }
}
exports.OrganizationBillingStatusResponse = OrganizationBillingStatusResponse;
//# sourceMappingURL=organization-billing-status.response.js.map