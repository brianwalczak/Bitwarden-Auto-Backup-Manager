"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileDownloadDataResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class SendFileDownloadDataResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = null;
        this.url = null;
        this.id = this.getResponseProperty("Id");
        this.url = this.getResponseProperty("Url");
    }
}
exports.SendFileDownloadDataResponse = SendFileDownloadDataResponse;
//# sourceMappingURL=send-file-download-data.response.js.map