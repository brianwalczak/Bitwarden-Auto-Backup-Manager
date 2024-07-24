"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTextApi = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class SendTextApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.text = this.getResponseProperty("Text");
        this.hidden = this.getResponseProperty("Hidden") || false;
    }
}
exports.SendTextApi = SendTextApi;
//# sourceMappingURL=send-text.api.js.map