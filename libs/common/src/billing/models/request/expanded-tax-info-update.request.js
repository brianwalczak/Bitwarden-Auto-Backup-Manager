"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandedTaxInfoUpdateRequest = void 0;
const tax_info_update_request_1 = require("./tax-info-update.request");
class ExpandedTaxInfoUpdateRequest extends tax_info_update_request_1.TaxInfoUpdateRequest {
    static From(taxInformation) {
        const request = new ExpandedTaxInfoUpdateRequest();
        request.country = taxInformation.country;
        request.postalCode = taxInformation.postalCode;
        request.taxId = taxInformation.taxId;
        request.line1 = taxInformation.line1;
        request.line2 = taxInformation.line2;
        request.city = taxInformation.city;
        request.state = taxInformation.state;
        return request;
    }
}
exports.ExpandedTaxInfoUpdateRequest = ExpandedTaxInfoUpdateRequest;
//# sourceMappingURL=expanded-tax-info-update.request.js.map