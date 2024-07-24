"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHOD_WARNINGS_KEY = void 0;
const state_1 = require("../../platform/state");
exports.PAYMENT_METHOD_WARNINGS_KEY = state_1.UserKeyDefinition.record(state_1.BILLING_DISK, "paymentMethodWarnings", {
    deserializer: (warnings) => (Object.assign(Object.assign({}, warnings), { savedAt: new Date(warnings.savedAt) })),
    clearOn: ["logout"],
});
//# sourceMappingURL=billing-keys.state.js.map