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
exports.DefaultSingleUserState = void 0;
const rxjs_1 = require("rxjs");
const state_base_1 = require("./state-base");
class DefaultSingleUserState extends state_base_1.StateBase {
    constructor(userId, keyDefinition, chosenLocation, stateEventRegistrarService) {
        super(keyDefinition.buildKey(userId), chosenLocation, keyDefinition);
        this.userId = userId;
        this.stateEventRegistrarService = stateEventRegistrarService;
        this.combinedState$ = (0, rxjs_1.combineLatest)([(0, rxjs_1.of)(userId), this.state$]);
    }
    doStorageSave(newState, oldState) {
        const _super = Object.create(null, {
            doStorageSave: { get: () => super.doStorageSave }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.doStorageSave.call(this, newState, oldState);
            if (newState != null && oldState == null) {
                yield this.stateEventRegistrarService.registerEvents(this.keyDefinition);
            }
        });
    }
}
exports.DefaultSingleUserState = DefaultSingleUserState;
//# sourceMappingURL=default-single-user-state.js.map