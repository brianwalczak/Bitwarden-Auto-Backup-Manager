"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUserBulkPublicKeyResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class OrganizationUserBulkPublicKeyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.key = this.getResponseProperty("Key");
    }
}
exports.OrganizationUserBulkPublicKeyResponse = OrganizationUserBulkPublicKeyResponse;
//# sourceMappingURL=organization-user-bulk-public-key.response.js.map