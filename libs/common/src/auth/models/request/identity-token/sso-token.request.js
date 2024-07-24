"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsoTokenRequest = void 0;
const device_request_1 = require("./device.request");
const token_two_factor_request_1 = require("./token-two-factor.request");
const token_request_1 = require("./token.request");
class SsoTokenRequest extends token_request_1.TokenRequest {
    constructor(code, codeVerifier, redirectUri, twoFactor, device) {
        super(twoFactor, device);
        this.code = code;
        this.codeVerifier = codeVerifier;
        this.redirectUri = redirectUri;
        this.twoFactor = twoFactor;
    }
    toIdentityToken(clientId) {
        const obj = super.toIdentityToken(clientId);
        obj.grant_type = "authorization_code";
        obj.code = this.code;
        obj.code_verifier = this.codeVerifier;
        obj.redirect_uri = this.redirectUri;
        return obj;
    }
    static fromJSON(json) {
        return Object.assign(Object.create(SsoTokenRequest.prototype), json, {
            device: json.device ? device_request_1.DeviceRequest.fromJSON(json.device) : undefined,
            twoFactor: json.twoFactor
                ? Object.assign(new token_two_factor_request_1.TokenTwoFactorRequest(), json.twoFactor)
                : undefined,
        });
    }
}
exports.SsoTokenRequest = SsoTokenRequest;
//# sourceMappingURL=sso-token.request.js.map