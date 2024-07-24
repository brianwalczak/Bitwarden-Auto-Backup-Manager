"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDecryptionOptionsResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const key_connector_user_decryption_option_response_1 = require("./key-connector-user-decryption-option.response");
const trusted_device_user_decryption_option_response_1 = require("./trusted-device-user-decryption-option.response");
const webauthn_prf_decryption_option_response_1 = require("./webauthn-prf-decryption-option.response");
class UserDecryptionOptionsResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.hasMasterPassword = this.getResponseProperty("HasMasterPassword");
        if (response.TrustedDeviceOption) {
            this.trustedDeviceOption = new trusted_device_user_decryption_option_response_1.TrustedDeviceUserDecryptionOptionResponse(this.getResponseProperty("TrustedDeviceOption"));
        }
        if (response.KeyConnectorOption) {
            this.keyConnectorOption = new key_connector_user_decryption_option_response_1.KeyConnectorUserDecryptionOptionResponse(this.getResponseProperty("KeyConnectorOption"));
        }
        if (response.WebAuthnPrfOption) {
            this.webAuthnPrfOption = new webauthn_prf_decryption_option_response_1.WebAuthnPrfDecryptionOptionResponse(this.getResponseProperty("WebAuthnPrfOption"));
        }
    }
}
exports.UserDecryptionOptionsResponse = UserDecryptionOptionsResponse;
//# sourceMappingURL=user-decryption-options.response.js.map