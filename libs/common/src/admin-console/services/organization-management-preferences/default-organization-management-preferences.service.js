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
exports.DefaultOrganizationManagementPreferencesService = exports.AUTO_CONFIRM_FINGERPRINTS = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../../platform/state");
const organization_management_preferences_service_1 = require("../../abstractions/organization-management-preferences/organization-management-preferences.service");
/**
 * This helper function can be used to quickly create `KeyDefinitions` that
 * target the `ORGANIZATION_MANAGEMENT_PREFERENCES_DISK` `StateDefinition`
 * and that have the default deserializer and `clearOn` options. Any
 * contenders for options to add to this service will likely use these same
 * options.
 */
function buildKeyDefinition(key) {
    return new state_1.UserKeyDefinition(state_1.ORGANIZATION_MANAGEMENT_PREFERENCES_DISK, key, {
        deserializer: (obj) => obj,
        clearOn: ["logout"],
    });
}
exports.AUTO_CONFIRM_FINGERPRINTS = buildKeyDefinition("autoConfirmFingerPrints");
class DefaultOrganizationManagementPreferencesService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.autoConfirmFingerPrints = this.buildOrganizationManagementPreference(exports.AUTO_CONFIRM_FINGERPRINTS, false);
    }
    /**
     * Returns an `OrganizationManagementPreference` object for the provided
     * `KeyDefinition`. This object can then be used by callers to subscribe to
     * a given key, or set its value in state.
     */
    buildOrganizationManagementPreference(keyDefinition, defaultValue) {
        return new organization_management_preferences_service_1.OrganizationManagementPreference(this.getKeyFromState(keyDefinition).state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : defaultValue)), this.setKeyInStateFn(keyDefinition));
    }
    /**
     * Returns the full `ActiveUserState` value for a given `keyDefinition`
     * The returned value can then be called for subscription || set operations
     */
    getKeyFromState(keyDefinition) {
        return this.stateProvider.getActive(keyDefinition);
    }
    /**
     * Returns a function that can be called to set the given `keyDefinition` in state
     */
    setKeyInStateFn(keyDefinition) {
        return (value) => __awaiter(this, void 0, void 0, function* () {
            yield this.getKeyFromState(keyDefinition).update(() => value);
        });
    }
}
exports.DefaultOrganizationManagementPreferencesService = DefaultOrganizationManagementPreferencesService;
//# sourceMappingURL=default-organization-management-preferences.service.js.map