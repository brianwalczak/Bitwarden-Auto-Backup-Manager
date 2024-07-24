"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDomainResponse = void 0;
const base_response_1 = require("./base.response");
class GlobalDomainResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty("Type");
        this.domains = this.getResponseProperty("Domains");
        this.excluded = this.getResponseProperty("Excluded");
    }
}
exports.GlobalDomainResponse = GlobalDomainResponse;
//# sourceMappingURL=global-domain.response.js.map