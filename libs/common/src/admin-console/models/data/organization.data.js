"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationData = void 0;
class OrganizationData {
    constructor(response, options) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.name = response.name;
        this.status = response.status;
        this.type = response.type;
        this.enabled = response.enabled;
        this.usePolicies = response.usePolicies;
        this.useGroups = response.useGroups;
        this.useDirectory = response.useDirectory;
        this.useEvents = response.useEvents;
        this.useTotp = response.useTotp;
        this.use2fa = response.use2fa;
        this.useApi = response.useApi;
        this.useSso = response.useSso;
        this.useKeyConnector = response.useKeyConnector;
        this.useScim = response.useScim;
        this.useCustomPermissions = response.useCustomPermissions;
        this.useResetPassword = response.useResetPassword;
        this.useSecretsManager = response.useSecretsManager;
        this.usePasswordManager = response.usePasswordManager;
        this.useActivateAutofillPolicy = response.useActivateAutofillPolicy;
        this.selfHost = response.selfHost;
        this.usersGetPremium = response.usersGetPremium;
        this.seats = response.seats;
        this.maxCollections = response.maxCollections;
        this.maxStorageGb = response.maxStorageGb;
        this.ssoBound = response.ssoBound;
        this.identifier = response.identifier;
        this.permissions = response.permissions;
        this.resetPasswordEnrolled = response.resetPasswordEnrolled;
        this.userId = response.userId;
        this.organizationUserId = response.organizationUserId;
        this.hasPublicAndPrivateKeys = response.hasPublicAndPrivateKeys;
        this.providerId = response.providerId;
        this.providerName = response.providerName;
        this.providerType = response.providerType;
        this.familySponsorshipFriendlyName = response.familySponsorshipFriendlyName;
        this.familySponsorshipAvailable = response.familySponsorshipAvailable;
        this.productTierType = response.productTierType;
        this.keyConnectorEnabled = response.keyConnectorEnabled;
        this.keyConnectorUrl = response.keyConnectorUrl;
        this.familySponsorshipLastSyncDate = response.familySponsorshipLastSyncDate;
        this.familySponsorshipValidUntil = response.familySponsorshipValidUntil;
        this.familySponsorshipToDelete = response.familySponsorshipToDelete;
        this.accessSecretsManager = response.accessSecretsManager;
        this.limitCollectionCreationDeletion = response.limitCollectionCreationDeletion;
        this.allowAdminAccessToAllCollectionItems = response.allowAdminAccessToAllCollectionItems;
        this.flexibleCollections = response.flexibleCollections;
        this.isMember = options.isMember;
        this.isProviderUser = options.isProviderUser;
    }
    static fromJSON(obj) {
        return Object.assign(new OrganizationData(), obj, {
            familySponsorshipLastSyncDate: obj.familySponsorshipLastSyncDate != null
                ? new Date(obj.familySponsorshipLastSyncDate)
                : obj.familySponsorshipLastSyncDate,
            familySponsorshipValidUntil: obj.familySponsorshipValidUntil != null
                ? new Date(obj.familySponsorshipValidUntil)
                : obj.familySponsorshipValidUntil,
        });
    }
}
exports.OrganizationData = OrganizationData;
//# sourceMappingURL=organization.data.js.map