"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSubscriptionUpdateRequest = void 0;
class OrganizationSubscriptionUpdateRequest {
    /**
     * Build a subscription update request for the Password Manager product type.
     * @param seatAdjustment - The number of seats to add or remove from the subscription.
     * @param maxAutoscaleSeats - The maximum number of seats that can be auto-scaled for the subscription.
     */
    constructor(seatAdjustment, maxAutoscaleSeats) {
        this.seatAdjustment = seatAdjustment;
        this.maxAutoscaleSeats = maxAutoscaleSeats;
    }
}
exports.OrganizationSubscriptionUpdateRequest = OrganizationSubscriptionUpdateRequest;
//# sourceMappingURL=organization-subscription-update.request.js.map