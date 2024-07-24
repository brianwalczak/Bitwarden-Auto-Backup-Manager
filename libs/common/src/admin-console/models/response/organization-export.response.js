"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationExportResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const cipher_response_1 = require("../../../vault/models/response/cipher.response");
const collection_response_1 = require("../../../vault/models/response/collection.response");
class OrganizationExportResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        const collections = this.getResponseProperty("Collections");
        if (collections != null) {
            this.collections = collections.map((c) => new collection_response_1.CollectionResponse(c));
        }
        const ciphers = this.getResponseProperty("Ciphers");
        if (ciphers != null) {
            this.ciphers = ciphers.map((c) => new cipher_response_1.CipherResponse(c));
        }
    }
}
exports.OrganizationExportResponse = OrganizationExportResponse;
//# sourceMappingURL=organization-export.response.js.map