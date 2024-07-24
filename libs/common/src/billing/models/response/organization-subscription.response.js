"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingCustomerDiscount = exports.OrganizationSubscriptionResponse = void 0;
const organization_response_1 = require("../../../admin-console/models/response/organization.response");
const base_response_1 = require("../../../models/response/base.response");
const subscription_response_1 = require("./subscription.response");
class OrganizationSubscriptionResponse extends organization_response_1.OrganizationResponse {
    constructor(response) {
        super(response);
        this.storageName = this.getResponseProperty("StorageName");
        this.storageGb = this.getResponseProperty("StorageGb");
        const subscription = this.getResponseProperty("Subscription");
        this.subscription = subscription == null ? null : new subscription_response_1.BillingSubscriptionResponse(subscription);
        const upcomingInvoice = this.getResponseProperty("UpcomingInvoice");
        this.upcomingInvoice =
            upcomingInvoice == null
                ? null
                : new subscription_response_1.BillingSubscriptionUpcomingInvoiceResponse(upcomingInvoice);
        const customerDiscount = this.getResponseProperty("CustomerDiscount");
        this.customerDiscount =
            customerDiscount == null ? null : new BillingCustomerDiscount(customerDiscount);
        this.expiration = this.getResponseProperty("Expiration");
        this.expirationWithoutGracePeriod = this.getResponseProperty("ExpirationWithoutGracePeriod");
    }
}
exports.OrganizationSubscriptionResponse = OrganizationSubscriptionResponse;
class BillingCustomerDiscount extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.active = this.getResponseProperty("Active");
        this.percentOff = this.getResponseProperty("PercentOff");
        this.appliesTo = this.getResponseProperty("AppliesTo");
    }
}
exports.BillingCustomerDiscount = BillingCustomerDiscount;
//# sourceMappingURL=organization-subscription.response.js.map