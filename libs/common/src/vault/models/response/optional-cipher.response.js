"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalCipherResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const cipher_response_1 = require("./cipher.response");
class OptionalCipherResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.unavailable = this.getResponseProperty("Unavailable");
        this.cipher = new cipher_response_1.CipherResponse(this.getResponseProperty("Cipher"));
    }
}
exports.OptionalCipherResponse = OptionalCipherResponse;
//# sourceMappingURL=optional-cipher.response.js.map