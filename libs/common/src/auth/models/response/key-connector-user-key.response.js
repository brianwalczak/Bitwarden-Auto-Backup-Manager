"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyConnectorUserKeyResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class KeyConnectorUserKeyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.key = this.getResponseProperty("Key");
    }
}
exports.KeyConnectorUserKeyResponse = KeyConnectorUserKeyResponse;
//# sourceMappingURL=key-connector-user-key.response.js.map