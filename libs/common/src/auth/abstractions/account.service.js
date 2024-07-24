"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalAccountService = exports.AccountService = void 0;
exports.accountInfoEqual = accountInfoEqual;
function accountInfoEqual(a, b) {
    if (a == null && b == null) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
class AccountService {
}
exports.AccountService = AccountService;
class InternalAccountService extends AccountService {
}
exports.InternalAccountService = InternalAccountService;
//# sourceMappingURL=account.service.js.map