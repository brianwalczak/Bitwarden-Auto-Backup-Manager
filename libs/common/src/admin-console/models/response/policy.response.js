"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class PolicyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.type = this.getResponseProperty("Type");
        this.data = this.getResponseProperty("Data");
        this.enabled = this.getResponseProperty("Enabled");
    }
}
exports.PolicyResponse = PolicyResponse;
//# sourceMappingURL=policy.response.js.map