"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class IdentityApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.title = this.getResponseProperty("Title");
        this.firstName = this.getResponseProperty("FirstName");
        this.middleName = this.getResponseProperty("MiddleName");
        this.lastName = this.getResponseProperty("LastName");
        this.address1 = this.getResponseProperty("Address1");
        this.address2 = this.getResponseProperty("Address2");
        this.address3 = this.getResponseProperty("Address3");
        this.city = this.getResponseProperty("City");
        this.state = this.getResponseProperty("State");
        this.postalCode = this.getResponseProperty("PostalCode");
        this.country = this.getResponseProperty("Country");
        this.company = this.getResponseProperty("Company");
        this.email = this.getResponseProperty("Email");
        this.phone = this.getResponseProperty("Phone");
        this.ssn = this.getResponseProperty("SSN");
        this.username = this.getResponseProperty("Username");
        this.passportNumber = this.getResponseProperty("PassportNumber");
        this.licenseNumber = this.getResponseProperty("LicenseNumber");
    }
}
exports.IdentityApi = IdentityApi;
//# sourceMappingURL=identity.api.js.map