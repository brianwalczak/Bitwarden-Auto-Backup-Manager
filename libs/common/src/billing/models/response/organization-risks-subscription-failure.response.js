"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRisksSubscriptionFailureResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationRisksSubscriptionFailureResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.risksSubscriptionFailure = this.getResponseProperty("RisksSubscriptionFailure");
    }
}
exports.OrganizationRisksSubscriptionFailureResponse = OrganizationRisksSubscriptionFailureResponse;
//# sourceMappingURL=organization-risks-subscription-failure.response.js.map