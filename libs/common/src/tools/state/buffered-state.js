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
exports.BufferedState = void 0;
const rxjs_1 = require("rxjs");
/** Stateful storage that overwrites one state with a buffered state.
 *  When a overwrite occurs, the input state is automatically deleted.
 *  @remarks The buffered state can only overwrite non-nullish values. If the
 *   buffer key contains `null` or `undefined`, it will do nothing.
 */
class BufferedState {
    /**
     * Instantiate a buffered state
     * @param provider constructs the buffer.
     * @param key defines the buffer location.
     * @param output updates when a overwrite occurs
     * @param dependency$ provides data the buffer depends upon to evaluate and
     *   transform its data. If this is omitted, then `true` is injected as
     *   a dependency, which with a default output will trigger a overwrite immediately.
     *
     * @remarks `dependency$` enables overwrite control during dynamic circumstances,
     *   such as when a overwrite should occur only if a user key is available.
     */
    constructor(provider, key, output, dependency$ = null) {
        this.key = key;
        this.output = output;
        this.bufferedState = provider.getUser(output.userId, key.toKeyDefinition());
        // overwrite the output value
        const hasValue$ = (0, rxjs_1.concat)((0, rxjs_1.of)(null), this.bufferedState.state$).pipe((0, rxjs_1.map)((buffer) => (buffer !== null && buffer !== void 0 ? buffer : null) !== null));
        const overwriteDependency$ = (dependency$ !== null && dependency$ !== void 0 ? dependency$ : (0, rxjs_1.of)(true)).pipe((0, rxjs_1.map)((dependency) => [key.shouldOverwrite(dependency), dependency]));
        const overwrite$ = (0, rxjs_1.combineLatest)([hasValue$, overwriteDependency$]).pipe((0, rxjs_1.concatMap)((_a) => __awaiter(this, [_a], void 0, function* ([hasValue, [shouldOverwrite, dependency]]) {
            if (hasValue && shouldOverwrite) {
                yield this.overwriteOutput(dependency);
            }
            return [false, null];
        })));
        // drive overwrites only when there's a subscription;
        // the output state determines when emissions occur
        const output$ = this.output.state$.pipe((0, rxjs_1.map)((output) => [true, output]));
        this.state$ = (0, rxjs_1.merge)(overwrite$, output$).pipe((0, rxjs_1.filter)(([emit]) => emit), (0, rxjs_1.map)(([, output]) => output));
        this.combinedState$ = this.state$.pipe((0, rxjs_1.map)((state) => [this.output.userId, state]));
        this.bufferedState$ = this.bufferedState.state$;
    }
    overwriteOutput(dependency) {
        return __awaiter(this, void 0, void 0, function* () {
            // take the latest value from the buffer
            let buffered;
            yield this.bufferedState.update((state) => {
                buffered = state !== null && state !== void 0 ? state : null;
                return null;
            });
            // update the output state
            const isValid = yield this.key.isValid(buffered, dependency);
            if (isValid) {
                const output = yield this.key.map(buffered, dependency);
                yield this.output.update(() => output);
            }
        });
    }
    /** {@link SingleUserState.userId} */
    get userId() {
        return this.output.userId;
    }
    /** Buffers a value state. The buffered state overwrites the output
     *  state when a subscription occurs.
     *  @param value the state to roll over. Setting this to `null` or `undefined`
     *  has no effect.
     */
    buffer(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalized = value !== null && value !== void 0 ? value : null;
            if (normalized !== null) {
                yield this.bufferedState.update(() => normalized);
            }
        });
    }
    /** Updates the output state.
     *  @param configureState a callback that returns an updated output
     *   state. The callback receives the state's present value as its
     *   first argument and the dependencies listed in `options.combinedLatestWith`
     *   as its second argument.
     *  @param options configures how the update is applied. See {@link StateUpdateOptions}.
     */
    update(configureState, options = null) {
        return this.output.update(configureState, options);
    }
}
exports.BufferedState = BufferedState;
//# sourceMappingURL=buffered-state.js.map