"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const identity_1 = require("../../vault/models/domain/identity");
const identity_view_1 = require("../../vault/models/view/identity.view");
const utils_1 = require("./utils");
class IdentityExport {
    static template() {
        const req = new IdentityExport();
        req.title = "Mr";
        req.firstName = "John";
        req.middleName = "William";
        req.lastName = "Doe";
        req.address1 = "123 Any St";
        req.address2 = "Apt #123";
        req.address3 = null;
        req.city = "New York";
        req.state = "NY";
        req.postalCode = "10001";
        req.country = "US";
        req.company = "Acme Inc.";
        req.email = "john@company.com";
        req.phone = "5555551234";
        req.ssn = "000-123-4567";
        req.username = "jdoe";
        req.passportNumber = "US-123456789";
        req.licenseNumber = "D123-12-123-12333";
        return req;
    }
    static toView(req, view = new identity_view_1.IdentityView()) {
        view.title = req.title;
        view.firstName = req.firstName;
        view.middleName = req.middleName;
        view.lastName = req.lastName;
        view.address1 = req.address1;
        view.address2 = req.address2;
        view.address3 = req.address3;
        view.city = req.city;
        view.state = req.state;
        view.postalCode = req.postalCode;
        view.country = req.country;
        view.company = req.company;
        view.email = req.email;
        view.phone = req.phone;
        view.ssn = req.ssn;
        view.username = req.username;
        view.passportNumber = req.passportNumber;
        view.licenseNumber = req.licenseNumber;
        return view;
    }
    static toDomain(req, domain = new identity_1.Identity()) {
        domain.title = req.title != null ? new enc_string_1.EncString(req.title) : null;
        domain.firstName = req.firstName != null ? new enc_string_1.EncString(req.firstName) : null;
        domain.middleName = req.middleName != null ? new enc_string_1.EncString(req.middleName) : null;
        domain.lastName = req.lastName != null ? new enc_string_1.EncString(req.lastName) : null;
        domain.address1 = req.address1 != null ? new enc_string_1.EncString(req.address1) : null;
        domain.address2 = req.address2 != null ? new enc_string_1.EncString(req.address2) : null;
        domain.address3 = req.address3 != null ? new enc_string_1.EncString(req.address3) : null;
        domain.city = req.city != null ? new enc_string_1.EncString(req.city) : null;
        domain.state = req.state != null ? new enc_string_1.EncString(req.state) : null;
        domain.postalCode = req.postalCode != null ? new enc_string_1.EncString(req.postalCode) : null;
        domain.country = req.country != null ? new enc_string_1.EncString(req.country) : null;
        domain.company = req.company != null ? new enc_string_1.EncString(req.company) : null;
        domain.email = req.email != null ? new enc_string_1.EncString(req.email) : null;
        domain.phone = req.phone != null ? new enc_string_1.EncString(req.phone) : null;
        domain.ssn = req.ssn != null ? new enc_string_1.EncString(req.ssn) : null;
        domain.username = req.username != null ? new enc_string_1.EncString(req.username) : null;
        domain.passportNumber = req.passportNumber != null ? new enc_string_1.EncString(req.passportNumber) : null;
        domain.licenseNumber = req.licenseNumber != null ? new enc_string_1.EncString(req.licenseNumber) : null;
        return domain;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.title = (0, utils_1.safeGetString)(o.title);
        this.firstName = (0, utils_1.safeGetString)(o.firstName);
        this.middleName = (0, utils_1.safeGetString)(o.middleName);
        this.lastName = (0, utils_1.safeGetString)(o.lastName);
        this.address1 = (0, utils_1.safeGetString)(o.address1);
        this.address2 = (0, utils_1.safeGetString)(o.address2);
        this.address3 = (0, utils_1.safeGetString)(o.address3);
        this.city = (0, utils_1.safeGetString)(o.city);
        this.state = (0, utils_1.safeGetString)(o.state);
        this.postalCode = (0, utils_1.safeGetString)(o.postalCode);
        this.country = (0, utils_1.safeGetString)(o.country);
        this.company = (0, utils_1.safeGetString)(o.company);
        this.email = (0, utils_1.safeGetString)(o.email);
        this.phone = (0, utils_1.safeGetString)(o.phone);
        this.ssn = (0, utils_1.safeGetString)(o.ssn);
        this.username = (0, utils_1.safeGetString)(o.username);
        this.passportNumber = (0, utils_1.safeGetString)(o.passportNumber);
        this.licenseNumber = (0, utils_1.safeGetString)(o.licenseNumber);
    }
}
exports.IdentityExport = IdentityExport;
//# sourceMappingURL=identity.export.js.map