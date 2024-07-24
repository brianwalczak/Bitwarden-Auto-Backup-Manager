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
exports.InlineDerivedState = exports.InlineDerivedStateProvider = void 0;
const rxjs_1 = require("rxjs");
class InlineDerivedStateProvider {
    get(parentState$, deriveDefinition, dependencies) {
        return new InlineDerivedState(parentState$, deriveDefinition, dependencies);
    }
}
exports.InlineDerivedStateProvider = InlineDerivedStateProvider;
class InlineDerivedState {
    constructor(parentState$, deriveDefinition, dependencies) {
        this.state$ = parentState$.pipe((0, rxjs_1.concatMap)((value) => __awaiter(this, void 0, void 0, function* () { return yield deriveDefinition.derive(value, dependencies); })));
    }
    forceValue(value) {
        // No need to force anything, we don't keep a cache
        return Promise.resolve(value);
    }
}
exports.InlineDerivedState = InlineDerivedState;
//# sourceMappingURL=inline-derived-state.js.map