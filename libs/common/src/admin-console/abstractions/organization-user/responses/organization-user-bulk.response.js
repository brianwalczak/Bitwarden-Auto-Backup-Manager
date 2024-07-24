"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUserBulkResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class OrganizationUserBulkResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.error = this.getResponseProperty("Error");
    }
}
exports.OrganizationUserBulkResponse = OrganizationUserBulkResponse;
//# sourceMappingURL=organization-user-bulk.response.js.map