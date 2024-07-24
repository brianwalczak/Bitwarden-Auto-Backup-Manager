"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
const utils_1 = require("../../platform/misc/utils");
const base_response_1 = require("./base.response");
class ErrorResponse extends base_response_1.BaseResponse {
    constructor(response, status, identityResponse) {
        var _a, _b;
        super(response);
        let errorModel = null;
        if (response != null) {
            const responseErrorModel = this.getResponseProperty("ErrorModel");
            if (responseErrorModel && identityResponse) {
                errorModel = responseErrorModel;
            }
            else {
                errorModel = response;
            }
        }
        if (status === 429) {
            this.message = "Rate limit exceeded. Try again later.";
        }
        else if (errorModel) {
            this.message = this.getResponseProperty("Message", errorModel);
            this.validationErrors = this.getResponseProperty("ValidationErrors", errorModel);
            this.captchaSiteKey = (_b = (_a = this.validationErrors) === null || _a === void 0 ? void 0 : _a.HCaptcha_SiteKey) === null || _b === void 0 ? void 0 : _b[0];
            this.captchaRequired = !utils_1.Utils.isNullOrWhitespace(this.captchaSiteKey);
        }
        this.statusCode = status;
    }
    getSingleMessage() {
        if (this.validationErrors == null) {
            return this.message;
        }
        for (const key in this.validationErrors) {
            // eslint-disable-next-line
            if (!this.validationErrors.hasOwnProperty(key)) {
                continue;
            }
            if (this.validationErrors[key].length) {
                return this.validationErrors[key][0];
            }
        }
        return this.message;
    }
    getAllMessages() {
        const messages = [];
        if (this.validationErrors == null) {
            return messages;
        }
        for (const key in this.validationErrors) {
            // eslint-disable-next-line
            if (!this.validationErrors.hasOwnProperty(key)) {
                continue;
            }
            this.validationErrors[key].forEach((item) => {
                let prefix = "";
                if (key.indexOf("[") > -1 && key.indexOf("]") > -1) {
                    const lastSep = key.lastIndexOf(".");
                    prefix = key.substr(0, lastSep > -1 ? lastSep : key.length) + ": ";
                }
                messages.push(prefix + item);
            });
        }
        return messages;
    }
}
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=error.response.js.map