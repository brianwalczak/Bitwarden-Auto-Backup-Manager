"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Charge"] = 0] = "Charge";
    TransactionType[TransactionType["Credit"] = 1] = "Credit";
    TransactionType[TransactionType["PromotionalCredit"] = 2] = "PromotionalCredit";
    TransactionType[TransactionType["ReferralCredit"] = 3] = "ReferralCredit";
    TransactionType[TransactionType["Refund"] = 4] = "Refund";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
//# sourceMappingURL=transaction-type.enum.js.map