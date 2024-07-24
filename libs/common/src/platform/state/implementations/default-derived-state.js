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
exports.DefaultDerivedState = void 0;
const rxjs_1 = require("rxjs");
/**
 * Default derived state
 */
class DefaultDerivedState {
    constructor(parentState$, deriveDefinition, dependencies) {
        this.parentState$ = parentState$;
        this.deriveDefinition = deriveDefinition;
        this.dependencies = dependencies;
        this.forcedValueSubject = new rxjs_1.Subject();
        this.storageKey = deriveDefinition.storageKey;
        const derivedState$ = this.parentState$.pipe((0, rxjs_1.concatMap)((state) => __awaiter(this, void 0, void 0, function* () {
            let derivedStateOrPromise = this.deriveDefinition.derive(state, this.dependencies);
            if (derivedStateOrPromise instanceof Promise) {
                derivedStateOrPromise = yield derivedStateOrPromise;
            }
            const derivedState = derivedStateOrPromise;
            return derivedState;
        })));
        this.state$ = (0, rxjs_1.merge)(this.forcedValueSubject, derivedState$).pipe((0, rxjs_1.share)({
            connector: () => {
                return new rxjs_1.ReplaySubject(1);
            },
            resetOnRefCountZero: () => (0, rxjs_1.timer)(this.deriveDefinition.cleanupDelayMs),
        }));
    }
    forceValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.forcedValueSubject.next(value);
            return value;
        });
    }
}
exports.DefaultDerivedState = DefaultDerivedState;
//# sourceMappingURL=default-derived-state.js.map