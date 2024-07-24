"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodType = void 0;
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType[PaymentMethodType["Card"] = 0] = "Card";
    PaymentMethodType[PaymentMethodType["BankAccount"] = 1] = "BankAccount";
    PaymentMethodType[PaymentMethodType["PayPal"] = 2] = "PayPal";
    PaymentMethodType[PaymentMethodType["BitPay"] = 3] = "BitPay";
    PaymentMethodType[PaymentMethodType["Credit"] = 4] = "Credit";
    PaymentMethodType[PaymentMethodType["WireTransfer"] = 5] = "WireTransfer";
    PaymentMethodType[PaymentMethodType["Check"] = 8] = "Check";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
//# sourceMappingURL=payment-method-type.enum.js.map