"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSponsorshipSyncStatusResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class OrganizationSponsorshipSyncStatusResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        const lastSyncDate = this.getResponseProperty("LastSyncDate");
        if (lastSyncDate) {
            this.lastSyncDate = new Date(lastSyncDate);
        }
    }
}
exports.OrganizationSponsorshipSyncStatusResponse = OrganizationSponsorshipSyncStatusResponse;
//# sourceMappingURL=organization-sponsorship-sync-status.response.js.map