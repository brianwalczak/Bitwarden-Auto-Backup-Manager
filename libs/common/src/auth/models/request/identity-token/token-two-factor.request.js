"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTwoFactorRequest = void 0;
class TokenTwoFactorRequest {
    constructor(provider = null, token = null, remember = false) {
        this.provider = provider;
        this.token = token;
        this.remember = remember;
    }
}
exports.TokenTwoFactorRequest = TokenTwoFactorRequest;
//# sourceMappingURL=token-two-factor.request.js.map