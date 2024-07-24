"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterPasswordPolicyResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class MasterPasswordPolicyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.minComplexity = this.getResponseProperty("MinComplexity");
        this.minLength = this.getResponseProperty("MinLength");
        this.requireUpper = this.getResponseProperty("RequireUpper");
        this.requireLower = this.getResponseProperty("RequireLower");
        this.requireNumbers = this.getResponseProperty("RequireNumbers");
        this.requireSpecial = this.getResponseProperty("RequireSpecial");
        this.enforceOnLogin = this.getResponseProperty("EnforceOnLogin");
    }
}
exports.MasterPasswordPolicyResponse = MasterPasswordPolicyResponse;
//# sourceMappingURL=master-password-policy.response.js.map