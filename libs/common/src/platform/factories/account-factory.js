"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountFactory = void 0;
class AccountFactory {
    constructor(accountConstructor) {
        this.accountConstructor = accountConstructor;
    }
    create(args) {
        return new this.accountConstructor(args);
    }
}
exports.AccountFactory = AccountFactory;
//# sourceMappingURL=account-factory.js.map