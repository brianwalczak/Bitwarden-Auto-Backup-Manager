"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxInformation = void 0;
class TaxInformation {
    static empty() {
        return {
            country: null,
            postalCode: null,
            taxId: null,
            line1: null,
            line2: null,
            city: null,
            state: null,
        };
    }
    static from(response) {
        if (response === null) {
            return TaxInformation.empty();
        }
        return Object.assign({}, response);
    }
}
exports.TaxInformation = TaxInformation;
//# sourceMappingURL=tax-information.js.map