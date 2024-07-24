"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHistoryResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class PasswordHistoryResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.password = this.getResponseProperty("Password");
        this.lastUsedDate = this.getResponseProperty("LastUsedDate");
    }
}
exports.PasswordHistoryResponse = PasswordHistoryResponse;
//# sourceMappingURL=password-history.response.js.map