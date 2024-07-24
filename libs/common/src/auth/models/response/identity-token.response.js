"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityTokenResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const master_password_policy_response_1 = require("./master-password-policy.response");
const user_decryption_options_response_1 = require("./user-decryption-options/user-decryption-options.response");
class IdentityTokenResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.accessToken = response.access_token;
        this.expiresIn = response.expires_in;
        this.refreshToken = response.refresh_token;
        this.tokenType = response.token_type;
        this.resetMasterPassword = this.getResponseProperty("ResetMasterPassword");
        this.privateKey = this.getResponseProperty("PrivateKey");
        this.key = this.getResponseProperty("Key");
        this.twoFactorToken = this.getResponseProperty("TwoFactorToken");
        this.kdf = this.getResponseProperty("Kdf");
        this.kdfIterations = this.getResponseProperty("KdfIterations");
        this.kdfMemory = this.getResponseProperty("KdfMemory");
        this.kdfParallelism = this.getResponseProperty("KdfParallelism");
        this.forcePasswordReset = this.getResponseProperty("ForcePasswordReset");
        this.apiUseKeyConnector = this.getResponseProperty("ApiUseKeyConnector");
        this.keyConnectorUrl = this.getResponseProperty("KeyConnectorUrl");
        this.masterPasswordPolicy = new master_password_policy_response_1.MasterPasswordPolicyResponse(this.getResponseProperty("MasterPasswordPolicy"));
        if (response.UserDecryptionOptions) {
            this.userDecryptionOptions = new user_decryption_options_response_1.UserDecryptionOptionsResponse(this.getResponseProperty("UserDecryptionOptions"));
        }
    }
}
exports.IdentityTokenResponse = IdentityTokenResponse;
//# sourceMappingURL=identity-token.response.js.map