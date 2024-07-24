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
exports.OrganizationUserServiceImplementation = void 0;
const list_response_1 = require("../../../models/response/list.response");
const responses_1 = require("../../abstractions/organization-user/responses");
const requests_1 = require("./requests");
class OrganizationUserServiceImplementation {
    constructor(apiService) {
        this.apiService = apiService;
    }
    getOrganizationUser(organizationId, id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            if (options === null || options === void 0 ? void 0 : options.includeGroups) {
                params.set("includeGroups", "true");
            }
            const r = yield this.apiService.send("GET", `/organizations/${organizationId}/users/${id}?${params.toString()}`, null, true, true);
            return new responses_1.OrganizationUserDetailsResponse(r);
        });
    }
    getOrganizationUserGroups(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + organizationId + "/users/" + id + "/groups", null, true, true);
            return r;
        });
    }
    getAllUsers(organizationId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams();
            if (options === null || options === void 0 ? void 0 : options.includeCollections) {
                params.set("includeCollections", "true");
            }
            if (options === null || options === void 0 ? void 0 : options.includeGroups) {
                params.set("includeGroups", "true");
            }
            const r = yield this.apiService.send("GET", `/organizations/${organizationId}/users?${params.toString()}`, null, true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserUserDetailsResponse);
        });
    }
    getOrganizationUserResetPasswordDetails(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + organizationId + "/users/" + id + "/reset-password-details", null, true, true);
            return new responses_1.OrganizationUserResetPasswordDetailsResponse(r);
        });
    }
    getManyOrganizationUserAccountRecoveryDetails(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + organizationId + "/users/account-recovery-details", new requests_1.OrganizationUserBulkRequest(ids), true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserResetPasswordDetailsResponse);
        });
    }
    postOrganizationUserInvite(organizationId, request) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/users/invite", request, true, false);
    }
    postOrganizationUserReinvite(organizationId, id) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/users/" + id + "/reinvite", null, true, false);
    }
    postManyOrganizationUserReinvite(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + organizationId + "/users/reinvite", new requests_1.OrganizationUserBulkRequest(ids), true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserBulkResponse);
        });
    }
    postOrganizationUserAcceptInit(organizationId, id, request) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/users/" + id + "/accept-init", request, true, false);
    }
    postOrganizationUserAccept(organizationId, id, request) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/users/" + id + "/accept", request, true, false);
    }
    postOrganizationUserConfirm(organizationId, id, request) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/users/" + id + "/confirm", request, true, false);
    }
    postOrganizationUsersPublicKey(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + organizationId + "/users/public-keys", new requests_1.OrganizationUserBulkRequest(ids), true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserBulkPublicKeyResponse);
        });
    }
    postOrganizationUserBulkConfirm(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + organizationId + "/users/confirm", request, true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserBulkResponse);
        });
    }
    putOrganizationUserBulkEnableSecretsManager(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("PUT", "/organizations/" + organizationId + "/users/enable-secrets-manager", new requests_1.OrganizationUserBulkRequest(ids), true, false);
        });
    }
    putOrganizationUser(organizationId, id, request) {
        return this.apiService.send("PUT", "/organizations/" + organizationId + "/users/" + id, request, true, false);
    }
    putOrganizationUserResetPasswordEnrollment(organizationId, userId, request) {
        return this.apiService.send("PUT", "/organizations/" + organizationId + "/users/" + userId + "/reset-password-enrollment", request, true, false);
    }
    putOrganizationUserResetPassword(organizationId, id, request) {
        return this.apiService.send("PUT", "/organizations/" + organizationId + "/users/" + id + "/reset-password", request, true, false);
    }
    deleteOrganizationUser(organizationId, id) {
        return this.apiService.send("DELETE", "/organizations/" + organizationId + "/users/" + id, null, true, false);
    }
    deleteManyOrganizationUsers(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("DELETE", "/organizations/" + organizationId + "/users", new requests_1.OrganizationUserBulkRequest(ids), true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserBulkResponse);
        });
    }
    revokeOrganizationUser(organizationId, id) {
        return this.apiService.send("PUT", "/organizations/" + organizationId + "/users/" + id + "/revoke", null, true, false);
    }
    revokeManyOrganizationUsers(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/organizations/" + organizationId + "/users/revoke", new requests_1.OrganizationUserBulkRequest(ids), true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserBulkResponse);
        });
    }
    restoreOrganizationUser(organizationId, id) {
        return this.apiService.send("PUT", "/organizations/" + organizationId + "/users/" + id + "/restore", null, true, false);
    }
    restoreManyOrganizationUsers(organizationId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/organizations/" + organizationId + "/users/restore", new requests_1.OrganizationUserBulkRequest(ids), true, true);
            return new list_response_1.ListResponse(r, responses_1.OrganizationUserBulkResponse);
        });
    }
}
exports.OrganizationUserServiceImplementation = OrganizationUserServiceImplementation;
//# sourceMappingURL=organization-user.service.implementation.js.map