"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustedDeviceUserDecryptionOptionResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const enc_string_1 = require("../../../../platform/models/domain/enc-string");
class TrustedDeviceUserDecryptionOptionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.hasAdminApproval = this.getResponseProperty("HasAdminApproval");
        this.hasLoginApprovingDevice = this.getResponseProperty("HasLoginApprovingDevice");
        this.hasManageResetPasswordPermission = this.getResponseProperty("HasManageResetPasswordPermission");
        if (response.EncryptedPrivateKey) {
            this.encryptedPrivateKey = new enc_string_1.EncString(this.getResponseProperty("EncryptedPrivateKey"));
        }
        if (response.EncryptedUserKey) {
            this.encryptedUserKey = new enc_string_1.EncString(this.getResponseProperty("EncryptedUserKey"));
        }
    }
}
exports.TrustedDeviceUserDecryptionOptionResponse = TrustedDeviceUserDecryptionOptionResponse;
//# sourceMappingURL=trusted-device-user-decryption-option.response.js.map