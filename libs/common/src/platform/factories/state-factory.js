"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateFactory = void 0;
const account_factory_1 = require("./account-factory");
const global_state_factory_1 = require("./global-state-factory");
class StateFactory {
    constructor(globalStateConstructor, accountConstructor) {
        this.globalStateFactory = new global_state_factory_1.GlobalStateFactory(globalStateConstructor);
        this.accountFactory = new account_factory_1.AccountFactory(accountConstructor);
    }
    createGlobal(args) {
        return this.globalStateFactory.create(args);
    }
    createAccount(args) {
        return this.accountFactory.create(args);
    }
}
exports.StateFactory = StateFactory;
//# sourceMappingURL=state-factory.js.map