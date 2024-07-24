"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApiTokenRequest = void 0;
const device_request_1 = require("./device.request");
const token_two_factor_request_1 = require("./token-two-factor.request");
const token_request_1 = require("./token.request");
class UserApiTokenRequest extends token_request_1.TokenRequest {
    constructor(clientId, clientSecret, twoFactor, device) {
        super(twoFactor, device);
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.twoFactor = twoFactor;
    }
    toIdentityToken() {
        const obj = super.toIdentityToken(this.clientId);
        obj.scope = this.clientId.startsWith("organization") ? "api.organization" : "api";
        obj.grant_type = "client_credentials";
        obj.client_secret = this.clientSecret;
        return obj;
    }
    static fromJSON(json) {
        return Object.assign(Object.create(UserApiTokenRequest.prototype), json, {
            device: json.device ? device_request_1.DeviceRequest.fromJSON(json.device) : undefined,
            twoFactor: json.twoFactor
                ? Object.assign(new token_two_factor_request_1.TokenTwoFactorRequest(), json.twoFactor)
                : undefined,
        });
    }
}
exports.UserApiTokenRequest = UserApiTokenRequest;
//# sourceMappingURL=user-api-token.request.js.map