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
exports.DefaultGeneratorNavigationService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../../admin-console/enums");
const rx_1 = require("../../rx");
const key_definitions_1 = require("../key-definitions");
const generator_navigation_1 = require("./generator-navigation");
const generator_navigation_evaluator_1 = require("./generator-navigation-evaluator");
const generator_navigation_policy_1 = require("./generator-navigation-policy");
class DefaultGeneratorNavigationService {
    /** instantiates the password generator strategy.
     * @param stateProvider provides durable state
     * @param policy provides the policy to enforce
     */
    constructor(stateProvider, policy) {
        this.stateProvider = stateProvider;
        this.policy = policy;
    }
    /** An observable monitoring the options saved to disk.
     *  The observable updates when the options are saved.
     *   @param userId: Identifies the user making the request
     */
    options$(userId) {
        return this.stateProvider.getUserState$(key_definitions_1.GENERATOR_SETTINGS, userId);
    }
    /** Gets the default options. */
    defaults$(userId) {
        return new rxjs_1.BehaviorSubject(Object.assign({}, generator_navigation_1.DefaultGeneratorNavigation));
    }
    /** An observable monitoring the options used to enforce policy.
     *  The observable updates when the policy changes.
     *  @param userId: Identifies the user making the request
     */
    evaluator$(userId) {
        const evaluator$ = this.policy.getAll$(enums_1.PolicyType.PasswordGenerator, userId).pipe((0, rx_1.reduceCollection)(generator_navigation_policy_1.preferPassword, generator_navigation_policy_1.DisabledGeneratorNavigationPolicy), (0, rx_1.distinctIfShallowMatch)(), (0, rxjs_1.map)((policy) => new generator_navigation_evaluator_1.GeneratorNavigationEvaluator(policy)));
        return evaluator$;
    }
    /** Enforces the policy on the given options
     * @param userId: Identifies the user making the request
     * @param options the options to enforce the policy on
     * @returns a new instance of the options with the policy enforced
     */
    enforcePolicy(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluator = yield (0, rxjs_1.firstValueFrom)(this.evaluator$(userId));
            const applied = evaluator.applyPolicy(options);
            const sanitized = evaluator.sanitize(applied);
            return sanitized;
        });
    }
    /** Saves the navigation options to disk.
     * @param userId: Identifies the user making the request
     * @param options the options to save
     * @returns a promise that resolves when the options are saved
     */
    saveOptions(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.setUserState(key_definitions_1.GENERATOR_SETTINGS, options, userId);
        });
    }
}
exports.DefaultGeneratorNavigationService = DefaultGeneratorNavigationService;
//# sourceMappingURL=default-generator-navigation.service.js.map