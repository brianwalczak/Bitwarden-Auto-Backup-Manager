"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesApiServiceImplementation = void 0;
const list_response_1 = require("../../models/response/list.response");
const utils_1 = require("../../platform/misc/utils");
const device_response_1 = require("../abstractions/devices/responses/device.response");
const protected_device_response_1 = require("../models/response/protected-device.response");
const trusted_device_keys_request_1 = require("./devices/requests/trusted-device-keys.request");
class DevicesApiServiceImplementation {
    constructor(apiService) {
        this.apiService = apiService;
    }
    getKnownDevice(email, deviceIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/devices/knowndevice", null, false, true, null, (headers) => {
                headers.set("X-Device-Identifier", deviceIdentifier);
                headers.set("X-Request-Email", utils_1.Utils.fromUtf8ToUrlB64(email));
            });
            return r;
        });
    }
    /**
     * Get device by identifier
     * @param deviceIdentifier - client generated id (not device id in DB)
     */
    getDeviceByIdentifier(deviceIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", `/devices/identifier/${deviceIdentifier}`, null, true, true);
            return new device_response_1.DeviceResponse(r);
        });
    }
    getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/devices", null, true, true, null);
            return new list_response_1.ListResponse(r, device_response_1.DeviceResponse);
        });
    }
    updateTrustedDeviceKeys(deviceIdentifier, devicePublicKeyEncryptedUserKey, userKeyEncryptedDevicePublicKey, deviceKeyEncryptedDevicePrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new trusted_device_keys_request_1.TrustedDeviceKeysRequest(devicePublicKeyEncryptedUserKey, userKeyEncryptedDevicePublicKey, deviceKeyEncryptedDevicePrivateKey);
            const result = yield this.apiService.send("PUT", `/devices/${deviceIdentifier}/keys`, request, true, true);
            return new device_response_1.DeviceResponse(result);
        });
    }
    updateTrust(updateDevicesTrustRequestModel, deviceIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("POST", "/devices/update-trust", updateDevicesTrustRequestModel, true, false, null, (headers) => {
                headers.set("Device-Identifier", deviceIdentifier);
            });
        });
    }
    getDeviceKeys(deviceIdentifier, secretVerificationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiService.send("POST", `/devices/${deviceIdentifier}/retrieve-keys`, secretVerificationRequest, true, true);
            return new protected_device_response_1.ProtectedDeviceResponse(result);
        });
    }
}
exports.DevicesApiServiceImplementation = DevicesApiServiceImplementation;
//# sourceMappingURL=devices-api.service.implementation.js.map