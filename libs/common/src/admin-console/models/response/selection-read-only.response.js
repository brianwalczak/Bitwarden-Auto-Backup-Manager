"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionReadOnlyResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class SelectionReadOnlyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.readOnly = this.getResponseProperty("ReadOnly");
        this.hidePasswords = this.getResponseProperty("HidePasswords");
        this.manage = this.getResponseProperty("Manage");
    }
}
exports.SelectionReadOnlyResponse = SelectionReadOnlyResponse;
//# sourceMappingURL=selection-read-only.response.js.map