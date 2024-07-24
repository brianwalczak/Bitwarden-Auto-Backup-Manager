"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherDeviceKeysUpdateRequest = exports.DeviceKeysUpdateRequest = exports.UpdateDevicesTrustRequest = void 0;
const secret_verification_request_1 = require("./secret-verification.request");
class UpdateDevicesTrustRequest extends secret_verification_request_1.SecretVerificationRequest {
}
exports.UpdateDevicesTrustRequest = UpdateDevicesTrustRequest;
class DeviceKeysUpdateRequest {
}
exports.DeviceKeysUpdateRequest = DeviceKeysUpdateRequest;
class OtherDeviceKeysUpdateRequest extends DeviceKeysUpdateRequest {
}
exports.OtherDeviceKeysUpdateRequest = OtherDeviceKeysUpdateRequest;
//# sourceMappingURL=update-devices-trust.request.js.map