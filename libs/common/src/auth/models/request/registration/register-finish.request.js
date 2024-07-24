"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFinishRequest = void 0;
class RegisterFinishRequest {
    constructor(email, emailVerificationToken, masterPasswordHash, masterPasswordHint, userSymmetricKey, userAsymmetricKeys, kdf, kdfIterations, kdfMemory, kdfParallelism, 
    // Org Invite data (only applies on web)
    organizationUserId, orgInviteToken) {
        this.email = email;
        this.emailVerificationToken = emailVerificationToken;
        this.masterPasswordHash = masterPasswordHash;
        this.masterPasswordHint = masterPasswordHint;
        this.userSymmetricKey = userSymmetricKey;
        this.userAsymmetricKeys = userAsymmetricKeys;
        this.kdf = kdf;
        this.kdfIterations = kdfIterations;
        this.kdfMemory = kdfMemory;
        this.kdfParallelism = kdfParallelism;
        this.organizationUserId = organizationUserId;
        this.orgInviteToken = orgInviteToken;
    }
}
exports.RegisterFinishRequest = RegisterFinishRequest;
//# sourceMappingURL=register-finish.request.js.map