"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesServiceImplementation = void 0;
const rxjs_1 = require("rxjs");
const device_view_1 = require("../../abstractions/devices/views/device.view");
/**
 * @class DevicesServiceImplementation
 * @implements {DevicesServiceAbstraction}
 * @description Observable based data store service for Devices.
 * note: defer is used to convert the promises to observables and to ensure
 * that observables are created for each subscription
 * (i.e., promsise --> observables are cold until subscribed to)
 */
class DevicesServiceImplementation {
    constructor(devicesApiService) {
        this.devicesApiService = devicesApiService;
    }
    /**
     * @description Gets the list of all devices.
     */
    getDevices$() {
        return (0, rxjs_1.defer)(() => this.devicesApiService.getDevices()).pipe((0, rxjs_1.map)((deviceResponses) => {
            return deviceResponses.data.map((deviceResponse) => {
                return new device_view_1.DeviceView(deviceResponse);
            });
        }));
    }
    /**
     * @description Gets the device with the specified identifier.
     */
    getDeviceByIdentifier$(deviceIdentifier) {
        return (0, rxjs_1.defer)(() => this.devicesApiService.getDeviceByIdentifier(deviceIdentifier)).pipe((0, rxjs_1.map)((deviceResponse) => new device_view_1.DeviceView(deviceResponse)));
    }
    /**
     * @description Checks if a device is known for a user by user's email and device's identifier.
     */
    isDeviceKnownForUser$(email, deviceIdentifier) {
        return (0, rxjs_1.defer)(() => this.devicesApiService.getKnownDevice(email, deviceIdentifier));
    }
    /**
     * @description Updates the keys for the specified device.
     */
    updateTrustedDeviceKeys$(deviceIdentifier, devicePublicKeyEncryptedUserKey, userKeyEncryptedDevicePublicKey, deviceKeyEncryptedDevicePrivateKey) {
        return (0, rxjs_1.defer)(() => this.devicesApiService.updateTrustedDeviceKeys(deviceIdentifier, devicePublicKeyEncryptedUserKey, userKeyEncryptedDevicePublicKey, deviceKeyEncryptedDevicePrivateKey)).pipe((0, rxjs_1.map)((deviceResponse) => new device_view_1.DeviceView(deviceResponse)));
    }
}
exports.DevicesServiceImplementation = DevicesServiceImplementation;
//# sourceMappingURL=devices.service.implementation.js.map