"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileApi = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class SendFileApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.id = this.getResponseProperty("Id");
        this.fileName = this.getResponseProperty("FileName");
        this.size = this.getResponseProperty("Size");
        this.sizeName = this.getResponseProperty("SizeName");
    }
}
exports.SendFileApi = SendFileApi;
//# sourceMappingURL=send-file.api.js.map