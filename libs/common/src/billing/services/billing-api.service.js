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
exports.BillingApiService = void 0;
const invoices_response_1 = require("@bitwarden/common/billing/models/response/invoices.response");
const enums_1 = require("../../billing/enums");
const organization_billing_metadata_response_1 = require("../../billing/models/response/organization-billing-metadata.response");
const organization_billing_status_response_1 = require("../../billing/models/response/organization-billing-status.response");
const organization_subscription_response_1 = require("../../billing/models/response/organization-subscription.response");
const payment_information_response_1 = require("../../billing/models/response/payment-information.response");
const plan_response_1 = require("../../billing/models/response/plan.response");
const list_response_1 = require("../../models/response/list.response");
const provider_subscription_response_1 = require("../models/response/provider-subscription-response");
class BillingApiService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    cancelOrganizationSubscription(organizationId, request) {
        return this.apiService.send("POST", "/organizations/" + organizationId + "/cancel", request, true, false);
    }
    cancelPremiumUserSubscription(request) {
        return this.apiService.send("POST", "/accounts/cancel", request, true, false);
    }
    createClientOrganization(providerId, request) {
        return this.apiService.send("POST", "/providers/" + providerId + "/clients", request, true, false);
    }
    createSetupIntent(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const getPath = () => {
                switch (type) {
                    case enums_1.PaymentMethodType.BankAccount: {
                        return "/setup-intent/bank-account";
                    }
                    case enums_1.PaymentMethodType.Card: {
                        return "/setup-intent/card";
                    }
                }
            };
            const response = yield this.apiService.send("POST", getPath(), null, true, true);
            return response;
        });
    }
    getBillingStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + id + "/billing-status", null, true, true);
            return new organization_billing_status_response_1.OrganizationBillingStatusResponse(r);
        });
    }
    getOrganizationBillingMetadata(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + organizationId + "/billing/metadata", null, true, true);
            return new organization_billing_metadata_response_1.OrganizationBillingMetadataResponse(r);
        });
    }
    getOrganizationSubscription(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/organizations/" + organizationId + "/subscription", null, true, true);
            return new organization_subscription_response_1.OrganizationSubscriptionResponse(r);
        });
    }
    getPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/plans", null, false, true);
            return new list_response_1.ListResponse(r, plan_response_1.PlanResponse);
        });
    }
    getProviderClientInvoiceReport(providerId, invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiService.send("GET", "/providers/" + providerId + "/billing/invoices/" + invoiceId, null, true, true);
            return response;
        });
    }
    getProviderInvoices(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiService.send("GET", "/providers/" + providerId + "/billing/invoices", null, true, true);
            return new invoices_response_1.InvoicesResponse(response);
        });
    }
    getProviderPaymentInformation(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiService.send("GET", "/providers/" + providerId + "/billing/payment-information", null, true, true);
            return new payment_information_response_1.PaymentInformationResponse(response);
        });
    }
    getProviderSubscription(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/providers/" + providerId + "/billing/subscription", null, true, true);
            return new provider_subscription_response_1.ProviderSubscriptionResponse(r);
        });
    }
    updateClientOrganization(providerId, organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiService.send("PUT", "/providers/" + providerId + "/clients/" + organizationId, request, true, false);
        });
    }
    updateProviderPaymentMethod(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiService.send("PUT", "/providers/" + providerId + "/billing/payment-method", request, true, false);
        });
    }
    updateProviderTaxInformation(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiService.send("PUT", "/providers/" + providerId + "/billing/tax-information", request, true, false);
        });
    }
    verifyProviderBankAccount(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.apiService.send("POST", "/providers/" + providerId + "/billing/payment-method/verify-bank-account", request, true, false);
        });
    }
}
exports.BillingApiService = BillingApiService;
//# sourceMappingURL=billing-api.service.js.map