"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorProviderType = void 0;
var TwoFactorProviderType;
(function (TwoFactorProviderType) {
    TwoFactorProviderType[TwoFactorProviderType["Authenticator"] = 0] = "Authenticator";
    TwoFactorProviderType[TwoFactorProviderType["Email"] = 1] = "Email";
    TwoFactorProviderType[TwoFactorProviderType["Duo"] = 2] = "Duo";
    TwoFactorProviderType[TwoFactorProviderType["Yubikey"] = 3] = "Yubikey";
    TwoFactorProviderType[TwoFactorProviderType["U2f"] = 4] = "U2f";
    TwoFactorProviderType[TwoFactorProviderType["Remember"] = 5] = "Remember";
    TwoFactorProviderType[TwoFactorProviderType["OrganizationDuo"] = 6] = "OrganizationDuo";
    TwoFactorProviderType[TwoFactorProviderType["WebAuthn"] = 7] = "WebAuthn";
})(TwoFactorProviderType || (exports.TwoFactorProviderType = TwoFactorProviderType = {}));
//# sourceMappingURL=two-factor-provider-type.js.map