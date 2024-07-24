"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const identity_data_1 = require("../data/identity.data");
const identity_view_1 = require("../view/identity.view");
class Identity extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new identity_view_1.IdentityView(), {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        }, orgId, encKey);
    }
    toIdentityData() {
        const i = new identity_data_1.IdentityData();
        this.buildDataModel(this, i, {
            title: null,
            firstName: null,
            middleName: null,
            lastName: null,
            address1: null,
            address2: null,
            address3: null,
            city: null,
            state: null,
            postalCode: null,
            country: null,
            company: null,
            email: null,
            phone: null,
            ssn: null,
            username: null,
            passportNumber: null,
            licenseNumber: null,
        });
        return i;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const title = enc_string_1.EncString.fromJSON(obj.title);
        const firstName = enc_string_1.EncString.fromJSON(obj.firstName);
        const middleName = enc_string_1.EncString.fromJSON(obj.middleName);
        const lastName = enc_string_1.EncString.fromJSON(obj.lastName);
        const address1 = enc_string_1.EncString.fromJSON(obj.address1);
        const address2 = enc_string_1.EncString.fromJSON(obj.address2);
        const address3 = enc_string_1.EncString.fromJSON(obj.address3);
        const city = enc_string_1.EncString.fromJSON(obj.city);
        const state = enc_string_1.EncString.fromJSON(obj.state);
        const postalCode = enc_string_1.EncString.fromJSON(obj.postalCode);
        const country = enc_string_1.EncString.fromJSON(obj.country);
        const company = enc_string_1.EncString.fromJSON(obj.company);
        const email = enc_string_1.EncString.fromJSON(obj.email);
        const phone = enc_string_1.EncString.fromJSON(obj.phone);
        const ssn = enc_string_1.EncString.fromJSON(obj.ssn);
        const username = enc_string_1.EncString.fromJSON(obj.username);
        const passportNumber = enc_string_1.EncString.fromJSON(obj.passportNumber);
        const licenseNumber = enc_string_1.EncString.fromJSON(obj.licenseNumber);
        return Object.assign(new Identity(), obj, {
            title,
            firstName,
            middleName,
            lastName,
            address1,
            address2,
            address3,
            city,
            state,
            postalCode,
            country,
            company,
            email,
            phone,
            ssn,
            username,
            passportNumber,
            licenseNumber,
        });
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map