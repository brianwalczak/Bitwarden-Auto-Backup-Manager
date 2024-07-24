"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = exports.ORGANIZATIONS = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../../platform/state");
const organization_data_1 = require("../../models/data/organization.data");
const organization_1 = require("../../models/domain/organization");
/**
 * The `KeyDefinition` for accessing organization lists in application state.
 * @todo Ideally this wouldn't require a `fromJSON()` call, but `OrganizationData`
 * has some properties that contain functions. This should probably get
 * cleaned up.
 */
exports.ORGANIZATIONS = state_1.UserKeyDefinition.record(state_1.ORGANIZATIONS_DISK, "organizations", {
    deserializer: (obj) => organization_data_1.OrganizationData.fromJSON(obj),
    clearOn: ["logout"],
});
/**
 * Filter out organizations from an observable that __do not__ offer a
 * families-for-enterprise sponsorship to members.
 * @returns a function that can be used in `Observable<Organization[]>` pipes,
 * like `organizationService.organizations$`
 */
function mapToExcludeOrganizationsWithoutFamilySponsorshipSupport() {
    return (0, rxjs_1.map)((orgs) => orgs.filter((o) => o.canManageSponsorships));
}
/**
 * Filter out organizations from an observable that the organization user
 * __is not__ a direct member of. This will exclude organizations only
 * accessible as a provider.
 * @returns a function that can be used in `Observable<Organization[]>` pipes,
 * like `organizationService.organizations$`
 */
function mapToExcludeProviderOrganizations() {
    return (0, rxjs_1.map)((orgs) => orgs.filter((o) => o.isMember));
}
/**
 * Map an observable stream of organizations down to a boolean indicating
 * if any organizations exist (`orgs.length > 0`).
 * @returns a function that can be used in `Observable<Organization[]>` pipes,
 * like `organizationService.organizations$`
 */
function mapToBooleanHasAnyOrganizations() {
    return (0, rxjs_1.map)((orgs) => orgs.length > 0);
}
/**
 * Map an observable stream of organizations down to a single organization.
 * @param `organizationId` The ID of the organization you'd like to subscribe to
 * @returns a function that can be used in `Observable<Organization[]>` pipes,
 * like `organizationService.organizations$`
 */
function mapToSingleOrganization(organizationId) {
    return (0, rxjs_1.map)((orgs) => orgs === null || orgs === void 0 ? void 0 : orgs.find((o) => o.id === organizationId));
}
class OrganizationService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.organizations$ = this.getOrganizationsFromState$();
        this.memberOrganizations$ = this.organizations$.pipe(mapToExcludeProviderOrganizations());
        this.canManageSponsorships$ = this.organizations$.pipe(mapToExcludeOrganizationsWithoutFamilySponsorshipSupport(), mapToBooleanHasAnyOrganizations());
    }
    get$(id) {
        return this.organizations$.pipe(mapToSingleOrganization(id));
    }
    getAll$(userId) {
        return this.getOrganizationsFromState$(userId);
    }
    getAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.getOrganizationsFromState$(userId));
        });
    }
    hasOrganizations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.organizations$.pipe(mapToBooleanHasAnyOrganizations()));
        });
    }
    upsert(organization, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateFor(userId).update((existingOrganizations) => {
                const organizations = existingOrganizations !== null && existingOrganizations !== void 0 ? existingOrganizations : {};
                organizations[organization.id] = organization;
                return organizations;
            });
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.organizations$.pipe(mapToSingleOrganization(id)));
        });
    }
    /**
     * @deprecated For the CLI only
     * @param id id of the organization
     */
    getFromState(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.organizations$.pipe(mapToSingleOrganization(id)));
        });
    }
    replace(organizations, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateFor(userId).update(() => organizations);
        });
    }
    // Ideally this method would be renamed to organizations$() and the
    // $organizations observable as it stands would be removed. This will
    // require updates to callers, and so this method exists as a temporary
    // workaround until we have time & a plan to update callers.
    //
    // It can be thought of as "organizations$ but with a userId option".
    getOrganizationsFromState$(userId) {
        return this.stateFor(userId).state$.pipe(this.mapOrganizationRecordToArray());
    }
    /**
     * Accepts a record of `OrganizationData`, which is how we store the
     * organization list as a JSON object on disk, to an array of
     * `Organization`, which is how the data is published to callers of the
     * service.
     * @returns a function that can be used to pipe organization data from
     * stored state to an exposed object easily consumable by others.
     */
    mapOrganizationRecordToArray() {
        return (0, rxjs_1.map)((orgs) => { var _a; return (_a = Object.values(orgs !== null && orgs !== void 0 ? orgs : {})) === null || _a === void 0 ? void 0 : _a.map((o) => new organization_1.Organization(o)); });
    }
    /**
     * Fetches the organization list from on disk state for the specified user.
     * @param userId the user ID to fetch the organization list for. Defaults to
     * the currently active user.
     * @returns an observable of organization state as it is stored on disk.
     */
    stateFor(userId) {
        return userId
            ? this.stateProvider.getUser(userId, exports.ORGANIZATIONS)
            : this.stateProvider.getActive(exports.ORGANIZATIONS);
    }
}
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map