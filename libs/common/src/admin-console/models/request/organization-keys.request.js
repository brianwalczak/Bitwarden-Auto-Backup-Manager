"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationKeysRequest = void 0;
const keys_request_1 = require("../../../models/request/keys.request");
class OrganizationKeysRequest extends keys_request_1.KeysRequest {
    constructor(publicKey, encryptedPrivateKey) {
        super(publicKey, encryptedPrivateKey);
    }
}
exports.OrganizationKeysRequest = OrganizationKeysRequest;
//# sourceMappingURL=organization-keys.request.js.map