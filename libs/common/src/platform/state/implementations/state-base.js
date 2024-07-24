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
exports.StateBase = void 0;
const rxjs_1 = require("rxjs");
const state_update_options_1 = require("../state-update-options");
const util_1 = require("./util");
class StateBase {
    constructor(key, storageService, keyDefinition) {
        this.key = key;
        this.storageService = storageService;
        this.keyDefinition = keyDefinition;
        const storageUpdate$ = storageService.updates$.pipe((0, rxjs_1.filter)((storageUpdate) => storageUpdate.key === key), (0, rxjs_1.switchMap)((storageUpdate) => __awaiter(this, void 0, void 0, function* () {
            if (storageUpdate.updateType === "remove") {
                return null;
            }
            return yield (0, util_1.getStoredValue)(key, storageService, keyDefinition.deserializer);
        })));
        this.state$ = (0, rxjs_1.merge)((0, rxjs_1.defer)(() => (0, util_1.getStoredValue)(key, storageService, keyDefinition.deserializer)), storageUpdate$).pipe((0, rxjs_1.share)({
            connector: () => new rxjs_1.ReplaySubject(1),
            resetOnRefCountZero: () => (0, rxjs_1.timer)(keyDefinition.cleanupDelayMs),
        }));
    }
    update(configureState_1) {
        return __awaiter(this, arguments, void 0, function* (configureState, options = {}) {
            options = (0, state_update_options_1.populateOptionsWithDefault)(options);
            if (this.updatePromise != null) {
                yield this.updatePromise;
            }
            try {
                this.updatePromise = this.internalUpdate(configureState, options);
                const newState = yield this.updatePromise;
                return newState;
            }
            finally {
                this.updatePromise = null;
            }
        });
    }
    internalUpdate(configureState, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentState = yield this.getStateForUpdate();
            const combinedDependencies = options.combineLatestWith != null
                ? yield (0, rxjs_1.firstValueFrom)(options.combineLatestWith.pipe((0, rxjs_1.timeout)(options.msTimeout)))
                : null;
            if (!options.shouldUpdate(currentState, combinedDependencies)) {
                return currentState;
            }
            const newState = configureState(currentState, combinedDependencies);
            yield this.doStorageSave(newState, currentState);
            return newState;
        });
    }
    doStorageSave(newState, oldState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.save(this.key, newState);
        });
    }
    /** For use in update methods, does not wait for update to complete before yielding state.
     * The expectation is that that await is already done
     */
    getStateForUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, util_1.getStoredValue)(this.key, this.storageService, this.keyDefinition.deserializer);
        });
    }
}
exports.StateBase = StateBase;
//# sourceMappingURL=state-base.js.map