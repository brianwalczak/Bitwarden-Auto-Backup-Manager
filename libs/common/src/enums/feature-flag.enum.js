"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFeatureFlagValue = exports.FeatureFlag = void 0;
/**
 * Feature flags.
 *
 * Flags MUST be short lived and SHALL be removed once enabled.
 */
var FeatureFlag;
(function (FeatureFlag) {
    FeatureFlag["BrowserFilelessImport"] = "browser-fileless-import";
    FeatureFlag["ItemShare"] = "item-share";
    FeatureFlag["FlexibleCollectionsV1"] = "flexible-collections-v-1";
    FeatureFlag["GeneratorToolsModernization"] = "generator-tools-modernization";
    FeatureFlag["ShowPaymentMethodWarningBanners"] = "show-payment-method-warning-banners";
    FeatureFlag["EnableConsolidatedBilling"] = "enable-consolidated-billing";
    FeatureFlag["AC1795_UpdatedSubscriptionStatusSection"] = "AC-1795_updated-subscription-status-section";
    FeatureFlag["EnableDeleteProvider"] = "AC-1218-delete-provider";
    FeatureFlag["ExtensionRefresh"] = "extension-refresh";
    FeatureFlag["RestrictProviderAccess"] = "restrict-provider-access";
    FeatureFlag["PM4154_BulkEncryptionService"] = "PM-4154-bulk-encryption-service";
    FeatureFlag["UseTreeWalkerApiForPageDetailsCollection"] = "use-tree-walker-api-for-page-details-collection";
    FeatureFlag["EmailVerification"] = "email-verification";
    FeatureFlag["InlineMenuFieldQualification"] = "inline-menu-field-qualification";
    FeatureFlag["MemberAccessReport"] = "ac-2059-member-access-report";
    FeatureFlag["TwoFactorComponentRefactor"] = "two-factor-component-refactor";
    FeatureFlag["EnableTimeThreshold"] = "PM-5864-dollar-threshold";
    FeatureFlag["InlineMenuPositioningImprovements"] = "inline-menu-positioning-improvements";
    FeatureFlag["GroupsComponentRefactor"] = "groups-component-refactor";
    FeatureFlag["ProviderClientVaultPrivacyBanner"] = "ac-2833-provider-client-vault-privacy-banner";
    FeatureFlag["VaultBulkManagementAction"] = "vault-bulk-management-action";
    FeatureFlag["AC2828_ProviderPortalMembersPage"] = "AC-2828_provider-portal-members-page";
})(FeatureFlag || (exports.FeatureFlag = FeatureFlag = {}));
// Helper to ensure the value is treated as a boolean.
const FALSE = false;
/**
 * Default value for feature flags.
 *
 * DO NOT enable previously disabled flags, REMOVE them instead.
 * We support true as a value as we prefer flags to "enable" not "disable".
 */
exports.DefaultFeatureFlagValue = {
    [FeatureFlag.BrowserFilelessImport]: FALSE,
    [FeatureFlag.ItemShare]: FALSE,
    [FeatureFlag.FlexibleCollectionsV1]: FALSE,
    [FeatureFlag.GeneratorToolsModernization]: FALSE,
    [FeatureFlag.ShowPaymentMethodWarningBanners]: FALSE,
    [FeatureFlag.EnableConsolidatedBilling]: FALSE,
    [FeatureFlag.AC1795_UpdatedSubscriptionStatusSection]: FALSE,
    [FeatureFlag.EnableDeleteProvider]: FALSE,
    [FeatureFlag.ExtensionRefresh]: FALSE,
    [FeatureFlag.RestrictProviderAccess]: FALSE,
    [FeatureFlag.PM4154_BulkEncryptionService]: FALSE,
    [FeatureFlag.UseTreeWalkerApiForPageDetailsCollection]: FALSE,
    [FeatureFlag.EmailVerification]: FALSE,
    [FeatureFlag.InlineMenuFieldQualification]: FALSE,
    [FeatureFlag.MemberAccessReport]: FALSE,
    [FeatureFlag.TwoFactorComponentRefactor]: FALSE,
    [FeatureFlag.EnableTimeThreshold]: FALSE,
    [FeatureFlag.InlineMenuPositioningImprovements]: FALSE,
    [FeatureFlag.GroupsComponentRefactor]: FALSE,
    [FeatureFlag.ProviderClientVaultPrivacyBanner]: FALSE,
    [FeatureFlag.VaultBulkManagementAction]: FALSE,
    [FeatureFlag.AC2828_ProviderPortalMembersPage]: FALSE,
};
//# sourceMappingURL=feature-flag.enum.js.map