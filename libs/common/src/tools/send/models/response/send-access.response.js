"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAccessResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const send_file_api_1 = require("../api/send-file.api");
const send_text_api_1 = require("../api/send-text.api");
class SendAccessResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.type = this.getResponseProperty("Type");
        this.name = this.getResponseProperty("Name");
        const text = this.getResponseProperty("Text");
        if (text != null) {
            this.text = new send_text_api_1.SendTextApi(text);
        }
        const file = this.getResponseProperty("File");
        if (file != null) {
            this.file = new send_file_api_1.SendFileApi(file);
        }
        this.expirationDate = this.getResponseProperty("ExpirationDate");
        this.creatorIdentifier = this.getResponseProperty("CreatorIdentifier");
    }
}
exports.SendAccessResponse = SendAccessResponse;
//# sourceMappingURL=send-access.response.js.map