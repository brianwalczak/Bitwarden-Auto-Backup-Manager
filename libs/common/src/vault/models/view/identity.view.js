"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityView = void 0;
const utils_1 = require("../../../platform/misc/utils");
const enums_1 = require("../../enums");
const linked_field_option_decorator_1 = require("../../linked-field-option.decorator");
const item_view_1 = require("./item.view");
class IdentityView extends item_view_1.ItemView {
    constructor() {
        super();
        this.title = null;
        this.middleName = null;
        this.address1 = null;
        this.address2 = null;
        this.address3 = null;
        this.city = null;
        this.state = null;
        this.postalCode = null;
        this.country = null;
        this.company = null;
        this.email = null;
        this.phone = null;
        this.ssn = null;
        this.username = null;
        this.passportNumber = null;
        this.licenseNumber = null;
        this._firstName = null;
        this._lastName = null;
        this._subTitle = null;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
        this._subTitle = null;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
        this._subTitle = null;
    }
    get subTitle() {
        if (this._subTitle == null && (this.firstName != null || this.lastName != null)) {
            this._subTitle = "";
            if (this.firstName != null) {
                this._subTitle = this.firstName;
            }
            if (this.lastName != null) {
                if (this._subTitle !== "") {
                    this._subTitle += " ";
                }
                this._subTitle += this.lastName;
            }
        }
        return this._subTitle;
    }
    get fullName() {
        if (this.title != null ||
            this.firstName != null ||
            this.middleName != null ||
            this.lastName != null) {
            let name = "";
            if (this.title != null) {
                name += this.title + " ";
            }
            if (this.firstName != null) {
                name += this.firstName + " ";
            }
            if (this.middleName != null) {
                name += this.middleName + " ";
            }
            if (this.lastName != null) {
                name += this.lastName;
            }
            return name.trim();
        }
        return null;
    }
    get fullAddress() {
        let address = this.address1;
        if (!utils_1.Utils.isNullOrWhitespace(this.address2)) {
            if (!utils_1.Utils.isNullOrWhitespace(address)) {
                address += ", ";
            }
            address += this.address2;
        }
        if (!utils_1.Utils.isNullOrWhitespace(this.address3)) {
            if (!utils_1.Utils.isNullOrWhitespace(address)) {
                address += ", ";
            }
            address += this.address3;
        }
        return address;
    }
    get fullAddressPart2() {
        if (this.city == null && this.state == null && this.postalCode == null) {
            return null;
        }
        const city = this.city || "-";
        const state = this.state;
        const postalCode = this.postalCode || "-";
        let addressPart2 = city;
        if (!utils_1.Utils.isNullOrWhitespace(state)) {
            addressPart2 += ", " + state;
        }
        addressPart2 += ", " + postalCode;
        return addressPart2;
    }
    get fullAddressForCopy() {
        let address = this.fullAddress;
        if (this.city != null || this.state != null || this.postalCode != null) {
            address += "\n" + this.fullAddressPart2;
        }
        if (this.country != null) {
            address += "\n" + this.country;
        }
        return address;
    }
    static fromJSON(obj) {
        return Object.assign(new IdentityView(), obj);
    }
}
exports.IdentityView = IdentityView;
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Title),
    __metadata("design:type", String)
], IdentityView.prototype, "title", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.MiddleName),
    __metadata("design:type", String)
], IdentityView.prototype, "middleName", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Address1),
    __metadata("design:type", String)
], IdentityView.prototype, "address1", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Address2),
    __metadata("design:type", String)
], IdentityView.prototype, "address2", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Address3),
    __metadata("design:type", String)
], IdentityView.prototype, "address3", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.City, "cityTown"),
    __metadata("design:type", String)
], IdentityView.prototype, "city", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.State, "stateProvince"),
    __metadata("design:type", String)
], IdentityView.prototype, "state", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.PostalCode, "zipPostalCode"),
    __metadata("design:type", String)
], IdentityView.prototype, "postalCode", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Country),
    __metadata("design:type", String)
], IdentityView.prototype, "country", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Company),
    __metadata("design:type", String)
], IdentityView.prototype, "company", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Email),
    __metadata("design:type", String)
], IdentityView.prototype, "email", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Phone),
    __metadata("design:type", String)
], IdentityView.prototype, "phone", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Ssn),
    __metadata("design:type", String)
], IdentityView.prototype, "ssn", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.Username),
    __metadata("design:type", String)
], IdentityView.prototype, "username", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.PassportNumber),
    __metadata("design:type", String)
], IdentityView.prototype, "passportNumber", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.LicenseNumber),
    __metadata("design:type", String)
], IdentityView.prototype, "licenseNumber", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.FirstName),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], IdentityView.prototype, "firstName", null);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.LastName),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], IdentityView.prototype, "lastName", null);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.IdentityLinkedId.FullName),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], IdentityView.prototype, "fullName", null);
//# sourceMappingURL=identity.view.js.map