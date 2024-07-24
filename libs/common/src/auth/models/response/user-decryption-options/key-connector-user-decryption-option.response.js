"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyConnectorUserDecryptionOptionResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class KeyConnectorUserDecryptionOptionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.keyConnectorUrl = this.getResponseProperty("KeyConnectorUrl");
    }
}
exports.KeyConnectorUserDecryptionOptionResponse = KeyConnectorUserDecryptionOptionResponse;
//# sourceMappingURL=key-connector-user-decryption-option.response.js.map