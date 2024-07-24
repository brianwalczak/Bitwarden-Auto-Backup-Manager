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
exports.OrganizationBillingService = void 0;
const organization_create_request_1 = require("../../admin-console/models/request/organization-create.request");
const organization_keys_request_1 = require("../../admin-console/models/request/organization-keys.request");
const enums_1 = require("../enums");
class OrganizationBillingService {
    constructor(apiService, cryptoService, encryptService, i18nService, organizationApiService, syncService) {
        this.apiService = apiService;
        this.cryptoService = cryptoService;
        this.encryptService = encryptService;
        this.i18nService = i18nService;
        this.organizationApiService = organizationApiService;
        this.syncService = syncService;
    }
    purchaseSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new organization_create_request_1.OrganizationCreateRequest();
            const organizationKeys = yield this.makeOrganizationKeys();
            this.setOrganizationKeys(request, organizationKeys);
            this.setOrganizationInformation(request, subscription.organization);
            this.setPlanInformation(request, subscription.plan);
            this.setPaymentInformation(request, subscription.payment);
            const response = yield this.organizationApiService.create(request);
            yield this.apiService.refreshIdentityToken();
            yield this.syncService.fullSync(true);
            return response;
        });
    }
    startFree(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new organization_create_request_1.OrganizationCreateRequest();
            const organizationKeys = yield this.makeOrganizationKeys();
            this.setOrganizationKeys(request, organizationKeys);
            this.setOrganizationInformation(request, subscription.organization);
            this.setPlanInformation(request, subscription.plan);
            const response = yield this.organizationApiService.create(request);
            yield this.apiService.refreshIdentityToken();
            yield this.syncService.fullSync(true);
            return response;
        });
    }
    makeOrganizationKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const [encryptedKey, key] = yield this.cryptoService.makeOrgKey();
            const [publicKey, encryptedPrivateKey] = yield this.cryptoService.makeKeyPair(key);
            const encryptedCollectionName = yield this.encryptService.encrypt(this.i18nService.t("defaultCollection"), key);
            return {
                encryptedKey,
                publicKey,
                encryptedPrivateKey,
                encryptedCollectionName,
            };
        });
    }
    prohibitsAdditionalSeats(planType) {
        switch (planType) {
            case enums_1.PlanType.Free:
            case enums_1.PlanType.FamiliesAnnually:
            case enums_1.PlanType.FamiliesAnnually2019:
            case enums_1.PlanType.TeamsStarter2023:
            case enums_1.PlanType.TeamsStarter:
                return true;
            default:
                return false;
        }
    }
    setOrganizationInformation(request, information) {
        request.name = information.name;
        request.businessName = information.businessName;
        request.billingEmail = information.billingEmail;
        request.initiationPath = information.initiationPath;
    }
    setOrganizationKeys(request, keys) {
        request.key = keys.encryptedKey.encryptedString;
        request.keys = new organization_keys_request_1.OrganizationKeysRequest(keys.publicKey, keys.encryptedPrivateKey.encryptedString);
        request.collectionName = keys.encryptedCollectionName.encryptedString;
    }
    setPaymentInformation(request, information) {
        const [paymentToken, paymentMethodType] = information.paymentMethod;
        request.paymentToken = paymentToken;
        request.paymentMethodType = paymentMethodType;
        const billingInformation = information.billing;
        request.billingAddressPostalCode = billingInformation.postalCode;
        request.billingAddressCountry = billingInformation.country;
        if (billingInformation.taxId) {
            request.taxIdNumber = billingInformation.taxId;
            request.billingAddressLine1 = billingInformation.addressLine1;
            request.billingAddressLine2 = billingInformation.addressLine2;
            request.billingAddressCity = billingInformation.city;
            request.billingAddressState = billingInformation.state;
        }
    }
    setPlanInformation(request, information) {
        request.planType = information.type;
        if (this.prohibitsAdditionalSeats(request.planType)) {
            request.useSecretsManager = information.subscribeToSecretsManager;
            request.isFromSecretsManagerTrial = information.isFromSecretsManagerTrial;
            return;
        }
        request.additionalSeats = information.passwordManagerSeats;
        if (information.subscribeToSecretsManager) {
            request.useSecretsManager = true;
            request.isFromSecretsManagerTrial = information.isFromSecretsManagerTrial;
            request.additionalSmSeats = information.secretsManagerSeats;
            request.additionalServiceAccounts = information.secretsManagerServiceAccounts;
        }
        if (information.storage) {
            request.additionalStorageGb = information.storage;
        }
    }
}
exports.OrganizationBillingService = OrganizationBillingService;
//# sourceMappingURL=organization-billing.service.js.map