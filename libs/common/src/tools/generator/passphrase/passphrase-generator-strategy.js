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
exports.PassphraseGeneratorStrategy = void 0;
const enums_1 = require("../../../admin-console/enums");
const wordlist_1 = require("../../../platform/misc/wordlist");
const key_definitions_1 = require("../key-definitions");
const policies_1 = require("../policies");
const rx_operators_1 = require("../rx-operators");
const util_1 = require("../util");
const passphrase_generation_options_1 = require("./passphrase-generation-options");
/** Generates passphrases composed of random words */
class PassphraseGeneratorStrategy {
    /** instantiates the password generator strategy.
     *  @param legacy generates the passphrase
     *  @param stateProvider provides durable state
     */
    constructor(randomizer, stateProvider) {
        this.randomizer = randomizer;
        this.stateProvider = stateProvider;
        // configuration
        this.durableState = (0, util_1.sharedStateByUserId)(key_definitions_1.PASSPHRASE_SETTINGS, this.stateProvider);
        this.defaults$ = (0, util_1.clone$PerUserId)(passphrase_generation_options_1.DefaultPassphraseGenerationOptions);
        this.policy = enums_1.PolicyType.PasswordGenerator;
    }
    toEvaluator() {
        return (0, rx_operators_1.mapPolicyToEvaluator)(policies_1.Policies.Passphrase);
    }
    // algorithm
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = Object.assign(Object.assign({}, passphrase_generation_options_1.DefaultPassphraseGenerationOptions), options);
            if (o.numWords == null || o.numWords <= 2) {
                o.numWords = passphrase_generation_options_1.DefaultPassphraseGenerationOptions.numWords;
            }
            if (o.capitalize == null) {
                o.capitalize = false;
            }
            if (o.includeNumber == null) {
                o.includeNumber = false;
            }
            // select which word gets the number, if any
            let luckyNumber = -1;
            if (o.includeNumber) {
                luckyNumber = yield this.randomizer.uniform(0, o.numWords - 1);
            }
            // generate the passphrase
            const wordList = new Array(o.numWords);
            for (let i = 0; i < o.numWords; i++) {
                const word = yield this.randomizer.pickWord(wordlist_1.EFFLongWordList, {
                    titleCase: o.capitalize,
                    number: i === luckyNumber,
                });
                wordList[i] = word;
            }
            return wordList.join(o.wordSeparator);
        });
    }
}
exports.PassphraseGeneratorStrategy = PassphraseGeneratorStrategy;
//# sourceMappingURL=passphrase-generator-strategy.js.map