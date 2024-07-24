"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
class BaseResponse {
    constructor(response) {
        this.response = response;
    }
    getResponseProperty(propertyName, response = null, exactName = false) {
        if (propertyName == null || propertyName === "") {
            throw new Error("propertyName must not be null/empty.");
        }
        if (response == null && this.response != null) {
            response = this.response;
        }
        if (response == null) {
            return null;
        }
        if (!exactName && response[propertyName] === undefined) {
            let otherCasePropertyName = null;
            if (propertyName.charAt(0) === propertyName.charAt(0).toUpperCase()) {
                otherCasePropertyName = propertyName.charAt(0).toLowerCase();
            }
            else {
                otherCasePropertyName = propertyName.charAt(0).toUpperCase();
            }
            if (propertyName.length > 1) {
                otherCasePropertyName += propertyName.slice(1);
            }
            propertyName = otherCasePropertyName;
            if (response[propertyName] === undefined) {
                propertyName = propertyName.toLowerCase();
            }
            if (response[propertyName] === undefined) {
                propertyName = propertyName.toUpperCase();
            }
        }
        return response[propertyName];
    }
}
exports.BaseResponse = BaseResponse;
//# sourceMappingURL=base.response.js.map