"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionOptionsResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const utils_1 = require("../../../../platform/misc/utils");
class AssertionOptionsResponse extends base_response_1.BaseResponse {
    constructor(response) {
        var _a;
        super(response);
        this.allowCredentials = (_a = this.getResponseProperty("allowCredentials")) === null || _a === void 0 ? void 0 : _a.map((c) => (Object.assign(Object.assign({}, c), { id: utils_1.Utils.fromUrlB64ToArray(c.id).buffer })));
        this.challenge = utils_1.Utils.fromUrlB64ToArray(this.getResponseProperty("challenge"));
        this.extensions = this.getResponseProperty("extensions");
        this.rpId = this.getResponseProperty("rpId");
        this.timeout = this.getResponseProperty("timeout");
        this.userVerification = this.getResponseProperty("userVerification");
    }
}
exports.AssertionOptionsResponse = AssertionOptionsResponse;
//# sourceMappingURL=assertion-options.response.js.map