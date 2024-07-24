"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainsResponse = void 0;
const base_response_1 = require("./base.response");
const global_domain_response_1 = require("./global-domain.response");
class DomainsResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.globalEquivalentDomains = [];
        this.equivalentDomains = this.getResponseProperty("EquivalentDomains");
        const globalEquivalentDomains = this.getResponseProperty("GlobalEquivalentDomains");
        if (globalEquivalentDomains != null) {
            this.globalEquivalentDomains = globalEquivalentDomains.map((d) => new global_domain_response_1.GlobalDomainResponse(d));
        }
        else {
            this.globalEquivalentDomains = [];
        }
    }
}
exports.DomainsResponse = DomainsResponse;
//# sourceMappingURL=domains.response.js.map