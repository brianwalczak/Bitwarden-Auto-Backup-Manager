"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationResponse = void 0;
const plan_response_1 = require("../../../billing/models/response/plan.response");
const base_response_1 = require("../../../models/response/base.response");
class OrganizationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.name = this.getResponseProperty("Name");
        this.businessName = this.getResponseProperty("BusinessName");
        this.businessAddress1 = this.getResponseProperty("BusinessAddress1");
        this.businessAddress2 = this.getResponseProperty("BusinessAddress2");
        this.businessAddress3 = this.getResponseProperty("BusinessAddress3");
        this.businessCountry = this.getResponseProperty("BusinessCountry");
        this.businessTaxNumber = this.getResponseProperty("BusinessTaxNumber");
        this.billingEmail = this.getResponseProperty("BillingEmail");
        const plan = this.getResponseProperty("Plan");
        this.plan = plan == null ? null : new plan_response_1.PlanResponse(plan);
        this.planType = this.getResponseProperty("PlanType");
        this.seats = this.getResponseProperty("Seats");
        this.maxAutoscaleSeats = this.getResponseProperty("MaxAutoscaleSeats");
        this.maxCollections = this.getResponseProperty("MaxCollections");
        this.maxStorageGb = this.getResponseProperty("MaxStorageGb");
        this.useGroups = this.getResponseProperty("UseGroups");
        this.useDirectory = this.getResponseProperty("UseDirectory");
        this.useEvents = this.getResponseProperty("UseEvents");
        this.useTotp = this.getResponseProperty("UseTotp");
        this.use2fa = this.getResponseProperty("Use2fa");
        this.useApi = this.getResponseProperty("UseApi");
        this.useResetPassword = this.getResponseProperty("UseResetPassword");
        this.useSecretsManager = this.getResponseProperty("UseSecretsManager");
        this.hasPublicAndPrivateKeys = this.getResponseProperty("HasPublicAndPrivateKeys");
        this.usePasswordManager = this.getResponseProperty("UsePasswordManager");
        this.smSeats = this.getResponseProperty("SmSeats");
        this.smServiceAccounts = this.getResponseProperty("SmServiceAccounts");
        this.maxAutoscaleSmSeats = this.getResponseProperty("MaxAutoscaleSmSeats");
        this.maxAutoscaleSmServiceAccounts = this.getResponseProperty("MaxAutoscaleSmServiceAccounts");
        this.limitCollectionCreationDeletion = this.getResponseProperty("LimitCollectionCreationDeletion");
        this.allowAdminAccessToAllCollectionItems = this.getResponseProperty("AllowAdminAccessToAllCollectionItems");
        this.flexibleCollections = this.getResponseProperty("FlexibleCollections");
    }
}
exports.OrganizationResponse = OrganizationResponse;
//# sourceMappingURL=organization.response.js.map