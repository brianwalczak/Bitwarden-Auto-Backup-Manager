"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDomainResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class OrganizationDomainResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("id");
        this.organizationId = this.getResponseProperty("organizationId");
        this.txt = this.getResponseProperty("txt");
        this.domainName = this.getResponseProperty("domainName");
        this.creationDate = this.getResponseProperty("creationDate");
        this.nextRunDate = this.getResponseProperty("nextRunDate");
        this.jobRunCount = this.getResponseProperty("jobRunCount");
        this.verifiedDate = this.getResponseProperty("verifiedDate");
        this.lastCheckedDate = this.getResponseProperty("lastCheckedDate");
    }
}
exports.OrganizationDomainResponse = OrganizationDomainResponse;
//# sourceMappingURL=organization-domain.response.js.map