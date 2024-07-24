"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRequest = void 0;
class TokenRequest {
    constructor(twoFactor, device) {
        this.twoFactor = twoFactor;
        this.device = device != null ? device : null;
    }
    // eslint-disable-next-line
    alterIdentityTokenHeaders(headers) {
        // Implemented in subclass if required
    }
    setTwoFactor(twoFactor) {
        this.twoFactor = twoFactor;
    }
    setAuthRequestAccessCode(accessCode) {
        this.authRequest = accessCode;
    }
    toIdentityToken(clientId) {
        const obj = {
            scope: "api offline_access",
            client_id: clientId,
        };
        if (this.device) {
            obj.deviceType = this.device.type;
            obj.deviceIdentifier = this.device.identifier;
            obj.deviceName = this.device.name;
            // no push tokens for browser apps yet
            // obj.devicePushToken = this.device.pushToken;
        }
        //passswordless login
        if (this.authRequest) {
            obj.authRequest = this.authRequest;
        }
        if (this.twoFactor) {
            if (this.twoFactor.token && this.twoFactor.provider != null) {
                obj.twoFactorToken = this.twoFactor.token;
                obj.twoFactorProvider = this.twoFactor.provider;
                obj.twoFactorRemember = this.twoFactor.remember ? "1" : "0";
            }
        }
        return obj;
    }
}
exports.TokenRequest = TokenRequest;
//# sourceMappingURL=token.request.js.map