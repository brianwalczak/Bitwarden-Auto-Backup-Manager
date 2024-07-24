"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherWithIdRequest = void 0;
const cipher_request_1 = require("./cipher.request");
class CipherWithIdRequest extends cipher_request_1.CipherRequest {
    constructor(cipher) {
        super(cipher);
        this.id = cipher.id;
    }
}
exports.CipherWithIdRequest = CipherWithIdRequest;
//# sourceMappingURL=cipher-with-id.request.js.map