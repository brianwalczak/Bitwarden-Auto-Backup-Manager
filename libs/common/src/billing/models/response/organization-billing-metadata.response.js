"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBillingMetadataResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationBillingMetadataResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.isOnSecretsManagerStandalone = this.getResponseProperty("IsOnSecretsManagerStandalone");
    }
}
exports.OrganizationBillingMetadataResponse = OrganizationBillingMetadataResponse;
//# sourceMappingURL=organization-billing-metadata.response.js.map