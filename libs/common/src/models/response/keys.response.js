"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeysResponse = void 0;
const base_response_1 = require("./base.response");
class KeysResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.privateKey = this.getResponseProperty("PrivateKey");
        this.publicKey = this.getResponseProperty("PublicKey");
    }
}
exports.KeysResponse = KeysResponse;
//# sourceMappingURL=keys.response.js.map