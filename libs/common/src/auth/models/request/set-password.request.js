"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPasswordRequest = void 0;
class SetPasswordRequest {
    constructor(masterPasswordHash, key, masterPasswordHint, orgIdentifier, keys, kdf, kdfIterations, kdfMemory, kdfParallelism) {
        this.masterPasswordHash = masterPasswordHash;
        this.key = key;
        this.masterPasswordHint = masterPasswordHint;
        this.kdf = kdf;
        this.kdfIterations = kdfIterations;
        this.kdfMemory = kdfMemory;
        this.kdfParallelism = kdfParallelism;
        this.orgIdentifier = orgIdentifier;
        this.keys = keys;
    }
}
exports.SetPasswordRequest = SetPasswordRequest;
//# sourceMappingURL=set-password.request.js.map