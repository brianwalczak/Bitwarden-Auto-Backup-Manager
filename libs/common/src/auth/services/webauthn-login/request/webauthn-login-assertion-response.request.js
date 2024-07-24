"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnLoginAssertionResponseRequest = void 0;
const utils_1 = require("../../../../platform/misc/utils");
const webauthn_login_response_request_1 = require("./webauthn-login-response.request");
class WebAuthnLoginAssertionResponseRequest extends webauthn_login_response_request_1.WebAuthnLoginResponseRequest {
    constructor(credential) {
        super(credential);
        if (!(credential.response instanceof AuthenticatorAssertionResponse)) {
            throw new Error("Invalid authenticator response");
        }
        this.response = {
            authenticatorData: utils_1.Utils.fromBufferToUrlB64(credential.response.authenticatorData),
            signature: utils_1.Utils.fromBufferToUrlB64(credential.response.signature),
            clientDataJSON: utils_1.Utils.fromBufferToUrlB64(credential.response.clientDataJSON),
            userHandle: utils_1.Utils.fromBufferToUrlB64(credential.response.userHandle),
        };
    }
    static fromJSON(json) {
        return Object.assign(Object.create(WebAuthnLoginAssertionResponseRequest.prototype), json);
    }
}
exports.WebAuthnLoginAssertionResponseRequest = WebAuthnLoginAssertionResponseRequest;
//# sourceMappingURL=webauthn-login-assertion-response.request.js.map