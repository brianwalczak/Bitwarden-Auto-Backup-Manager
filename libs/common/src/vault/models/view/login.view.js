"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginView = void 0;
const utils_1 = require("../../../platform/misc/utils");
const enums_1 = require("../../enums");
const linked_field_option_decorator_1 = require("../../linked-field-option.decorator");
const fido2_credential_view_1 = require("./fido2-credential.view");
const item_view_1 = require("./item.view");
const login_uri_view_1 = require("./login-uri.view");
class LoginView extends item_view_1.ItemView {
    constructor(l) {
        super();
        this.username = null;
        this.password = null;
        this.passwordRevisionDate = null;
        this.totp = null;
        this.uris = [];
        this.autofillOnPageLoad = null;
        this.fido2Credentials = null;
        if (!l) {
            return;
        }
        this.passwordRevisionDate = l.passwordRevisionDate;
        this.autofillOnPageLoad = l.autofillOnPageLoad;
    }
    get uri() {
        return this.hasUris ? this.uris[0].uri : null;
    }
    get maskedPassword() {
        return this.password != null ? "••••••••" : null;
    }
    get subTitle() {
        var _a;
        // if there's a passkey available, use that as a fallback
        if (utils_1.Utils.isNullOrEmpty(this.username) && ((_a = this.fido2Credentials) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return this.fido2Credentials[0].userName;
        }
        return this.username;
    }
    get canLaunch() {
        return this.hasUris && this.uris.some((u) => u.canLaunch);
    }
    get hasTotp() {
        return !utils_1.Utils.isNullOrWhitespace(this.totp);
    }
    get launchUri() {
        if (this.hasUris) {
            const uri = this.uris.find((u) => u.canLaunch);
            if (uri != null) {
                return uri.launchUri;
            }
        }
        return null;
    }
    get hasUris() {
        return this.uris != null && this.uris.length > 0;
    }
    get hasFido2Credentials() {
        return this.fido2Credentials != null && this.fido2Credentials.length > 0;
    }
    matchesUri(targetUri, equivalentDomains, defaultUriMatch = null) {
        if (this.uris == null) {
            return false;
        }
        return this.uris.some((uri) => uri.matchesUri(targetUri, equivalentDomains, defaultUriMatch));
    }
    static fromJSON(obj) {
        var _a;
        const passwordRevisionDate = obj.passwordRevisionDate == null ? null : new Date(obj.passwordRevisionDate);
        const uris = obj.uris.map((uri) => login_uri_view_1.LoginUriView.fromJSON(uri));
        const fido2Credentials = (_a = obj.fido2Credentials) === null || _a === void 0 ? void 0 : _a.map((key) => fido2_credential_view_1.Fido2CredentialView.fromJSON(key));
        return Object.assign(new LoginView(), obj, {
            passwordRevisionDate,
            uris,
            fido2Credentials,
        });
    }
}
exports.LoginView = LoginView;
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.LoginLinkedId.Username),
    __metadata("design:type", String)
], LoginView.prototype, "username", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.LoginLinkedId.Password),
    __metadata("design:type", String)
], LoginView.prototype, "password", void 0);
//# sourceMappingURL=login.view.js.map