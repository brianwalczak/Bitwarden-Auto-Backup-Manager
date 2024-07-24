"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileProviderOrganizationResponse = void 0;
const profile_organization_response_1 = require("./profile-organization.response");
class ProfileProviderOrganizationResponse extends profile_organization_response_1.ProfileOrganizationResponse {
    constructor(response) {
        super(response);
        this.keyConnectorEnabled = false;
    }
}
exports.ProfileProviderOrganizationResponse = ProfileProviderOrganizationResponse;
//# sourceMappingURL=profile-provider-organization.response.js.map