"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationConnectionResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationConnectionResponse extends base_response_1.BaseResponse {
    constructor(response, configType) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.type = this.getResponseProperty("Type");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.enabled = this.getResponseProperty("Enabled");
        const rawConfig = this.getResponseProperty("Config");
        this.config = rawConfig == null ? null : new configType(rawConfig);
    }
}
exports.OrganizationConnectionResponse = OrganizationConnectionResponse;
//# sourceMappingURL=organization-connection.response.js.map