"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedDeviceResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
class ProtectedDeviceResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("id");
        this.name = this.getResponseProperty("name");
        this.identifier = this.getResponseProperty("identifier");
        this.type = this.getResponseProperty("type");
        this.creationDate = new Date(this.getResponseProperty("creationDate"));
        if (response.encryptedUserKey) {
            this.encryptedUserKey = new enc_string_1.EncString(this.getResponseProperty("encryptedUserKey"));
        }
        if (response.encryptedPublicKey) {
            this.encryptedPublicKey = new enc_string_1.EncString(this.getResponseProperty("encryptedPublicKey"));
        }
    }
}
exports.ProtectedDeviceResponse = ProtectedDeviceResponse;
//# sourceMappingURL=protected-device.response.js.map