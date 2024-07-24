"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebauthnRotateCredentialRequest = void 0;
class WebauthnRotateCredentialRequest {
    constructor(id, encryptedPublicKey, encryptedUserKey) {
        this.id = id;
        this.encryptedPublicKey = encryptedPublicKey;
        this.encryptedUserKey = encryptedUserKey;
    }
    static fromRotateableKeyset(id, keyset) {
        return new WebauthnRotateCredentialRequest(id, keyset.encryptedPublicKey, keyset.encryptedPrivateKey);
    }
}
exports.WebauthnRotateCredentialRequest = WebauthnRotateCredentialRequest;
//# sourceMappingURL=webauthn-rotate-credential.request.js.map