"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordTokenRequest = void 0;
const utils_1 = require("../../../../platform/misc/utils");
const device_request_1 = require("./device.request");
const token_two_factor_request_1 = require("./token-two-factor.request");
const token_request_1 = require("./token.request");
class PasswordTokenRequest extends token_request_1.TokenRequest {
    constructor(email, masterPasswordHash, captchaResponse, twoFactor, device) {
        super(twoFactor, device);
        this.email = email;
        this.masterPasswordHash = masterPasswordHash;
        this.captchaResponse = captchaResponse;
        this.twoFactor = twoFactor;
    }
    toIdentityToken(clientId) {
        const obj = super.toIdentityToken(clientId);
        obj.grant_type = "password";
        obj.username = this.email;
        obj.password = this.masterPasswordHash;
        if (this.captchaResponse != null) {
            obj.captchaResponse = this.captchaResponse;
        }
        return obj;
    }
    alterIdentityTokenHeaders(headers) {
        headers.set("Auth-Email", utils_1.Utils.fromUtf8ToUrlB64(this.email));
    }
    static fromJSON(json) {
        return Object.assign(Object.create(PasswordTokenRequest.prototype), json, {
            device: json.device ? device_request_1.DeviceRequest.fromJSON(json.device) : undefined,
            twoFactor: json.twoFactor
                ? Object.assign(new token_two_factor_request_1.TokenTwoFactorRequest(), json.twoFactor)
                : undefined,
        });
    }
}
exports.PasswordTokenRequest = PasswordTokenRequest;
//# sourceMappingURL=password-token.request.js.map