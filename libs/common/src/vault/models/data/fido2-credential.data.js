"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fido2CredentialData = void 0;
class Fido2CredentialData {
    constructor(data) {
        if (data == null) {
            return;
        }
        this.credentialId = data.credentialId;
        this.keyType = data.keyType;
        this.keyAlgorithm = data.keyAlgorithm;
        this.keyCurve = data.keyCurve;
        this.keyValue = data.keyValue;
        this.rpId = data.rpId;
        this.userHandle = data.userHandle;
        this.userName = data.userName;
        this.counter = data.counter;
        this.rpName = data.rpName;
        this.userDisplayName = data.userDisplayName;
        this.discoverable = data.discoverable;
        this.creationDate = data.creationDate;
    }
}
exports.Fido2CredentialData = Fido2CredentialData;
//# sourceMappingURL=fido2-credential.data.js.map