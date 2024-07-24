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
exports.WebAuthnLoginService = void 0;
const common_1 = require("@bitwarden/auth/common");
const webauthn_login_credential_assertion_options_view_1 = require("../../models/view/webauthn-login/webauthn-login-credential-assertion-options.view");
const webauthn_login_credential_assertion_view_1 = require("../../models/view/webauthn-login/webauthn-login-credential-assertion.view");
const webauthn_login_assertion_response_request_1 = require("./request/webauthn-login-assertion-response.request");
class WebAuthnLoginService {
    constructor(webAuthnLoginApiService, loginStrategyService, webAuthnLoginPrfCryptoService, window, logService) {
        this.webAuthnLoginApiService = webAuthnLoginApiService;
        this.loginStrategyService = loginStrategyService;
        this.webAuthnLoginPrfCryptoService = webAuthnLoginPrfCryptoService;
        this.window = window;
        this.logService = logService;
        this.navigatorCredentials = this.window.navigator.credentials;
    }
    getCredentialAssertionOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.webAuthnLoginApiService.getCredentialAssertionOptions();
            return new webauthn_login_credential_assertion_options_view_1.WebAuthnLoginCredentialAssertionOptionsView(response.options, response.token);
        });
    }
    assertCredential(credentialAssertionOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const nativeOptions = {
                publicKey: credentialAssertionOptions.options,
            };
            // TODO: Remove `any` when typescript typings add support for PRF
            nativeOptions.publicKey.extensions = {
                prf: { eval: { first: yield this.webAuthnLoginPrfCryptoService.getLoginWithPrfSalt() } },
            };
            try {
                const response = yield this.navigatorCredentials.get(nativeOptions);
                if (!(response instanceof PublicKeyCredential)) {
                    return undefined;
                }
                // TODO: Remove `any` when typescript typings add support for PRF
                const prfResult = (_b = (_a = response.getClientExtensionResults().prf) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.first;
                let symmetricPrfKey;
                if (prfResult != undefined) {
                    symmetricPrfKey =
                        yield this.webAuthnLoginPrfCryptoService.createSymmetricKeyFromPrf(prfResult);
                }
                const deviceResponse = new webauthn_login_assertion_response_request_1.WebAuthnLoginAssertionResponseRequest(response);
                // Verify that we aren't going to send PRF information to the server in any case.
                // Note: this will only happen if a dev has done something wrong.
                if ("prf" in deviceResponse.extensions) {
                    throw new Error("PRF information is not allowed to be sent to the server.");
                }
                return new webauthn_login_credential_assertion_view_1.WebAuthnLoginCredentialAssertionView(credentialAssertionOptions.token, deviceResponse, symmetricPrfKey);
            }
            catch (error) {
                (_c = this.logService) === null || _c === void 0 ? void 0 : _c.error(error);
                return undefined;
            }
        });
    }
    logIn(assertion) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = new common_1.WebAuthnLoginCredentials(assertion.token, assertion.deviceResponse, assertion.prfKey);
            const result = yield this.loginStrategyService.logIn(credential);
            return result;
        });
    }
}
exports.WebAuthnLoginService = WebAuthnLoginService;
//# sourceMappingURL=webauthn-login.service.js.map