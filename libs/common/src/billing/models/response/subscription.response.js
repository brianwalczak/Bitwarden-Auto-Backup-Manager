"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingSubscriptionUpcomingInvoiceResponse = exports.BillingSubscriptionItemResponse = exports.BillingSubscriptionResponse = exports.SubscriptionResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class SubscriptionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.storageName = this.getResponseProperty("StorageName");
        this.storageGb = this.getResponseProperty("StorageGb");
        this.maxStorageGb = this.getResponseProperty("MaxStorageGb");
        this.license = this.getResponseProperty("License");
        this.expiration = this.getResponseProperty("Expiration");
        const subscription = this.getResponseProperty("Subscription");
        const upcomingInvoice = this.getResponseProperty("UpcomingInvoice");
        this.subscription = subscription == null ? null : new BillingSubscriptionResponse(subscription);
        this.upcomingInvoice =
            upcomingInvoice == null
                ? null
                : new BillingSubscriptionUpcomingInvoiceResponse(upcomingInvoice);
    }
}
exports.SubscriptionResponse = SubscriptionResponse;
class BillingSubscriptionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.items = [];
        this.trialStartDate = this.getResponseProperty("TrialStartDate");
        this.trialEndDate = this.getResponseProperty("TrialEndDate");
        this.periodStartDate = this.getResponseProperty("PeriodStartDate");
        this.periodEndDate = this.getResponseProperty("PeriodEndDate");
        this.cancelledDate = this.getResponseProperty("CancelledDate");
        this.cancelAtEndDate = this.getResponseProperty("CancelAtEndDate");
        this.status = this.getResponseProperty("Status");
        this.cancelled = this.getResponseProperty("Cancelled");
        const items = this.getResponseProperty("Items");
        if (items != null) {
            this.items = items.map((i) => new BillingSubscriptionItemResponse(i));
        }
        this.collectionMethod = this.getResponseProperty("CollectionMethod");
        this.suspensionDate = this.getResponseProperty("SuspensionDate");
        this.unpaidPeriodEndDate = this.getResponseProperty("unpaidPeriodEndDate");
        this.gracePeriod = this.getResponseProperty("GracePeriod");
    }
}
exports.BillingSubscriptionResponse = BillingSubscriptionResponse;
class BillingSubscriptionItemResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.productId = this.getResponseProperty("ProductId");
        this.name = this.getResponseProperty("Name");
        this.amount = this.getResponseProperty("Amount");
        this.quantity = this.getResponseProperty("Quantity");
        this.interval = this.getResponseProperty("Interval");
        this.sponsoredSubscriptionItem = this.getResponseProperty("SponsoredSubscriptionItem");
        this.addonSubscriptionItem = this.getResponseProperty("AddonSubscriptionItem");
    }
}
exports.BillingSubscriptionItemResponse = BillingSubscriptionItemResponse;
class BillingSubscriptionUpcomingInvoiceResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.date = this.getResponseProperty("Date");
        this.amount = this.getResponseProperty("Amount");
    }
}
exports.BillingSubscriptionUpcomingInvoiceResponse = BillingSubscriptionUpcomingInvoiceResponse;
//# sourceMappingURL=subscription.response.js.map