"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileProviderResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const permissions_api_1 = require("../api/permissions.api");
class ProfileProviderResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.name = this.getResponseProperty("Name");
        this.key = this.getResponseProperty("Key");
        this.status = this.getResponseProperty("Status");
        this.type = this.getResponseProperty("Type");
        this.enabled = this.getResponseProperty("Enabled");
        this.permissions = new permissions_api_1.PermissionsApi(this.getResponseProperty("permissions"));
        this.userId = this.getResponseProperty("UserId");
        this.useEvents = this.getResponseProperty("UseEvents");
        this.providerStatus = this.getResponseProperty("ProviderStatus");
    }
}
exports.ProfileProviderResponse = ProfileProviderResponse;
//# sourceMappingURL=profile-provider.response.js.map