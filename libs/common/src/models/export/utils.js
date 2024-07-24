"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeGetString = safeGetString;
function safeGetString(value) {
    if (value == null) {
        return null;
    }
    if (typeof value == "string") {
        return value;
    }
    return value === null || value === void 0 ? void 0 : value.encryptedString;
}
//# sourceMappingURL=utils.js.map