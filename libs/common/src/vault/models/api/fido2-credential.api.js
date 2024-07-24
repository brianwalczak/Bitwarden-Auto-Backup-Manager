"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fido2CredentialApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class Fido2CredentialApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.credentialId = this.getResponseProperty("CredentialId");
        this.keyType = this.getResponseProperty("KeyType");
        this.keyAlgorithm = this.getResponseProperty("KeyAlgorithm");
        this.keyCurve = this.getResponseProperty("KeyCurve");
        this.keyValue = this.getResponseProperty("keyValue");
        this.rpId = this.getResponseProperty("RpId");
        this.userHandle = this.getResponseProperty("UserHandle");
        this.userName = this.getResponseProperty("UserName");
        this.counter = this.getResponseProperty("Counter");
        this.rpName = this.getResponseProperty("RpName");
        this.userDisplayName = this.getResponseProperty("UserDisplayName");
        this.discoverable = this.getResponseProperty("Discoverable");
        this.creationDate = this.getResponseProperty("CreationDate");
    }
}
exports.Fido2CredentialApi = Fido2CredentialApi;
//# sourceMappingURL=fido2-credential.api.js.map