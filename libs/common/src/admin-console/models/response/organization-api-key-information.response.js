"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationApiKeyInformationResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationApiKeyInformationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.keyType = this.getResponseProperty("KeyType");
    }
}
exports.OrganizationApiKeyInformationResponse = OrganizationApiKeyInformationResponse;
//# sourceMappingURL=organization-api-key-information.response.js.map