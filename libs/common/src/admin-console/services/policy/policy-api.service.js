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
exports.PolicyApiService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../../enums");
const error_response_1 = require("../../../models/response/error.response");
const list_response_1 = require("../../../models/response/list.response");
const utils_1 = require("../../../platform/misc/utils");
const policy_data_1 = require("../../models/data/policy.data");
const policy_1 = require("../../models/domain/policy");
const policy_response_1 = require("../../models/response/policy.response");
class PolicyApiService {
    constructor(policyService, apiService) {
        this.policyService = policyService;
        this.apiService = apiService;
    }
    getPolicy(organizationId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + organizationId + "/policies/" + type, null, true, true);
            return new policy_response_1.PolicyResponse(r);
        });
    }
    getPolicies(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + organizationId + "/policies", null, true, true);
            return new list_response_1.ListResponse(r, policy_response_1.PolicyResponse);
        });
    }
    getPoliciesByToken(organizationId, token, email, organizationUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" +
                organizationId +
                "/policies/token?" +
                "token=" +
                encodeURIComponent(token) +
                "&email=" +
                utils_1.Utils.encodeRFC3986URIComponent(email) +
                "&organizationUserId=" +
                organizationUserId, null, false, true);
            return policy_1.Policy.fromListResponse(new list_response_1.ListResponse(r, policy_response_1.PolicyResponse));
        });
    }
    getMasterPasswordPolicyResponseForOrgUser(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiService.send("GET", "/organizations/" + organizationId + "/policies/master-password", null, true, true);
            return new policy_response_1.PolicyResponse(response);
        });
    }
    getMasterPasswordPolicyOptsForOrgUser(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterPasswordPolicyResponse = yield this.getMasterPasswordPolicyResponseForOrgUser(orgId);
                const masterPasswordPolicy = policy_1.Policy.fromResponse(masterPasswordPolicyResponse);
                if (!masterPasswordPolicy) {
                    return null;
                }
                return yield (0, rxjs_1.firstValueFrom)(this.policyService.masterPasswordPolicyOptions$([masterPasswordPolicy]));
            }
            catch (error) {
                // If policy not found, return null
                if (error instanceof error_response_1.ErrorResponse && error.statusCode === enums_1.HttpStatusCode.NotFound) {
                    return null;
                }
                // otherwise rethrow error
                throw error;
            }
        });
    }
    putPolicy(organizationId, type, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/organizations/" + organizationId + "/policies/" + type, request, true, true);
            const response = new policy_response_1.PolicyResponse(r);
            const data = new policy_data_1.PolicyData(response);
            yield this.policyService.upsert(data);
        });
    }
}
exports.PolicyApiService = PolicyApiService;
//# sourceMappingURL=policy-api.service.js.map