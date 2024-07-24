"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class FieldApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.type = this.getResponseProperty("Type");
        this.name = this.getResponseProperty("Name");
        this.value = this.getResponseProperty("Value");
        this.linkedId = this.getResponseProperty("linkedId");
    }
}
exports.FieldApi = FieldApi;
//# sourceMappingURL=field.api.js.map