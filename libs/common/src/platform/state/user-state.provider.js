"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveUserStateProvider = exports.SingleUserStateProvider = void 0;
/** A provider for getting an implementation of state scoped to a given key and userId */
class SingleUserStateProvider {
}
exports.SingleUserStateProvider = SingleUserStateProvider;
/** A provider for getting an implementation of state scoped to a given key, but always pointing
 * to the currently active user
 */
class ActiveUserStateProvider {
}
exports.ActiveUserStateProvider = ActiveUserStateProvider;
//# sourceMappingURL=user-state.provider.js.map