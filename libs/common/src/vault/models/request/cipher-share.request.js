"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherShareRequest = void 0;
const cipher_request_1 = require("./cipher.request");
class CipherShareRequest {
    constructor(cipher) {
        this.cipher = new cipher_request_1.CipherRequest(cipher);
        this.collectionIds = cipher.collectionIds;
    }
}
exports.CipherShareRequest = CipherShareRequest;
//# sourceMappingURL=cipher-share.request.js.map