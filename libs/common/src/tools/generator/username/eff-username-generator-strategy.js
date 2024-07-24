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
exports.EffUsernameGeneratorStrategy = void 0;
const wordlist_1 = require("@bitwarden/common/platform/misc/wordlist");
const enums_1 = require("../../../admin-console/enums");
const key_definitions_1 = require("../key-definitions");
const rx_operators_1 = require("../rx-operators");
const util_1 = require("../util");
const eff_username_generator_options_1 = require("./eff-username-generator-options");
/** Strategy for creating usernames from the EFF wordlist */
class EffUsernameGeneratorStrategy {
    /** Instantiates the generation strategy
     *  @param usernameService generates a username from EFF word list
     */
    constructor(random, stateProvider, defaultOptions = eff_username_generator_options_1.DefaultEffUsernameOptions) {
        this.random = random;
        this.stateProvider = stateProvider;
        this.defaultOptions = defaultOptions;
        // configuration
        this.durableState = (0, util_1.sharedStateByUserId)(key_definitions_1.EFF_USERNAME_SETTINGS, this.stateProvider);
        this.defaults$ = (0, util_1.clone$PerUserId)(this.defaultOptions);
        this.toEvaluator = (0, rx_operators_1.newDefaultEvaluator)();
        this.policy = enums_1.PolicyType.PasswordGenerator;
    }
    // algorithm
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const word = yield this.random.pickWord(wordlist_1.EFFLongWordList, {
                titleCase: (_a = options.wordCapitalize) !== null && _a !== void 0 ? _a : eff_username_generator_options_1.DefaultEffUsernameOptions.wordCapitalize,
                number: (_b = options.wordIncludeNumber) !== null && _b !== void 0 ? _b : eff_username_generator_options_1.DefaultEffUsernameOptions.wordIncludeNumber,
            });
            return word;
        });
    }
}
exports.EffUsernameGeneratorStrategy = EffUsernameGeneratorStrategy;
//# sourceMappingURL=eff-username-generator-strategy.js.map