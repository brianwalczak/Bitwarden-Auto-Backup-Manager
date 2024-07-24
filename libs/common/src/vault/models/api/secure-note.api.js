"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNoteApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class SecureNoteApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.type = this.getResponseProperty("Type");
    }
}
exports.SecureNoteApi = SecureNoteApi;
//# sourceMappingURL=secure-note.api.js.map