"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const login_1 = require("../../vault/models/domain/login");
const login_view_1 = require("../../vault/models/view/login.view");
const fido2_credential_export_1 = require("./fido2-credential.export");
const login_uri_export_1 = require("./login-uri.export");
const utils_1 = require("./utils");
class LoginExport {
    static template() {
        const req = new LoginExport();
        req.uris = [];
        req.username = "jdoe";
        req.password = "myp@ssword123";
        req.totp = "JBSWY3DPEHPK3PXP";
        req.fido2Credentials = [fido2_credential_export_1.Fido2CredentialExport.template()];
        return req;
    }
    static toView(req, view = new login_view_1.LoginView()) {
        if (req.uris != null) {
            view.uris = req.uris.map((u) => login_uri_export_1.LoginUriExport.toView(u));
        }
        view.username = req.username;
        view.password = req.password;
        view.totp = req.totp;
        if (req.fido2Credentials != null) {
            view.fido2Credentials = req.fido2Credentials.map((key) => fido2_credential_export_1.Fido2CredentialExport.toView(key));
        }
        return view;
    }
    static toDomain(req, domain = new login_1.Login()) {
        if (req.uris != null) {
            domain.uris = req.uris.map((u) => login_uri_export_1.LoginUriExport.toDomain(u));
        }
        domain.username = req.username != null ? new enc_string_1.EncString(req.username) : null;
        domain.password = req.password != null ? new enc_string_1.EncString(req.password) : null;
        domain.totp = req.totp != null ? new enc_string_1.EncString(req.totp) : null;
        // Fido2credentials are currently not supported for exports.
        return domain;
    }
    constructor(o) {
        this.fido2Credentials = [];
        if (o == null) {
            return;
        }
        if (o.uris != null) {
            this.uris = o.uris.map((u) => new login_uri_export_1.LoginUriExport(u));
        }
        if (o.fido2Credentials != null) {
            this.fido2Credentials = o.fido2Credentials.map((key) => new fido2_credential_export_1.Fido2CredentialExport(key));
        }
        this.username = (0, utils_1.safeGetString)(o.username);
        this.password = (0, utils_1.safeGetString)(o.password);
        this.totp = (0, utils_1.safeGetString)(o.totp);
    }
}
exports.LoginExport = LoginExport;
//# sourceMappingURL=login.export.js.map