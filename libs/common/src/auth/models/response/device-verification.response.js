"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceVerificationResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class DeviceVerificationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.isDeviceVerificationSectionEnabled = this.getResponseProperty("IsDeviceVerificationSectionEnabled");
        this.unknownDeviceVerificationEnabled = this.getResponseProperty("UnknownDeviceVerificationEnabled");
    }
}
exports.DeviceVerificationResponse = DeviceVerificationResponse;
//# sourceMappingURL=device-verification.response.js.map