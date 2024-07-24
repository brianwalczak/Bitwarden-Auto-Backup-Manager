"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class LoginUriApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        this.match = null;
        if (data == null) {
            return;
        }
        this.uri = this.getResponseProperty("Uri");
        this.uriChecksum = this.getResponseProperty("UriChecksum");
        const match = this.getResponseProperty("Match");
        this.match = match != null ? match : null;
    }
}
exports.LoginUriApi = LoginUriApi;
//# sourceMappingURL=login-uri.api.js.map