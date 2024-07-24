"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizedPaymentMethodRequest = void 0;
class TokenizedPaymentMethodRequest {
    static From(tokenizedPaymentMethod) {
        const request = new TokenizedPaymentMethodRequest();
        request.type = tokenizedPaymentMethod.type;
        request.token = tokenizedPaymentMethod.token;
        return request;
    }
}
exports.TokenizedPaymentMethodRequest = TokenizedPaymentMethodRequest;
//# sourceMappingURL=tokenized-payment-method.request.js.map