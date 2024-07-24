"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileUploadDataResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const send_response_1 = require("./send.response");
class SendFileUploadDataResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.url = null;
        this.fileUploadType = this.getResponseProperty("FileUploadType");
        const sendResponse = this.getResponseProperty("SendResponse");
        this.sendResponse = sendResponse == null ? null : new send_response_1.SendResponse(sendResponse);
        this.url = this.getResponseProperty("Url");
    }
}
exports.SendFileUploadDataResponse = SendFileUploadDataResponse;
//# sourceMappingURL=send-file-upload-data.response.js.map