"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultActiveUserState = void 0;
const rxjs_1 = require("rxjs");
const user_state_1 = require("../user-state");
class DefaultActiveUserState {
    constructor(keyDefinition, activeUserId$, singleUserStateProvider) {
        this.keyDefinition = keyDefinition;
        this.activeUserId$ = activeUserId$;
        this.singleUserStateProvider = singleUserStateProvider;
        this.combinedState$ = this.activeUserId$.pipe((0, rxjs_1.switchMap)((userId) => userId != null
            ? this.singleUserStateProvider.get(userId, this.keyDefinition).combinedState$
            : rxjs_1.NEVER));
        // State should just be combined state without the user id
        this.state$ = this.combinedState$.pipe((0, rxjs_1.map)(([_userId, state]) => state));
    }
    update(configureState_1) {
        return __awaiter(this, arguments, void 0, function* (configureState, options = {}) {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.activeUserId$.pipe((0, rxjs_1.timeout)({
                first: 1000,
                with: () => (0, rxjs_1.throwError)(() => new Error(`Timeout while retrieving active user for key ${this.keyDefinition.fullName}.`)),
            })));
            if (userId == null) {
                throw new Error(`Error storing ${this.keyDefinition.fullName} for the active user: No active user at this time.`);
            }
            return [
                userId,
                yield this.singleUserStateProvider
                    .get(userId, this.keyDefinition)
                    .update(configureState, options),
            ];
        });
    }
}
exports.DefaultActiveUserState = DefaultActiveUserState;
//# sourceMappingURL=default-active-user-state.js.map