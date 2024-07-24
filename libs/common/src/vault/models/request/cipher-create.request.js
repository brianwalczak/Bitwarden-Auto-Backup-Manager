"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherCreateRequest = void 0;
const cipher_request_1 = require("./cipher.request");
class CipherCreateRequest {
    constructor(cipher) {
        this.cipher = new cipher_request_1.CipherRequest(cipher);
        this.collectionIds = cipher.collectionIds;
    }
}
exports.CipherCreateRequest = CipherCreateRequest;
//# sourceMappingURL=cipher-create.request.js.map