"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordlessAuthRequest = void 0;
class PasswordlessAuthRequest {
    constructor(key, masterPasswordHash, deviceIdentifier, requestApproved) {
        this.key = key;
        this.masterPasswordHash = masterPasswordHash;
        this.deviceIdentifier = deviceIdentifier;
        this.requestApproved = requestApproved;
    }
}
exports.PasswordlessAuthRequest = PasswordlessAuthRequest;
//# sourceMappingURL=passwordless-auth.request.js.map