"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class ApiKeyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.apiKey = this.getResponseProperty("ApiKey");
        this.revisionDate = new Date(this.getResponseProperty("RevisionDate"));
    }
}
exports.ApiKeyResponse = ApiKeyResponse;
//# sourceMappingURL=api-key.response.js.map