"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnPrfDecryptionOptionResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const enc_string_1 = require("../../../../platform/models/domain/enc-string");
class WebAuthnPrfDecryptionOptionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        if (response.EncryptedPrivateKey) {
            this.encryptedPrivateKey = new enc_string_1.EncString(this.getResponseProperty("EncryptedPrivateKey"));
        }
        if (response.EncryptedUserKey) {
            this.encryptedUserKey = new enc_string_1.EncString(this.getResponseProperty("EncryptedUserKey"));
        }
    }
}
exports.WebAuthnPrfDecryptionOptionResponse = WebAuthnPrfDecryptionOptionResponse;
//# sourceMappingURL=webauthn-prf-decryption-option.response.js.map