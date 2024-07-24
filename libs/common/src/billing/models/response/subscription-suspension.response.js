"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSuspensionResponse = void 0;
const base_response_1 = require("@bitwarden/common/models/response/base.response");
class SubscriptionSuspensionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.suspensionDate = this.getResponseProperty("suspensionDate");
        this.unpaidPeriodEndDate = this.getResponseProperty("unpaidPeriodEndDate");
        this.gracePeriod = this.getResponseProperty("gracePeriod");
    }
}
exports.SubscriptionSuspensionResponse = SubscriptionSuspensionResponse;
//# sourceMappingURL=subscription-suspension.response.js.map