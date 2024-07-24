"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class AttachmentResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.url = this.getResponseProperty("Url");
        this.fileName = this.getResponseProperty("FileName");
        this.key = this.getResponseProperty("Key");
        this.size = this.getResponseProperty("Size");
        this.sizeName = this.getResponseProperty("SizeName");
    }
}
exports.AttachmentResponse = AttachmentResponse;
//# sourceMappingURL=attachment.response.js.map