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
exports.DefaultBillingAccountProfileStateService = exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../../platform/state");
exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION = new state_1.UserKeyDefinition(state_1.BILLING_DISK, "accountProfile", {
    deserializer: (billingAccountProfile) => billingAccountProfile,
    clearOn: ["logout"],
});
class DefaultBillingAccountProfileStateService {
    constructor(stateProvider) {
        this.billingAccountProfileState = stateProvider.getActive(exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION);
        // Setup an observable that will always track the currently active user
        // but will fallback to emitting null when there is no active user.
        const billingAccountProfileOrNull = stateProvider.activeUserId$.pipe((0, rxjs_1.switchMap)((userId) => userId != null
            ? stateProvider.getUser(userId, exports.BILLING_ACCOUNT_PROFILE_KEY_DEFINITION).state$
            : (0, rxjs_1.of)(null)));
        this.hasPremiumFromAnyOrganization$ = billingAccountProfileOrNull.pipe((0, rxjs_1.map)((billingAccountProfile) => !!(billingAccountProfile === null || billingAccountProfile === void 0 ? void 0 : billingAccountProfile.hasPremiumFromAnyOrganization)));
        this.hasPremiumPersonally$ = billingAccountProfileOrNull.pipe((0, rxjs_1.map)((billingAccountProfile) => !!(billingAccountProfile === null || billingAccountProfile === void 0 ? void 0 : billingAccountProfile.hasPremiumPersonally)));
        this.hasPremiumFromAnySource$ = billingAccountProfileOrNull.pipe((0, rxjs_1.map)((billingAccountProfile) => (billingAccountProfile === null || billingAccountProfile === void 0 ? void 0 : billingAccountProfile.hasPremiumFromAnyOrganization) === true ||
            (billingAccountProfile === null || billingAccountProfile === void 0 ? void 0 : billingAccountProfile.hasPremiumPersonally) === true));
    }
    setHasPremium(hasPremiumPersonally, hasPremiumFromAnyOrganization) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.billingAccountProfileState.update((billingAccountProfile) => {
                return {
                    hasPremiumPersonally: hasPremiumPersonally,
                    hasPremiumFromAnyOrganization: hasPremiumFromAnyOrganization,
                };
            });
        });
    }
}
exports.DefaultBillingAccountProfileStateService = DefaultBillingAccountProfileStateService;
//# sourceMappingURL=billing-account-profile-state.service.js.map