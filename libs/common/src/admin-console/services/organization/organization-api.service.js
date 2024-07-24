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
exports.OrganizationApiService = void 0;
const billing_history_response_1 = require("@bitwarden/common/billing/models/response/billing-history.response");
const api_key_response_1 = require("../../../auth/models/response/api-key.response");
const organization_sso_response_1 = require("../../../auth/models/response/organization-sso.response");
const billing_response_1 = require("../../../billing/models/response/billing.response");
const organization_subscription_response_1 = require("../../../billing/models/response/organization-subscription.response");
const payment_response_1 = require("../../../billing/models/response/payment.response");
const tax_info_response_1 = require("../../../billing/models/response/tax-info.response");
const list_response_1 = require("../../../models/response/list.response");
const organization_api_key_information_response_1 = require("../../models/response/organization-api-key-information.response");
const organization_auto_enroll_status_response_1 = require("../../models/response/organization-auto-enroll-status.response");
const organization_keys_response_1 = require("../../models/response/organization-keys.response");
const organization_response_1 = require("../../models/response/organization.response");
const profile_organization_response_1 = require("../../models/response/profile-organization.response");
class OrganizationApiService {
    constructor(apiService, syncService) {
        this.apiService = apiService;
        this.syncService = syncService;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id, null, true, true);
            return new organization_response_1.OrganizationResponse(r);
        });
    }
    getBilling(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/billing", null, true, true);
            return new billing_response_1.BillingResponse(r);
        });
    }
    getBillingHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/billing/history", null, true, true);
            return new billing_history_response_1.BillingHistoryResponse(r);
        });
    }
    getSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/subscription", null, true, true);
            return new organization_subscription_response_1.OrganizationSubscriptionResponse(r);
        });
    }
    getLicense(id, installationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("GET", "/organizations/" + id + "/license?installationId=" + installationId, null, true, true);
        });
    }
    getAutoEnrollStatus(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + identifier + "/auto-enroll-status", null, true, true);
            return new organization_auto_enroll_status_response_1.OrganizationAutoEnrollStatusResponse(r);
        });
    }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations", request, true, true);
            // Forcing a sync will notify organization service that they need to repull
            yield this.syncService.fullSync(true);
            return new organization_response_1.OrganizationResponse(r);
        });
    }
    createLicense(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/licenses/self-hosted", data, true, true);
            return new organization_response_1.OrganizationResponse(r);
        });
    }
    save(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/organizations/" + id, request, true, true);
            const data = new organization_response_1.OrganizationResponse(r);
            yield this.syncService.fullSync(true);
            return data;
        });
    }
    updatePayment(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("POST", "/organizations/" + id + "/payment", request, true, false);
        });
    }
    upgrade(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/upgrade", request, true, true);
            return new payment_response_1.PaymentResponse(r);
        });
    }
    updatePasswordManagerSeats(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("POST", "/organizations/" + id + "/subscription", request, true, false);
        });
    }
    updateSecretsManagerSubscription(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("POST", "/organizations/" + id + "/sm-subscription", request, true, false);
        });
    }
    updateSeats(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/seat", request, true, true);
            return new payment_response_1.PaymentResponse(r);
        });
    }
    updateStorage(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/storage", request, true, true);
            return new payment_response_1.PaymentResponse(r);
        });
    }
    verifyBank(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("POST", "/organizations/" + id + "/verify-bank", request, true, false);
        });
    }
    reinstate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("POST", "/organizations/" + id + "/reinstate", null, true, false);
        });
    }
    leave(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("POST", "/organizations/" + id + "/leave", null, true, false);
            yield this.syncService.fullSync(true);
        });
    }
    delete(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("DELETE", "/organizations/" + id, request, true, false);
            yield this.syncService.fullSync(true);
        });
    }
    deleteUsingToken(organizationId, request) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/delete-recover-token", request, false, false);
    }
    updateLicense(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("POST", "/organizations/licenses/self-hosted/" + id, data, true, false);
        });
    }
    importDirectory(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("POST", "/organizations/" + organizationId + "/import", request, true, false);
        });
    }
    getOrCreateApiKey(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/api-key", request, true, true);
            return new api_key_response_1.ApiKeyResponse(r);
        });
    }
    getApiKeyInformation(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, organizationApiKeyType = null) {
            const uri = organizationApiKeyType === null
                ? "/organizations/" + id + "/api-key-information"
                : "/organizations/" + id + "/api-key-information/" + organizationApiKeyType;
            const r = yield this.apiService.send("GET", uri, null, true, true);
            return new list_response_1.ListResponse(r, organization_api_key_information_response_1.OrganizationApiKeyInformationResponse);
        });
    }
    rotateApiKey(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/rotate-api-key", request, true, true);
            return new api_key_response_1.ApiKeyResponse(r);
        });
    }
    getTaxInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/tax", null, true, true);
            return new tax_info_response_1.TaxInfoResponse(r);
        });
    }
    updateTaxInfo(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Can't broadcast anything because the response doesn't have content
            return this.apiService.send("PUT", "/organizations/" + id + "/tax", request, true, false);
        });
    }
    getKeys(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/keys", null, true, true);
            return new organization_keys_response_1.OrganizationKeysResponse(r);
        });
    }
    updateKeys(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/keys", request, true, true);
            // Not broadcasting anything because data on this response doesn't correspond to `Organization`
            return new organization_keys_response_1.OrganizationKeysResponse(r);
        });
    }
    getSso(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/sso", null, true, true);
            return new organization_sso_response_1.OrganizationSsoResponse(r);
        });
    }
    updateSso(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/sso", request, true, true);
            // Not broadcasting anything because data on this response doesn't correspond to `Organization`
            return new organization_sso_response_1.OrganizationSsoResponse(r);
        });
    }
    selfHostedSyncLicense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("POST", "/organizations/licenses/self-hosted/" + id + "/sync/", null, true, false);
        });
    }
    subscribeToSecretsManager(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/organizations/" + id + "/subscribe-secrets-manager", request, true, true);
            return new profile_organization_response_1.ProfileOrganizationResponse(r);
        });
    }
    updateCollectionManagement(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/organizations/" + id + "/collection-management", request, true, true);
            const data = new organization_response_1.OrganizationResponse(r);
            yield this.syncService.fullSync(true);
            return data;
        });
    }
}
exports.OrganizationApiService = OrganizationApiService;
//# sourceMappingURL=organization-api.service.js.map