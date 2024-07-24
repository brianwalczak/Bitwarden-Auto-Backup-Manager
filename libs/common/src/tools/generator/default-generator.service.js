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
exports.DefaultGeneratorService = void 0;
const rxjs_1 = require("rxjs");
/** {@link GeneratorServiceAbstraction} */
class DefaultGeneratorService {
    /** Instantiates the generator service
     * @param strategy tailors the service to a specific generator type
     *            (e.g. password, passphrase)
     * @param policy provides the policy to enforce
     */
    constructor(strategy, policy) {
        this.strategy = strategy;
        this.policy = policy;
        this._evaluators$ = new Map();
    }
    /** {@link GeneratorService.options$} */
    options$(userId) {
        return this.strategy.durableState(userId).state$;
    }
    /** {@link GeneratorService.defaults$} */
    defaults$(userId) {
        return this.strategy.defaults$(userId);
    }
    /** {@link GeneratorService.saveOptions} */
    saveOptions(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.strategy.durableState(userId).update(() => options);
        });
    }
    /** {@link GeneratorService.evaluator$} */
    evaluator$(userId) {
        let evaluator$ = this._evaluators$.get(userId);
        if (!evaluator$) {
            evaluator$ = this.createEvaluator(userId);
            this._evaluators$.set(userId, evaluator$);
        }
        return evaluator$;
    }
    createEvaluator(userId) {
        const evaluator$ = this.policy.getAll$(this.strategy.policy, userId).pipe(
        // create the evaluator from the policies
        this.strategy.toEvaluator());
        return evaluator$;
    }
    /** {@link GeneratorService.enforcePolicy} */
    enforcePolicy(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const policy = yield (0, rxjs_1.firstValueFrom)(this.evaluator$(userId));
            const evaluated = policy.applyPolicy(options);
            const sanitized = policy.sanitize(evaluated);
            return sanitized;
        });
    }
    /** {@link GeneratorService.generate} */
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.strategy.generate(options);
        });
    }
}
exports.DefaultGeneratorService = DefaultGeneratorService;
//# sourceMappingURL=default-generator.service.js.map