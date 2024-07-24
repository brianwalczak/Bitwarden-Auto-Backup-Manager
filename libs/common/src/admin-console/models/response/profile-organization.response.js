"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileOrganizationResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const permissions_api_1 = require("../api/permissions.api");
class ProfileOrganizationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        var _a, _b, _c, _d;
        super(response);
        this.id = this.getResponseProperty("Id");
        this.name = this.getResponseProperty("Name");
        this.usePolicies = this.getResponseProperty("UsePolicies");
        this.useGroups = this.getResponseProperty("UseGroups");
        this.useDirectory = this.getResponseProperty("UseDirectory");
        this.useEvents = this.getResponseProperty("UseEvents");
        this.useTotp = this.getResponseProperty("UseTotp");
        this.use2fa = this.getResponseProperty("Use2fa");
        this.useApi = this.getResponseProperty("UseApi");
        this.useSso = this.getResponseProperty("UseSso");
        this.useKeyConnector = (_a = this.getResponseProperty("UseKeyConnector")) !== null && _a !== void 0 ? _a : false;
        this.useScim = (_b = this.getResponseProperty("UseScim")) !== null && _b !== void 0 ? _b : false;
        this.useCustomPermissions = (_c = this.getResponseProperty("UseCustomPermissions")) !== null && _c !== void 0 ? _c : false;
        this.useResetPassword = this.getResponseProperty("UseResetPassword");
        this.useSecretsManager = this.getResponseProperty("UseSecretsManager");
        this.usePasswordManager = this.getResponseProperty("UsePasswordManager");
        this.useActivateAutofillPolicy = this.getResponseProperty("UseActivateAutofillPolicy");
        this.selfHost = this.getResponseProperty("SelfHost");
        this.usersGetPremium = this.getResponseProperty("UsersGetPremium");
        this.seats = this.getResponseProperty("Seats");
        this.maxCollections = this.getResponseProperty("MaxCollections");
        this.maxStorageGb = this.getResponseProperty("MaxStorageGb");
        this.key = this.getResponseProperty("Key");
        this.hasPublicAndPrivateKeys = this.getResponseProperty("HasPublicAndPrivateKeys");
        this.status = this.getResponseProperty("Status");
        this.type = this.getResponseProperty("Type");
        this.enabled = this.getResponseProperty("Enabled");
        this.ssoBound = this.getResponseProperty("SsoBound");
        this.identifier = this.getResponseProperty("Identifier");
        this.permissions = new permissions_api_1.PermissionsApi(this.getResponseProperty("permissions"));
        this.resetPasswordEnrolled = this.getResponseProperty("ResetPasswordEnrolled");
        this.userId = this.getResponseProperty("UserId");
        this.organizationUserId = this.getResponseProperty("OrganizationUserId");
        this.providerId = this.getResponseProperty("ProviderId");
        this.providerName = this.getResponseProperty("ProviderName");
        this.providerType = this.getResponseProperty("ProviderType");
        this.familySponsorshipFriendlyName = this.getResponseProperty("FamilySponsorshipFriendlyName");
        this.familySponsorshipAvailable = this.getResponseProperty("FamilySponsorshipAvailable");
        this.productTierType = this.getResponseProperty("ProductTierType");
        this.keyConnectorEnabled = (_d = this.getResponseProperty("KeyConnectorEnabled")) !== null && _d !== void 0 ? _d : false;
        this.keyConnectorUrl = this.getResponseProperty("KeyConnectorUrl");
        const familySponsorshipLastSyncDateString = this.getResponseProperty("FamilySponsorshipLastSyncDate");
        if (familySponsorshipLastSyncDateString) {
            this.familySponsorshipLastSyncDate = new Date(familySponsorshipLastSyncDateString);
        }
        const familySponsorshipValidUntilString = this.getResponseProperty("FamilySponsorshipValidUntil");
        if (familySponsorshipValidUntilString) {
            this.familySponsorshipValidUntil = new Date(familySponsorshipValidUntilString);
        }
        this.familySponsorshipToDelete = this.getResponseProperty("FamilySponsorshipToDelete");
        this.accessSecretsManager = this.getResponseProperty("AccessSecretsManager");
        this.limitCollectionCreationDeletion = this.getResponseProperty("LimitCollectionCreationDeletion");
        this.allowAdminAccessToAllCollectionItems = this.getResponseProperty("AllowAdminAccessToAllCollectionItems");
        this.flexibleCollections = this.getResponseProperty("FlexibleCollections");
    }
}
exports.ProfileOrganizationResponse = ProfileOrganizationResponse;
//# sourceMappingURL=profile-organization.response.js.map