"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
const fido2_credential_api_1 = require("./fido2-credential.api");
const login_uri_api_1 = require("./login-uri.api");
class LoginApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.username = this.getResponseProperty("Username");
        this.password = this.getResponseProperty("Password");
        this.passwordRevisionDate = this.getResponseProperty("PasswordRevisionDate");
        this.totp = this.getResponseProperty("Totp");
        this.autofillOnPageLoad = this.getResponseProperty("AutofillOnPageLoad");
        const uris = this.getResponseProperty("Uris");
        if (uris != null) {
            this.uris = uris.map((u) => new login_uri_api_1.LoginUriApi(u));
        }
        const fido2Credentials = this.getResponseProperty("Fido2Credentials");
        if (fido2Credentials != null) {
            this.fido2Credentials = fido2Credentials.map((key) => new fido2_credential_api_1.Fido2CredentialApi(key));
        }
    }
}
exports.LoginApi = LoginApi;
//# sourceMappingURL=login.api.js.map