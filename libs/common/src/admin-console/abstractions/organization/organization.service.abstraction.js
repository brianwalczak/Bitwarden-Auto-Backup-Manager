"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalOrganizationServiceAbstraction = exports.OrganizationService = void 0;
exports.canAccessVaultTab = canAccessVaultTab;
exports.canAccessSettingsTab = canAccessSettingsTab;
exports.canAccessMembersTab = canAccessMembersTab;
exports.canAccessGroupsTab = canAccessGroupsTab;
exports.canAccessReportingTab = canAccessReportingTab;
exports.canAccessBillingTab = canAccessBillingTab;
exports.canAccessOrgAdmin = canAccessOrgAdmin;
exports.getOrganizationById = getOrganizationById;
exports.canAccessAdmin = canAccessAdmin;
exports.canAccessImportExport = canAccessImportExport;
exports.canAccessImport = canAccessImport;
exports.isMember = isMember;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../../platform/misc/utils");
function canAccessVaultTab(org) {
    return org.canViewAllCollections;
}
function canAccessSettingsTab(org) {
    return (org.isOwner ||
        org.canManagePolicies ||
        org.canManageSso ||
        org.canManageScim ||
        org.canAccessImportExport ||
        org.canManageDeviceApprovals);
}
function canAccessMembersTab(org) {
    return org.canManageUsers || org.canManageUsersPassword;
}
function canAccessGroupsTab(org) {
    return org.canManageGroups;
}
function canAccessReportingTab(org) {
    return org.canAccessReports || org.canAccessEventLogs;
}
function canAccessBillingTab(org) {
    return org.isOwner;
}
function canAccessOrgAdmin(org) {
    // Admin console can only be accessed by Owners for disabled organizations
    if (!org.enabled && !org.isOwner) {
        return false;
    }
    return (canAccessMembersTab(org) ||
        canAccessGroupsTab(org) ||
        canAccessReportingTab(org) ||
        canAccessBillingTab(org) ||
        canAccessSettingsTab(org) ||
        canAccessVaultTab(org));
}
function getOrganizationById(id) {
    return (0, rxjs_1.map)((orgs) => orgs.find((o) => o.id === id));
}
function canAccessAdmin(i18nService) {
    return (0, rxjs_1.map)((orgs) => orgs.filter(canAccessOrgAdmin).sort(utils_1.Utils.getSortFunction(i18nService, "name")));
}
/**
 * @deprecated
 * To be removed after Flexible Collections.
 **/
function canAccessImportExport(i18nService) {
    return (0, rxjs_1.map)((orgs) => orgs
        .filter((org) => org.canAccessImportExport)
        .sort(utils_1.Utils.getSortFunction(i18nService, "name")));
}
function canAccessImport(i18nService) {
    return (0, rxjs_1.map)((orgs) => orgs
        .filter((org) => org.canAccessImportExport || org.canCreateNewCollections)
        .sort(utils_1.Utils.getSortFunction(i18nService, "name")));
}
/**
 * Returns `true` if a user is a member of an organization (rather than only being a ProviderUser)
 * @deprecated Use organizationService.organizations$ with a filter instead
 */
function isMember(org) {
    return org.isMember;
}
/**
 * Publishes an observable stream of organizations. This service is meant to
 * be used widely across Bitwarden as the primary way of fetching organizations.
 * Risky operations like updates are isolated to the
 * internal extension `InternalOrganizationServiceAbstraction`.
 */
class OrganizationService {
}
exports.OrganizationService = OrganizationService;
/**
 * Big scary buttons that **update** organization state. These should only be
 * called from within admin-console scoped code. Extends the base
 * `OrganizationService` for easy access to `get` calls.
 * @internal
 */
class InternalOrganizationServiceAbstraction extends OrganizationService {
}
exports.InternalOrganizationServiceAbstraction = InternalOrganizationServiceAbstraction;
//# sourceMappingURL=organization.service.abstraction.js.map