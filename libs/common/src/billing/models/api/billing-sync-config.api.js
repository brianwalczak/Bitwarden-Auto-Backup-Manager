"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingSyncConfigApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class BillingSyncConfigApi extends base_response_1.BaseResponse {
    constructor(data) {
        super(data);
        if (data == null) {
            return;
        }
        this.billingSyncKey = this.getResponseProperty("BillingSyncKey");
        const lastLicenseSyncString = this.getResponseProperty("LastLicenseSync");
        if (lastLicenseSyncString) {
            this.lastLicenseSync = new Date(lastLicenseSyncString);
        }
    }
}
exports.BillingSyncConfigApi = BillingSyncConfigApi;
//# sourceMappingURL=billing-sync-config.api.js.map