"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saml2SigningBehavior = exports.Saml2NameIdFormat = exports.Saml2BindingType = exports.OpenIdConnectRedirectBehavior = exports.MemberDecryptionType = exports.SsoType = void 0;
var SsoType;
(function (SsoType) {
    SsoType[SsoType["None"] = 0] = "None";
    SsoType[SsoType["OpenIdConnect"] = 1] = "OpenIdConnect";
    SsoType[SsoType["Saml2"] = 2] = "Saml2";
})(SsoType || (exports.SsoType = SsoType = {}));
var MemberDecryptionType;
(function (MemberDecryptionType) {
    MemberDecryptionType[MemberDecryptionType["MasterPassword"] = 0] = "MasterPassword";
    MemberDecryptionType[MemberDecryptionType["KeyConnector"] = 1] = "KeyConnector";
    MemberDecryptionType[MemberDecryptionType["TrustedDeviceEncryption"] = 2] = "TrustedDeviceEncryption";
})(MemberDecryptionType || (exports.MemberDecryptionType = MemberDecryptionType = {}));
var OpenIdConnectRedirectBehavior;
(function (OpenIdConnectRedirectBehavior) {
    OpenIdConnectRedirectBehavior[OpenIdConnectRedirectBehavior["RedirectGet"] = 0] = "RedirectGet";
    OpenIdConnectRedirectBehavior[OpenIdConnectRedirectBehavior["FormPost"] = 1] = "FormPost";
})(OpenIdConnectRedirectBehavior || (exports.OpenIdConnectRedirectBehavior = OpenIdConnectRedirectBehavior = {}));
var Saml2BindingType;
(function (Saml2BindingType) {
    Saml2BindingType[Saml2BindingType["HttpRedirect"] = 1] = "HttpRedirect";
    Saml2BindingType[Saml2BindingType["HttpPost"] = 2] = "HttpPost";
})(Saml2BindingType || (exports.Saml2BindingType = Saml2BindingType = {}));
var Saml2NameIdFormat;
(function (Saml2NameIdFormat) {
    Saml2NameIdFormat[Saml2NameIdFormat["NotConfigured"] = 0] = "NotConfigured";
    Saml2NameIdFormat[Saml2NameIdFormat["Unspecified"] = 1] = "Unspecified";
    Saml2NameIdFormat[Saml2NameIdFormat["EmailAddress"] = 2] = "EmailAddress";
    Saml2NameIdFormat[Saml2NameIdFormat["X509SubjectName"] = 3] = "X509SubjectName";
    Saml2NameIdFormat[Saml2NameIdFormat["WindowsDomainQualifiedName"] = 4] = "WindowsDomainQualifiedName";
    Saml2NameIdFormat[Saml2NameIdFormat["KerberosPrincipalName"] = 5] = "KerberosPrincipalName";
    Saml2NameIdFormat[Saml2NameIdFormat["EntityIdentifier"] = 6] = "EntityIdentifier";
    Saml2NameIdFormat[Saml2NameIdFormat["Persistent"] = 7] = "Persistent";
    Saml2NameIdFormat[Saml2NameIdFormat["Transient"] = 8] = "Transient";
})(Saml2NameIdFormat || (exports.Saml2NameIdFormat = Saml2NameIdFormat = {}));
var Saml2SigningBehavior;
(function (Saml2SigningBehavior) {
    Saml2SigningBehavior[Saml2SigningBehavior["IfIdpWantAuthnRequestsSigned"] = 0] = "IfIdpWantAuthnRequestsSigned";
    Saml2SigningBehavior[Saml2SigningBehavior["Always"] = 1] = "Always";
    Saml2SigningBehavior[Saml2SigningBehavior["Never"] = 3] = "Never";
})(Saml2SigningBehavior || (exports.Saml2SigningBehavior = Saml2SigningBehavior = {}));
//# sourceMappingURL=sso.js.map