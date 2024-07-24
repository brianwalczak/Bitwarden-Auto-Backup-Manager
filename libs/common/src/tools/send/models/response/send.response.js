"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const send_file_api_1 = require("../api/send-file.api");
const send_text_api_1 = require("../api/send-text.api");
class SendResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.accessId = this.getResponseProperty("AccessId");
        this.type = this.getResponseProperty("Type");
        this.name = this.getResponseProperty("Name");
        this.notes = this.getResponseProperty("Notes");
        this.key = this.getResponseProperty("Key");
        this.maxAccessCount = this.getResponseProperty("MaxAccessCount");
        this.accessCount = this.getResponseProperty("AccessCount");
        this.revisionDate = this.getResponseProperty("RevisionDate");
        this.expirationDate = this.getResponseProperty("ExpirationDate");
        this.deletionDate = this.getResponseProperty("DeletionDate");
        this.password = this.getResponseProperty("Password");
        this.disable = this.getResponseProperty("Disabled") || false;
        this.hideEmail = this.getResponseProperty("HideEmail") || false;
        const text = this.getResponseProperty("Text");
        if (text != null) {
            this.text = new send_text_api_1.SendTextApi(text);
        }
        const file = this.getResponseProperty("File");
        if (file != null) {
            this.file = new send_file_api_1.SendFileApi(file);
        }
    }
}
exports.SendResponse = SendResponse;
//# sourceMappingURL=send.response.js.map