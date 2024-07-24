"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationManagementPreferencesService = exports.OrganizationManagementPreference = void 0;
/**
 * Manages the state of a single organization management preference.
 * Can be used to subscribe to or update a given property.
 */
class OrganizationManagementPreference {
    constructor(state$, setFn) {
        this.state$ = state$;
        this.set = setFn;
    }
}
exports.OrganizationManagementPreference = OrganizationManagementPreference;
/**
 * Publishes state of a given user's personal settings relating to the user experience of managing an organization.
 */
class OrganizationManagementPreferencesService {
}
exports.OrganizationManagementPreferencesService = OrganizationManagementPreferencesService;
//# sourceMappingURL=organization-management-preferences.service.js.map