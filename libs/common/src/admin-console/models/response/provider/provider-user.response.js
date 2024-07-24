"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderUserUserDetailsResponse = exports.ProviderUserResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const permissions_api_1 = require("../../api/permissions.api");
class ProviderUserResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.type = this.getResponseProperty("Type");
        this.status = this.getResponseProperty("Status");
        this.permissions = new permissions_api_1.PermissionsApi(this.getResponseProperty("Permissions"));
    }
}
exports.ProviderUserResponse = ProviderUserResponse;
class ProviderUserUserDetailsResponse extends ProviderUserResponse {
    constructor(response) {
        super(response);
        this.name = this.getResponseProperty("Name");
        this.email = this.getResponseProperty("Email");
    }
}
exports.ProviderUserUserDetailsResponse = ProviderUserUserDetailsResponse;
//# sourceMappingURL=provider-user.response.js.map