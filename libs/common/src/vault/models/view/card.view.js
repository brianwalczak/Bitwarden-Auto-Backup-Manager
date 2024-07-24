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
exports.CardView = void 0;
const enums_1 = require("../../enums");
const linked_field_option_decorator_1 = require("../../linked-field-option.decorator");
const item_view_1 = require("./item.view");
class CardView extends item_view_1.ItemView {
    constructor() {
        super(...arguments);
        this.cardholderName = null;
        this.expMonth = null;
        this.expYear = null;
        this.code = null;
        this._brand = null;
        this._number = null;
        this._subTitle = null;
    }
    get maskedCode() {
        return this.code != null ? "•".repeat(this.code.length) : null;
    }
    get maskedNumber() {
        return this.number != null ? "•".repeat(this.number.length) : null;
    }
    get brand() {
        return this._brand;
    }
    set brand(value) {
        this._brand = value;
        this._subTitle = null;
    }
    get number() {
        return this._number;
    }
    set number(value) {
        this._number = value;
        this._subTitle = null;
    }
    get subTitle() {
        if (this._subTitle == null) {
            this._subTitle = this.brand;
            if (this.number != null && this.number.length >= 4) {
                if (this._subTitle != null && this._subTitle !== "") {
                    this._subTitle += ", ";
                }
                else {
                    this._subTitle = "";
                }
                // Show last 5 on amex, last 4 for all others
                const count = this.number.length >= 5 && this.number.match(new RegExp("^3[47]")) != null ? 5 : 4;
                this._subTitle += "*" + this.number.substr(this.number.length - count);
            }
        }
        return this._subTitle;
    }
    get expiration() {
        if (!this.expMonth && !this.expYear) {
            return null;
        }
        let exp = this.expMonth != null ? ("0" + this.expMonth).slice(-2) : "__";
        exp += " / " + (this.expYear != null ? this.formatYear(this.expYear) : "____");
        return exp;
    }
    formatYear(year) {
        return year.length === 2 ? "20" + year : year;
    }
    static fromJSON(obj) {
        return Object.assign(new CardView(), obj);
    }
    // ref https://stackoverflow.com/a/5911300
    static getCardBrandByPatterns(cardNum) {
        if (cardNum == null || typeof cardNum !== "string" || cardNum.trim() === "") {
            return null;
        }
        // Visa
        let re = new RegExp("^4");
        if (cardNum.match(re) != null) {
            return "Visa";
        }
        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cardNum)) {
            return "Mastercard";
        }
        // AMEX
        re = new RegExp("^3[47]");
        if (cardNum.match(re) != null) {
            return "Amex";
        }
        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (cardNum.match(re) != null) {
            return "Discover";
        }
        // Diners
        re = new RegExp("^36");
        if (cardNum.match(re) != null) {
            return "Diners Club";
        }
        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (cardNum.match(re) != null) {
            return "Diners Club";
        }
        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (cardNum.match(re) != null) {
            return "JCB";
        }
        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (cardNum.match(re) != null) {
            return "Visa";
        }
        return null;
    }
}
exports.CardView = CardView;
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.CardLinkedId.CardholderName),
    __metadata("design:type", String)
], CardView.prototype, "cardholderName", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.CardLinkedId.ExpMonth, "expirationMonth"),
    __metadata("design:type", String)
], CardView.prototype, "expMonth", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.CardLinkedId.ExpYear, "expirationYear"),
    __metadata("design:type", String)
], CardView.prototype, "expYear", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.CardLinkedId.Code, "securityCode"),
    __metadata("design:type", String)
], CardView.prototype, "code", void 0);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.CardLinkedId.Brand),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], CardView.prototype, "brand", null);
__decorate([
    (0, linked_field_option_decorator_1.linkedFieldOption)(enums_1.CardLinkedId.Number),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], CardView.prototype, "number", null);
//# sourceMappingURL=card.view.js.map