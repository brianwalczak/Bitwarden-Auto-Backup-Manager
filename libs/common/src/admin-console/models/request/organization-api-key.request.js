"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationApiKeyRequest = void 0;
const secret_verification_request_1 = require("../../../auth/models/request/secret-verification.request");
const enums_1 = require("../../enums");
class OrganizationApiKeyRequest extends secret_verification_request_1.SecretVerificationRequest {
    constructor() {
        super(...arguments);
        this.type = enums_1.OrganizationApiKeyType.Default;
    }
}
exports.OrganizationApiKeyRequest = OrganizationApiKeyRequest;
//# sourceMappingURL=organization-api-key.request.js.map