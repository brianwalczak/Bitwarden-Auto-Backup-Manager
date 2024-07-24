"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderOrganizationOrganizationDetailsResponse = exports.ProviderOrganizationResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class ProviderOrganizationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.providerId = this.getResponseProperty("ProviderId");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.key = this.getResponseProperty("Key");
        this.settings = this.getResponseProperty("Settings");
        this.creationDate = this.getResponseProperty("CreationDate");
        this.revisionDate = this.getResponseProperty("RevisionDate");
        this.userCount = this.getResponseProperty("UserCount");
        this.seats = this.getResponseProperty("Seats");
        this.occupiedSeats = this.getResponseProperty("OccupiedSeats");
        this.remainingSeats = this.getResponseProperty("RemainingSeats");
        this.plan = this.getResponseProperty("Plan");
    }
}
exports.ProviderOrganizationResponse = ProviderOrganizationResponse;
class ProviderOrganizationOrganizationDetailsResponse extends ProviderOrganizationResponse {
    constructor(response) {
        super(response);
        this.organizationName = this.getResponseProperty("OrganizationName");
    }
}
exports.ProviderOrganizationOrganizationDetailsResponse = ProviderOrganizationOrganizationDetailsResponse;
//# sourceMappingURL=provider-organization.response.js.map