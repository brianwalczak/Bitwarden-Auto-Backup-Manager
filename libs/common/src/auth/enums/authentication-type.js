"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationType = void 0;
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType[AuthenticationType["Password"] = 0] = "Password";
    AuthenticationType[AuthenticationType["Sso"] = 1] = "Sso";
    AuthenticationType[AuthenticationType["UserApiKey"] = 2] = "UserApiKey";
    AuthenticationType[AuthenticationType["AuthRequest"] = 3] = "AuthRequest";
    AuthenticationType[AuthenticationType["WebAuthn"] = 4] = "WebAuthn";
})(AuthenticationType || (exports.AuthenticationType = AuthenticationType = {}));
//# sourceMappingURL=authentication-type.js.map