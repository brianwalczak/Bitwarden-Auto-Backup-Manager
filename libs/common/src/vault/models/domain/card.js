"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const card_data_1 = require("../data/card.data");
const card_view_1 = require("../view/card.view");
class Card extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new card_view_1.CardView(), {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        }, orgId, encKey);
    }
    toCardData() {
        const c = new card_data_1.CardData();
        this.buildDataModel(this, c, {
            cardholderName: null,
            brand: null,
            number: null,
            expMonth: null,
            expYear: null,
            code: null,
        });
        return c;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const cardholderName = enc_string_1.EncString.fromJSON(obj.cardholderName);
        const brand = enc_string_1.EncString.fromJSON(obj.brand);
        const number = enc_string_1.EncString.fromJSON(obj.number);
        const expMonth = enc_string_1.EncString.fromJSON(obj.expMonth);
        const expYear = enc_string_1.EncString.fromJSON(obj.expYear);
        const code = enc_string_1.EncString.fromJSON(obj.code);
        return Object.assign(new Card(), obj, {
            cardholderName,
            brand,
            number,
            expMonth,
            expYear,
            code,
        });
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map