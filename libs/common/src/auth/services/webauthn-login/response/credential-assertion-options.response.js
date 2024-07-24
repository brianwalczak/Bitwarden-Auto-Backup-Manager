"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialAssertionOptionsResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const assertion_options_response_1 = require("./assertion-options.response");
class CredentialAssertionOptionsResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.options = new assertion_options_response_1.AssertionOptionsResponse(this.getResponseProperty("options"));
        this.token = this.getResponseProperty("token");
    }
}
exports.CredentialAssertionOptionsResponse = CredentialAssertionOptionsResponse;
//# sourceMappingURL=credential-assertion-options.response.js.map