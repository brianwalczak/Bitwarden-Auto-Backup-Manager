"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileResponse = void 0;
const profile_organization_response_1 = require("../../admin-console/models/response/profile-organization.response");
const profile_provider_organization_response_1 = require("../../admin-console/models/response/profile-provider-organization.response");
const profile_provider_response_1 = require("../../admin-console/models/response/profile-provider.response");
const base_response_1 = require("./base.response");
class ProfileResponse extends base_response_1.BaseResponse {
    constructor(response) {
        var _a, _b;
        super(response);
        this.organizations = [];
        this.providers = [];
        this.providerOrganizations = [];
        this.id = this.getResponseProperty("Id");
        this.name = this.getResponseProperty("Name");
        this.email = this.getResponseProperty("Email");
        this.emailVerified = this.getResponseProperty("EmailVerified");
        this.masterPasswordHint = this.getResponseProperty("MasterPasswordHint");
        this.premiumPersonally = this.getResponseProperty("Premium");
        this.premiumFromOrganization = this.getResponseProperty("PremiumFromOrganization");
        this.culture = this.getResponseProperty("Culture");
        this.twoFactorEnabled = this.getResponseProperty("TwoFactorEnabled");
        this.key = this.getResponseProperty("Key");
        this.avatarColor = this.getResponseProperty("AvatarColor");
        this.creationDate = this.getResponseProperty("CreationDate");
        this.privateKey = this.getResponseProperty("PrivateKey");
        this.securityStamp = this.getResponseProperty("SecurityStamp");
        this.forcePasswordReset = (_a = this.getResponseProperty("ForcePasswordReset")) !== null && _a !== void 0 ? _a : false;
        this.usesKeyConnector = (_b = this.getResponseProperty("UsesKeyConnector")) !== null && _b !== void 0 ? _b : false;
        const organizations = this.getResponseProperty("Organizations");
        if (organizations != null) {
            this.organizations = organizations.map((o) => new profile_organization_response_1.ProfileOrganizationResponse(o));
        }
        const providers = this.getResponseProperty("Providers");
        if (providers != null) {
            this.providers = providers.map((o) => new profile_provider_response_1.ProfileProviderResponse(o));
        }
        const providerOrganizations = this.getResponseProperty("ProviderOrganizations");
        if (providerOrganizations != null) {
            this.providerOrganizations = providerOrganizations.map((o) => new profile_provider_organization_response_1.ProfileProviderOrganizationResponse(o));
        }
    }
}
exports.ProfileResponse = ProfileResponse;
//# sourceMappingURL=profile.response.js.map