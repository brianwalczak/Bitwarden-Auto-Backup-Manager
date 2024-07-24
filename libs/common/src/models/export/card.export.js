"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const card_1 = require("../../vault/models/domain/card");
const card_view_1 = require("../../vault/models/view/card.view");
const utils_1 = require("./utils");
class CardExport {
    static template() {
        const req = new CardExport();
        req.cardholderName = "John Doe";
        req.brand = "visa";
        req.number = "4242424242424242";
        req.expMonth = "04";
        req.expYear = "2023";
        req.code = "123";
        return req;
    }
    static toView(req, view = new card_view_1.CardView()) {
        view.cardholderName = req.cardholderName;
        view.brand = req.brand;
        view.number = req.number;
        view.expMonth = req.expMonth;
        view.expYear = req.expYear;
        view.code = req.code;
        return view;
    }
    static toDomain(req, domain = new card_1.Card()) {
        domain.cardholderName = req.cardholderName != null ? new enc_string_1.EncString(req.cardholderName) : null;
        domain.brand = req.brand != null ? new enc_string_1.EncString(req.brand) : null;
        domain.number = req.number != null ? new enc_string_1.EncString(req.number) : null;
        domain.expMonth = req.expMonth != null ? new enc_string_1.EncString(req.expMonth) : null;
        domain.expYear = req.expYear != null ? new enc_string_1.EncString(req.expYear) : null;
        domain.code = req.code != null ? new enc_string_1.EncString(req.code) : null;
        return domain;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.cardholderName = (0, utils_1.safeGetString)(o.cardholderName);
        this.brand = (0, utils_1.safeGetString)(o.brand);
        this.number = (0, utils_1.safeGetString)(o.number);
        this.expMonth = (0, utils_1.safeGetString)(o.expMonth);
        this.expYear = (0, utils_1.safeGetString)(o.expYear);
        this.code = (0, utils_1.safeGetString)(o.code);
    }
}
exports.CardExport = CardExport;
//# sourceMappingURL=card.export.js.map