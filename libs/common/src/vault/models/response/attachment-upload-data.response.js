"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentUploadDataResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const cipher_response_1 = require("./cipher.response");
class AttachmentUploadDataResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.url = null;
        this.attachmentId = this.getResponseProperty("AttachmentId");
        this.fileUploadType = this.getResponseProperty("FileUploadType");
        const cipherResponse = this.getResponseProperty("CipherResponse");
        const cipherMiniResponse = this.getResponseProperty("CipherMiniResponse");
        this.cipherResponse = cipherResponse == null ? null : new cipher_response_1.CipherResponse(cipherResponse);
        this.cipherMiniResponse =
            cipherMiniResponse == null ? null : new cipher_response_1.CipherResponse(cipherMiniResponse);
        this.url = this.getResponseProperty("Url");
    }
}
exports.AttachmentUploadDataResponse = AttachmentUploadDataResponse;
//# sourceMappingURL=attachment-upload-data.response.js.map