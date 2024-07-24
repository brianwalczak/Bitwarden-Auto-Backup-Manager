"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
class DeviceResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.name = this.getResponseProperty("Name");
        this.identifier = this.getResponseProperty("Identifier");
        this.type = this.getResponseProperty("Type");
        this.creationDate = this.getResponseProperty("CreationDate");
        this.revisionDate = this.getResponseProperty("RevisionDate");
    }
}
exports.DeviceResponse = DeviceResponse;
//# sourceMappingURL=device.response.js.map