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
exports.PasswordGeneratorStrategy = void 0;
const enums_1 = require("../../../admin-console/enums");
const key_definitions_1 = require("../key-definitions");
const policies_1 = require("../policies");
const rx_operators_1 = require("../rx-operators");
const util_1 = require("../util");
const password_generation_options_1 = require("./password-generation-options");
/** Generates passwords composed of random characters */
class PasswordGeneratorStrategy {
    /** instantiates the password generator strategy.
     *  @param legacy generates the password
     */
    constructor(randomizer, stateProvider) {
        this.randomizer = randomizer;
        this.stateProvider = stateProvider;
        // configuration
        this.durableState = (0, util_1.sharedStateByUserId)(key_definitions_1.PASSWORD_SETTINGS, this.stateProvider);
        this.defaults$ = (0, util_1.clone$PerUserId)(password_generation_options_1.DefaultPasswordGenerationOptions);
        this.policy = enums_1.PolicyType.PasswordGenerator;
    }
    toEvaluator() {
        return (0, rx_operators_1.mapPolicyToEvaluator)(policies_1.Policies.Password);
    }
    // algorithm
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = Object.assign(Object.assign({}, password_generation_options_1.DefaultPasswordGenerationOptions), options);
            let positions = [];
            if (o.lowercase && o.minLowercase > 0) {
                for (let i = 0; i < o.minLowercase; i++) {
                    positions.push("l");
                }
            }
            if (o.uppercase && o.minUppercase > 0) {
                for (let i = 0; i < o.minUppercase; i++) {
                    positions.push("u");
                }
            }
            if (o.number && o.minNumber > 0) {
                for (let i = 0; i < o.minNumber; i++) {
                    positions.push("n");
                }
            }
            if (o.special && o.minSpecial > 0) {
                for (let i = 0; i < o.minSpecial; i++) {
                    positions.push("s");
                }
            }
            while (positions.length < o.length) {
                positions.push("a");
            }
            // shuffle
            positions = yield this.randomizer.shuffle(positions);
            // build out the char sets
            let allCharSet = "";
            let lowercaseCharSet = "abcdefghijkmnopqrstuvwxyz";
            if (o.ambiguous) {
                lowercaseCharSet += "l";
            }
            if (o.lowercase) {
                allCharSet += lowercaseCharSet;
            }
            let uppercaseCharSet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
            if (o.ambiguous) {
                uppercaseCharSet += "IO";
            }
            if (o.uppercase) {
                allCharSet += uppercaseCharSet;
            }
            let numberCharSet = "23456789";
            if (o.ambiguous) {
                numberCharSet += "01";
            }
            if (o.number) {
                allCharSet += numberCharSet;
            }
            const specialCharSet = "!@#$%^&*";
            if (o.special) {
                allCharSet += specialCharSet;
            }
            let password = "";
            for (let i = 0; i < o.length; i++) {
                let positionChars;
                switch (positions[i]) {
                    case "l":
                        positionChars = lowercaseCharSet;
                        break;
                    case "u":
                        positionChars = uppercaseCharSet;
                        break;
                    case "n":
                        positionChars = numberCharSet;
                        break;
                    case "s":
                        positionChars = specialCharSet;
                        break;
                    case "a":
                        positionChars = allCharSet;
                        break;
                    default:
                        break;
                }
                const randomCharIndex = yield this.randomizer.uniform(0, positionChars.length - 1);
                password += positionChars.charAt(randomCharIndex);
            }
            return password;
        });
    }
}
exports.PasswordGeneratorStrategy = PasswordGeneratorStrategy;
//# sourceMappingURL=password-generator-strategy.js.map