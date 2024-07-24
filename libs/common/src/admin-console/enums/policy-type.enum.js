"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyType = void 0;
var PolicyType;
(function (PolicyType) {
    PolicyType[PolicyType["TwoFactorAuthentication"] = 0] = "TwoFactorAuthentication";
    PolicyType[PolicyType["MasterPassword"] = 1] = "MasterPassword";
    PolicyType[PolicyType["PasswordGenerator"] = 2] = "PasswordGenerator";
    PolicyType[PolicyType["SingleOrg"] = 3] = "SingleOrg";
    PolicyType[PolicyType["RequireSso"] = 4] = "RequireSso";
    PolicyType[PolicyType["PersonalOwnership"] = 5] = "PersonalOwnership";
    PolicyType[PolicyType["DisableSend"] = 6] = "DisableSend";
    PolicyType[PolicyType["SendOptions"] = 7] = "SendOptions";
    PolicyType[PolicyType["ResetPassword"] = 8] = "ResetPassword";
    PolicyType[PolicyType["MaximumVaultTimeout"] = 9] = "MaximumVaultTimeout";
    PolicyType[PolicyType["DisablePersonalVaultExport"] = 10] = "DisablePersonalVaultExport";
    PolicyType[PolicyType["ActivateAutofill"] = 11] = "ActivateAutofill";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
//# sourceMappingURL=policy-type.enum.js.map