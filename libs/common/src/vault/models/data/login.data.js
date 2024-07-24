"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginData = void 0;
const fido2_credential_data_1 = require("./fido2-credential.data");
const login_uri_data_1 = require("./login-uri.data");
class LoginData {
    constructor(data) {
        var _a;
        if (data == null) {
            return;
        }
        this.username = data.username;
        this.password = data.password;
        this.passwordRevisionDate = data.passwordRevisionDate;
        this.totp = data.totp;
        this.autofillOnPageLoad = data.autofillOnPageLoad;
        if (data.uris) {
            this.uris = data.uris.map((u) => new login_uri_data_1.LoginUriData(u));
        }
        if (data.fido2Credentials) {
            this.fido2Credentials = (_a = data.fido2Credentials) === null || _a === void 0 ? void 0 : _a.map((key) => new fido2_credential_data_1.Fido2CredentialData(key));
        }
    }
}
exports.LoginData = LoginData;
//# sourceMappingURL=login.data.js.map