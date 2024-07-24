"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class CardApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.cardholderName = this.getResponseProperty("CardholderName");
        this.brand = this.getResponseProperty("Brand");
        this.number = this.getResponseProperty("Number");
        this.expMonth = this.getResponseProperty("ExpMonth");
        this.expYear = this.getResponseProperty("ExpYear");
        this.code = this.getResponseProperty("Code");
    }
}
exports.CardApi = CardApi;
//# sourceMappingURL=card.api.js.map