"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherBulkShareRequest = void 0;
const cipher_with_id_request_1 = require("./cipher-with-id.request");
class CipherBulkShareRequest {
    constructor(ciphers, collectionIds) {
        if (ciphers != null) {
            this.ciphers = [];
            ciphers.forEach((c) => {
                this.ciphers.push(new cipher_with_id_request_1.CipherWithIdRequest(c));
            });
        }
        this.collectionIds = collectionIds;
    }
}
exports.CipherBulkShareRequest = CipherBulkShareRequest;
//# sourceMappingURL=cipher-bulk-share.request.js.map