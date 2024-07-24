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
exports.DefaultStateProvider = void 0;
const rxjs_1 = require("rxjs");
class DefaultStateProvider {
    constructor(activeUserStateProvider, singleUserStateProvider, globalStateProvider, derivedStateProvider) {
        this.activeUserStateProvider = activeUserStateProvider;
        this.singleUserStateProvider = singleUserStateProvider;
        this.globalStateProvider = globalStateProvider;
        this.derivedStateProvider = derivedStateProvider;
        this.getActive = this.activeUserStateProvider.get.bind(this.activeUserStateProvider);
        this.getUser = this.singleUserStateProvider.get.bind(this.singleUserStateProvider);
        this.getGlobal = this.globalStateProvider.get.bind(this.globalStateProvider);
        this.getDerived = this.derivedStateProvider.get.bind(this.derivedStateProvider);
        this.activeUserId$ = this.activeUserStateProvider.activeUserId$;
    }
    getUserState$(userKeyDefinition, userId) {
        if (userId) {
            return this.getUser(userId, userKeyDefinition).state$;
        }
        else {
            return this.activeUserId$.pipe((0, rxjs_1.filter)((userId) => userId != null), // Filter out null-ish user ids since we can't get state for a null user id
            (0, rxjs_1.take)(1), (0, rxjs_1.switchMap)((userId) => this.getUser(userId, userKeyDefinition).state$));
        }
    }
    getUserStateOrDefault$(userKeyDefinition, config) {
        const { userId, defaultValue = null } = config;
        if (userId) {
            return this.getUser(userId, userKeyDefinition).state$;
        }
        else {
            return this.activeUserId$.pipe((0, rxjs_1.take)(1), (0, rxjs_1.switchMap)((userId) => userId != null ? this.getUser(userId, userKeyDefinition).state$ : (0, rxjs_1.of)(defaultValue)));
        }
    }
    setUserState(userKeyDefinition, value, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                return [userId, yield this.getUser(userId, userKeyDefinition).update(() => value)];
            }
            else {
                return yield this.getActive(userKeyDefinition).update(() => value);
            }
        });
    }
}
exports.DefaultStateProvider = DefaultStateProvider;
//# sourceMappingURL=default-state.provider.js.map