"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRequest = void 0;
class RegisterRequest {
    constructor(email, name, masterPasswordHash, masterPasswordHint, key, referenceData, captchaResponse, kdf, kdfIterations, kdfMemory, kdfParallelism) {
        this.email = email;
        this.name = name;
        this.masterPasswordHash = masterPasswordHash;
        this.key = key;
        this.referenceData = referenceData;
        this.captchaResponse = captchaResponse;
        this.kdf = kdf;
        this.kdfIterations = kdfIterations;
        this.kdfMemory = kdfMemory;
        this.kdfParallelism = kdfParallelism;
        this.masterPasswordHint = masterPasswordHint ? masterPasswordHint : null;
    }
}
exports.RegisterRequest = RegisterRequest;
//# sourceMappingURL=register.request.js.map