"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnLoginTokenRequest = void 0;
const webauthn_login_assertion_response_request_1 = require("../../../services/webauthn-login/request/webauthn-login-assertion-response.request");
const device_request_1 = require("./device.request");
const token_two_factor_request_1 = require("./token-two-factor.request");
const token_request_1 = require("./token.request");
class WebAuthnLoginTokenRequest extends token_request_1.TokenRequest {
    constructor(token, deviceResponse, device) {
        super(undefined, device);
        this.token = token;
        this.deviceResponse = deviceResponse;
    }
    toIdentityToken(clientId) {
        const obj = super.toIdentityToken(clientId);
        obj.grant_type = "webauthn";
        obj.token = this.token;
        // must be a string b/c sending as form encoded data
        obj.deviceResponse = JSON.stringify(this.deviceResponse);
        return obj;
    }
    static fromJSON(json) {
        return Object.assign(Object.create(WebAuthnLoginTokenRequest.prototype), json, {
            deviceResponse: webauthn_login_assertion_response_request_1.WebAuthnLoginAssertionResponseRequest.fromJSON(json.deviceResponse),
            device: json.device ? device_request_1.DeviceRequest.fromJSON(json.device) : undefined,
            twoFactor: json.twoFactor
                ? Object.assign(new token_two_factor_request_1.TokenTwoFactorRequest(), json.twoFactor)
                : undefined,
        });
    }
}
exports.WebAuthnLoginTokenRequest = WebAuthnLoginTokenRequest;
//# sourceMappingURL=webauthn-login-token.request.js.map