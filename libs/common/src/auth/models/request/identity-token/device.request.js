"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRequest = void 0;
class DeviceRequest {
    constructor(appId, platformUtilsService) {
        this.type = platformUtilsService.getDevice();
        this.name = platformUtilsService.getDeviceString();
        this.identifier = appId;
        this.pushToken = null;
    }
    static fromJSON(json) {
        return Object.assign(Object.create(DeviceRequest.prototype), json);
    }
}
exports.DeviceRequest = DeviceRequest;
//# sourceMappingURL=device.request.js.map