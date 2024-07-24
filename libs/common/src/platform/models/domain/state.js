"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class State {
    constructor(globals) {
        this.accounts = {};
        this.globals = globals;
    }
    // TODO, make Jsonify<State,TGlobalState,TAccount> work. It currently doesn't because Globals doesn't implement Jsonify.
    static fromJSON(obj, accountDeserializer) {
        if (obj == null) {
            return null;
        }
        return Object.assign(new State(null), obj, {
            accounts: State.buildAccountMapFromJSON(obj === null || obj === void 0 ? void 0 : obj.accounts, accountDeserializer),
        });
    }
    static buildAccountMapFromJSON(jsonAccounts, accountDeserializer) {
        if (!jsonAccounts) {
            return {};
        }
        const accounts = {};
        for (const userId in jsonAccounts) {
            accounts[userId] = accountDeserializer(jsonAccounts[userId]);
        }
        return accounts;
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map