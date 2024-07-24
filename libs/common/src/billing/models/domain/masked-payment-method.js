"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaskedPaymentMethod = void 0;
class MaskedPaymentMethod {
    static from(response) {
        if (response === undefined) {
            return null;
        }
        return Object.assign({}, response);
    }
}
exports.MaskedPaymentMethod = MaskedPaymentMethod;
//# sourceMappingURL=masked-payment-method.js.map