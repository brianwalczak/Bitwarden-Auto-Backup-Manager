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
exports.OrgDomainApiService = void 0;
const organization_domain_sso_details_response_1 = require("../../abstractions/organization-domain/responses/organization-domain-sso-details.response");
const organization_domain_response_1 = require("../../abstractions/organization-domain/responses/organization-domain.response");
const organization_domain_sso_details_request_1 = require("./requests/organization-domain-sso-details.request");
class OrgDomainApiService {
    constructor(orgDomainService, apiService) {
        this.orgDomainService = orgDomainService;
        this.apiService = apiService;
    }
    getAllByOrgId(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listResponse = yield this.apiService.send("GET", `/organizations/${orgId}/domain`, null, true, true);
            const orgDomains = listResponse.data.map((resultOrgDomain) => new organization_domain_response_1.OrganizationDomainResponse(resultOrgDomain));
            this.orgDomainService.replace(orgDomains);
            return orgDomains;
        });
    }
    getByOrgIdAndOrgDomainId(orgId, orgDomainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiService.send("GET", `/organizations/${orgId}/domain/${orgDomainId}`, null, true, true);
            const response = new organization_domain_response_1.OrganizationDomainResponse(result);
            this.orgDomainService.upsert([response]);
            return response;
        });
    }
    post(orgId, orgDomainReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiService.send("POST", `/organizations/${orgId}/domain`, orgDomainReq, true, true);
            const response = new organization_domain_response_1.OrganizationDomainResponse(result);
            this.orgDomainService.upsert([response]);
            return response;
        });
    }
    verify(orgId, orgDomainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiService.send("POST", `/organizations/${orgId}/domain/${orgDomainId}/verify`, null, true, true);
            const response = new organization_domain_response_1.OrganizationDomainResponse(result);
            this.orgDomainService.upsert([response]);
            return response;
        });
    }
    delete(orgId, orgDomainId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("DELETE", `/organizations/${orgId}/domain/${orgDomainId}`, null, true, false);
            this.orgDomainService.delete([orgDomainId]);
        });
    }
    getClaimedOrgDomainByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.apiService.send("POST", `/organizations/domain/sso/details`, new organization_domain_sso_details_request_1.OrganizationDomainSsoDetailsRequest(email), false, // anonymous
            true);
            const response = new organization_domain_sso_details_response_1.OrganizationDomainSsoDetailsResponse(result);
            return response;
        });
    }
}
exports.OrgDomainApiService = OrgDomainApiService;
//# sourceMappingURL=org-domain-api.service.js.map