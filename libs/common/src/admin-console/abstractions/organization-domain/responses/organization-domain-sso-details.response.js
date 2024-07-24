"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDomainSsoDetailsResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class OrganizationDomainSsoDetailsResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("id");
        this.organizationIdentifier = this.getResponseProperty("organizationIdentifier");
        this.ssoAvailable = this.getResponseProperty("ssoAvailable");
        this.domainName = this.getResponseProperty("domainName");
        this.verifiedDate = this.getResponseProperty("verifiedDate");
    }
}
exports.OrganizationDomainSsoDetailsResponse = OrganizationDomainSsoDetailsResponse;
//# sourceMappingURL=organization-domain-sso-details.response.js.map