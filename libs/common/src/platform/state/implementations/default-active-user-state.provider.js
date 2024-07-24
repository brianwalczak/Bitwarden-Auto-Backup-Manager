"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultActiveUserStateProvider = void 0;
const rxjs_1 = require("rxjs");
const default_active_user_state_1 = require("./default-active-user-state");
class DefaultActiveUserStateProvider {
    constructor(accountService, singleUserStateProvider) {
        this.accountService = accountService;
        this.singleUserStateProvider = singleUserStateProvider;
        this.activeUserId$ = this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id), 
        // To avoid going to storage when we don't need to, only get updates when there is a true change.
        (0, rxjs_1.distinctUntilChanged)((a, b) => (a == null || b == null ? a == b : a === b)));
    }
    get(keyDefinition) {
        // All other providers cache the creation of their corresponding `State` objects, this instance
        // doesn't need to do that since it calls `SingleUserStateProvider` it will go through their caching
        // layer, because of that, the creation of this instance is quite simple and not worth caching.
        return new default_active_user_state_1.DefaultActiveUserState(keyDefinition, this.activeUserId$, this.singleUserStateProvider);
    }
}
exports.DefaultActiveUserStateProvider = DefaultActiveUserStateProvider;
//# sourceMappingURL=default-active-user-state.provider.js.map