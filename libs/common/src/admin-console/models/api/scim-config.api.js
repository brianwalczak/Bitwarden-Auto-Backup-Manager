"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScimConfigApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class ScimConfigApi extends base_response_1.BaseResponse {
    constructor(data) {
        super(data);
        if (data == null) {
            return;
        }
        this.enabled = this.getResponseProperty("Enabled");
        this.scimProvider = this.getResponseProperty("ScimProvider");
    }
}
exports.ScimConfigApi = ScimConfigApi;
//# sourceMappingURL=scim-config.api.js.map