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
exports.PolicyService = exports.POLICIES = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../../platform/state");
const enums_1 = require("../../enums");
const master_password_policy_options_1 = require("../../models/domain/master-password-policy-options");
const policy_1 = require("../../models/domain/policy");
const reset_password_policy_options_1 = require("../../models/domain/reset-password-policy-options");
const policyRecordToArray = (policiesMap) => Object.values(policiesMap || {}).map((f) => new policy_1.Policy(f));
exports.POLICIES = state_1.UserKeyDefinition.record(state_1.POLICIES_DISK, "policies", {
    deserializer: (policyData) => policyData,
    clearOn: ["logout"],
});
class PolicyService {
    constructor(stateProvider, organizationService) {
        this.stateProvider = stateProvider;
        this.organizationService = organizationService;
        this.activeUserPolicyState = this.stateProvider.getActive(exports.POLICIES);
        this.activeUserPolicies$ = this.activeUserPolicyState.state$.pipe((0, rxjs_1.map)((policyData) => policyRecordToArray(policyData)));
        this.policies$ = this.activeUserPolicies$;
    }
    get$(policyType) {
        const filteredPolicies$ = this.activeUserPolicies$.pipe((0, rxjs_1.map)((policies) => policies.filter((p) => p.type === policyType)));
        return (0, rxjs_1.combineLatest)([filteredPolicies$, this.organizationService.organizations$]).pipe((0, rxjs_1.map)(([policies, organizations]) => { var _a, _b; return (_b = (_a = this.enforcedPolicyFilter(policies, organizations)) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : null; }));
    }
    getAll$(policyType, userId) {
        const filteredPolicies$ = this.stateProvider.getUserState$(exports.POLICIES, userId).pipe((0, rxjs_1.map)((policyData) => policyRecordToArray(policyData)), (0, rxjs_1.map)((policies) => policies.filter((p) => p.type === policyType)));
        return (0, rxjs_1.combineLatest)([filteredPolicies$, this.organizationService.getAll$(userId)]).pipe((0, rxjs_1.map)(([policies, organizations]) => this.enforcedPolicyFilter(policies, organizations)));
    }
    getAll(policyType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.policies$.pipe((0, rxjs_1.map)((policies) => policies.filter((p) => p.type === policyType))));
        });
    }
    policyAppliesToActiveUser$(policyType) {
        return this.get$(policyType).pipe((0, rxjs_1.map)((policy) => policy != null));
    }
    policyAppliesToUser(policyType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.policyAppliesToActiveUser$(policyType));
        });
    }
    enforcedPolicyFilter(policies, organizations) {
        const orgDict = Object.fromEntries(organizations.map((o) => [o.id, o]));
        return policies.filter((policy) => {
            const organization = orgDict[policy.organizationId];
            // This shouldn't happen, i.e. the user should only have policies for orgs they are a member of
            // But if it does, err on the side of enforcing the policy
            if (organization == null) {
                return true;
            }
            return (policy.enabled &&
                organization.status >= enums_1.OrganizationUserStatusType.Accepted &&
                organization.usePolicies &&
                !this.isExemptFromPolicy(policy.type, organization));
        });
    }
    masterPasswordPolicyOptions$(policies) {
        const observable = policies ? (0, rxjs_1.of)(policies) : this.policies$;
        return observable.pipe((0, rxjs_1.map)((obsPolicies) => {
            let enforcedOptions = null;
            const filteredPolicies = obsPolicies.filter((p) => p.type === enums_1.PolicyType.MasterPassword);
            if (filteredPolicies == null || filteredPolicies.length === 0) {
                return enforcedOptions;
            }
            filteredPolicies.forEach((currentPolicy) => {
                if (!currentPolicy.enabled || currentPolicy.data == null) {
                    return;
                }
                if (enforcedOptions == null) {
                    enforcedOptions = new master_password_policy_options_1.MasterPasswordPolicyOptions();
                }
                if (currentPolicy.data.minComplexity != null &&
                    currentPolicy.data.minComplexity > enforcedOptions.minComplexity) {
                    enforcedOptions.minComplexity = currentPolicy.data.minComplexity;
                }
                if (currentPolicy.data.minLength != null &&
                    currentPolicy.data.minLength > enforcedOptions.minLength) {
                    enforcedOptions.minLength = currentPolicy.data.minLength;
                }
                if (currentPolicy.data.requireUpper) {
                    enforcedOptions.requireUpper = true;
                }
                if (currentPolicy.data.requireLower) {
                    enforcedOptions.requireLower = true;
                }
                if (currentPolicy.data.requireNumbers) {
                    enforcedOptions.requireNumbers = true;
                }
                if (currentPolicy.data.requireSpecial) {
                    enforcedOptions.requireSpecial = true;
                }
                if (currentPolicy.data.enforceOnLogin) {
                    enforcedOptions.enforceOnLogin = true;
                }
            });
            return enforcedOptions;
        }));
    }
    evaluateMasterPassword(passwordStrength, newPassword, enforcedPolicyOptions) {
        if (enforcedPolicyOptions == null) {
            return true;
        }
        if (enforcedPolicyOptions.minComplexity > 0 &&
            enforcedPolicyOptions.minComplexity > passwordStrength) {
            return false;
        }
        if (enforcedPolicyOptions.minLength > 0 &&
            enforcedPolicyOptions.minLength > newPassword.length) {
            return false;
        }
        if (enforcedPolicyOptions.requireUpper && newPassword.toLocaleLowerCase() === newPassword) {
            return false;
        }
        if (enforcedPolicyOptions.requireLower && newPassword.toLocaleUpperCase() === newPassword) {
            return false;
        }
        if (enforcedPolicyOptions.requireNumbers && !/[0-9]/.test(newPassword)) {
            return false;
        }
        // eslint-disable-next-line
        if (enforcedPolicyOptions.requireSpecial && !/[!@#$%\^&*]/g.test(newPassword)) {
            return false;
        }
        return true;
    }
    getResetPasswordPolicyOptions(policies, orgId) {
        var _a, _b, _c;
        const resetPasswordPolicyOptions = new reset_password_policy_options_1.ResetPasswordPolicyOptions();
        if (policies == null || orgId == null) {
            return [resetPasswordPolicyOptions, false];
        }
        const policy = policies.find((p) => p.organizationId === orgId && p.type === enums_1.PolicyType.ResetPassword && p.enabled);
        resetPasswordPolicyOptions.autoEnrollEnabled = (_b = (_a = policy === null || policy === void 0 ? void 0 : policy.data) === null || _a === void 0 ? void 0 : _a.autoEnrollEnabled) !== null && _b !== void 0 ? _b : false;
        return [resetPasswordPolicyOptions, (_c = policy === null || policy === void 0 ? void 0 : policy.enabled) !== null && _c !== void 0 ? _c : false];
    }
    upsert(policy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.activeUserPolicyState.update((policies) => {
                policies !== null && policies !== void 0 ? policies : (policies = {});
                policies[policy.id] = policy;
                return policies;
            });
        });
    }
    replace(policies) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.activeUserPolicyState.update(() => policies);
        });
    }
    /**
     * Determines whether an orgUser is exempt from a specific policy because of their role
     * Generally orgUsers who can manage policies are exempt from them, but some policies are stricter
     */
    isExemptFromPolicy(policyType, organization) {
        switch (policyType) {
            case enums_1.PolicyType.MaximumVaultTimeout:
                // Max Vault Timeout applies to everyone except owners
                return organization.isOwner;
            case enums_1.PolicyType.PasswordGenerator:
                // password generation policy applies to everyone
                return false;
            default:
                return organization.canManagePolicies;
        }
    }
}
exports.PolicyService = PolicyService;
//# sourceMappingURL=policy.service.js.map