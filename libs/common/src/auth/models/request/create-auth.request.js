"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuthRequest = void 0;
class CreateAuthRequest {
    constructor(email, deviceIdentifier, publicKey, type, accessCode) {
        this.email = email;
        this.deviceIdentifier = deviceIdentifier;
        this.publicKey = publicKey;
        this.type = type;
        this.accessCode = accessCode;
    }
}
exports.CreateAuthRequest = CreateAuthRequest;
//# sourceMappingURL=create-auth.request.js.map