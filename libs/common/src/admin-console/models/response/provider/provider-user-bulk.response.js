"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderUserBulkResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class ProviderUserBulkResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.error = this.getResponseProperty("Error");
    }
}
exports.ProviderUserBulkResponse = ProviderUserBulkResponse;
//# sourceMappingURL=provider-user-bulk.response.js.map