"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderPlanResponse = exports.ProviderSubscriptionResponse = void 0;
const subscription_suspension_response_1 = require("@bitwarden/common/billing/models/response/subscription-suspension.response");
const tax_info_response_1 = require("@bitwarden/common/billing/models/response/tax-info.response");
const base_response_1 = require("../../../models/response/base.response");
class ProviderSubscriptionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.plans = [];
        this.status = this.getResponseProperty("status");
        this.currentPeriodEndDate = this.getResponseProperty("currentPeriodEndDate");
        this.discountPercentage = this.getResponseProperty("discountPercentage");
        this.collectionMethod = this.getResponseProperty("collectionMethod");
        const plans = this.getResponseProperty("plans");
        if (plans != null) {
            this.plans = plans.map((plan) => new ProviderPlanResponse(plan));
        }
        this.accountCredit = this.getResponseProperty("accountCredit");
        const taxInformation = this.getResponseProperty("taxInformation");
        if (taxInformation != null) {
            this.taxInformation = new tax_info_response_1.TaxInfoResponse(taxInformation);
        }
        this.cancelAt = this.getResponseProperty("cancelAt");
        const suspension = this.getResponseProperty("suspension");
        if (suspension != null) {
            this.suspension = new subscription_suspension_response_1.SubscriptionSuspensionResponse(suspension);
        }
    }
}
exports.ProviderSubscriptionResponse = ProviderSubscriptionResponse;
class ProviderPlanResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.planName = this.getResponseProperty("PlanName");
        this.seatMinimum = this.getResponseProperty("SeatMinimum");
        this.assignedSeats = this.getResponseProperty("AssignedSeats");
        this.purchasedSeats = this.getResponseProperty("PurchasedSeats");
        this.cost = this.getResponseProperty("Cost");
        this.cadence = this.getResponseProperty("Cadence");
    }
}
exports.ProviderPlanResponse = ProviderPlanResponse;
//# sourceMappingURL=provider-subscription-response.js.map