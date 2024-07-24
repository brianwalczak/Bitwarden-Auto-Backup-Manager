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
exports.Login = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const login_data_1 = require("../data/login.data");
const login_view_1 = require("../view/login.view");
const fido2_credential_1 = require("./fido2-credential");
const login_uri_1 = require("./login-uri");
class Login extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.passwordRevisionDate =
            obj.passwordRevisionDate != null ? new Date(obj.passwordRevisionDate) : null;
        this.autofillOnPageLoad = obj.autofillOnPageLoad;
        this.buildDomainModel(this, obj, {
            username: null,
            password: null,
            totp: null,
        }, []);
        if (obj.uris) {
            this.uris = [];
            obj.uris.forEach((u) => {
                this.uris.push(new login_uri_1.LoginUri(u));
            });
        }
        if (obj.fido2Credentials) {
            this.fido2Credentials = obj.fido2Credentials.map((key) => new fido2_credential_1.Fido2Credential(key));
        }
    }
    decrypt(orgId, bypassValidation, encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.decryptObj(new login_view_1.LoginView(this), {
                username: null,
                password: null,
                totp: null,
            }, orgId, encKey);
            if (this.uris != null) {
                view.uris = [];
                for (let i = 0; i < this.uris.length; i++) {
                    // If the uri is null, there is nothing to decrypt or validate
                    if (this.uris[i].uri == null) {
                        continue;
                    }
                    const uri = yield this.uris[i].decrypt(orgId, encKey);
                    // URIs are shared remotely after decryption
                    // we need to validate that the string hasn't been changed by a compromised server
                    // This validation is tied to the existence of cypher.key for backwards compatibility
                    // So we bypass the validation if there's no cipher.key or procceed with the validation and
                    // Skip the value if it's been tampered with.
                    if (bypassValidation || (yield this.uris[i].validateChecksum(uri.uri, orgId, encKey))) {
                        view.uris.push(uri);
                    }
                }
            }
            if (this.fido2Credentials != null) {
                view.fido2Credentials = yield Promise.all(this.fido2Credentials.map((key) => key.decrypt(orgId, encKey)));
            }
            return view;
        });
    }
    toLoginData() {
        const l = new login_data_1.LoginData();
        l.passwordRevisionDate =
            this.passwordRevisionDate != null ? this.passwordRevisionDate.toISOString() : null;
        l.autofillOnPageLoad = this.autofillOnPageLoad;
        this.buildDataModel(this, l, {
            username: null,
            password: null,
            totp: null,
        });
        if (this.uris != null && this.uris.length > 0) {
            l.uris = [];
            this.uris.forEach((u) => {
                l.uris.push(u.toLoginUriData());
            });
        }
        if (this.fido2Credentials != null && this.fido2Credentials.length > 0) {
            l.fido2Credentials = this.fido2Credentials.map((key) => key.toFido2CredentialData());
        }
        return l;
    }
    static fromJSON(obj) {
        var _a, _b, _c;
        if (obj == null) {
            return null;
        }
        const username = enc_string_1.EncString.fromJSON(obj.username);
        const password = enc_string_1.EncString.fromJSON(obj.password);
        const totp = enc_string_1.EncString.fromJSON(obj.totp);
        const passwordRevisionDate = obj.passwordRevisionDate == null ? null : new Date(obj.passwordRevisionDate);
        const uris = (_a = obj.uris) === null || _a === void 0 ? void 0 : _a.map((uri) => login_uri_1.LoginUri.fromJSON(uri));
        const fido2Credentials = (_c = (_b = obj.fido2Credentials) === null || _b === void 0 ? void 0 : _b.map((key) => fido2_credential_1.Fido2Credential.fromJSON(key))) !== null && _c !== void 0 ? _c : [];
        return Object.assign(new Login(), obj, {
            username,
            password,
            totp,
            passwordRevisionDate,
            uris,
            fido2Credentials,
        });
    }
}
exports.Login = Login;
//# sourceMappingURL=login.js.map