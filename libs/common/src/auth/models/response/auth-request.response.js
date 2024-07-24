"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequestResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const RequestTimeOut = 60000 * 15; //15 Minutes
class AuthRequestResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.publicKey = this.getResponseProperty("PublicKey");
        this.requestDeviceType = this.getResponseProperty("RequestDeviceType");
        this.requestIpAddress = this.getResponseProperty("RequestIpAddress");
        this.key = this.getResponseProperty("Key");
        this.masterPasswordHash = this.getResponseProperty("MasterPasswordHash");
        this.creationDate = this.getResponseProperty("CreationDate");
        this.requestApproved = this.getResponseProperty("RequestApproved");
        this.responseDate = this.getResponseProperty("ResponseDate");
        const requestDate = new Date(this.creationDate);
        const requestDateUTC = Date.UTC(requestDate.getUTCFullYear(), requestDate.getUTCMonth(), requestDate.getDate(), requestDate.getUTCHours(), requestDate.getUTCMinutes(), requestDate.getUTCSeconds(), requestDate.getUTCMilliseconds());
        const dateNow = new Date(Date.now());
        const dateNowUTC = Date.UTC(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getDate(), dateNow.getUTCHours(), dateNow.getUTCMinutes(), dateNow.getUTCSeconds(), dateNow.getUTCMilliseconds());
        this.isExpired = dateNowUTC - requestDateUTC >= RequestTimeOut;
        this.isAnswered = this.requestApproved != null && this.responseDate != null;
    }
}
exports.AuthRequestResponse = AuthRequestResponse;
//# sourceMappingURL=auth-request.response.js.map