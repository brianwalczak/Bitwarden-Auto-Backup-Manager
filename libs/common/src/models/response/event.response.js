"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventResponse = void 0;
const base_response_1 = require("./base.response");
class EventResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty("Type");
        this.userId = this.getResponseProperty("UserId");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.providerId = this.getResponseProperty("ProviderId");
        this.cipherId = this.getResponseProperty("CipherId");
        this.collectionId = this.getResponseProperty("CollectionId");
        this.groupId = this.getResponseProperty("GroupId");
        this.policyId = this.getResponseProperty("PolicyId");
        this.organizationUserId = this.getResponseProperty("OrganizationUserId");
        this.providerUserId = this.getResponseProperty("ProviderUserId");
        this.providerOrganizationId = this.getResponseProperty("ProviderOrganizationId");
        this.actingUserId = this.getResponseProperty("ActingUserId");
        this.date = this.getResponseProperty("Date");
        this.deviceType = this.getResponseProperty("DeviceType");
        this.ipAddress = this.getResponseProperty("IpAddress");
        this.installationId = this.getResponseProperty("InstallationId");
        this.systemUser = this.getResponseProperty("SystemUser");
        this.domainName = this.getResponseProperty("DomainName");
        this.secretId = this.getResponseProperty("SecretId");
        this.serviceAccountId = this.getResponseProperty("ServiceAccountId");
    }
}
exports.EventResponse = EventResponse;
//# sourceMappingURL=event.response.js.map