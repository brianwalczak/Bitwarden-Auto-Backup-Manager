"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationAutoEnrollStatusResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationAutoEnrollStatusResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.resetPasswordEnabled = this.getResponseProperty("ResetPasswordEnabled");
    }
}
exports.OrganizationAutoEnrollStatusResponse = OrganizationAutoEnrollStatusResponse;
//# sourceMappingURL=organization-auto-enroll-status.response.js.map