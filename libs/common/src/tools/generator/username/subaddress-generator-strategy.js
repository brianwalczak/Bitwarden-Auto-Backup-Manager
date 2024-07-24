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
exports.SubaddressGeneratorStrategy = void 0;
const enums_1 = require("../../../admin-console/enums");
const key_definitions_1 = require("../key-definitions");
const rx_operators_1 = require("../rx-operators");
const util_1 = require("../util");
const subaddress_generator_options_1 = require("./subaddress-generator-options");
/** Strategy for creating an email subaddress
 *  @remarks The subaddress is the part following the `+`.
 *  For example, if the email address is `jd+xyz@domain.io`,
 *  the subaddress is `xyz`.
 */
class SubaddressGeneratorStrategy {
    /** Instantiates the generation strategy
     *  @param usernameService generates an email subaddress from an email address
     */
    constructor(random, stateProvider, defaultOptions = subaddress_generator_options_1.DefaultSubaddressOptions) {
        this.random = random;
        this.stateProvider = stateProvider;
        this.defaultOptions = defaultOptions;
        // configuration
        this.durableState = (0, util_1.sharedStateByUserId)(key_definitions_1.SUBADDRESS_SETTINGS, this.stateProvider);
        this.defaults$ = (0, util_1.clone$PerUserId)(this.defaultOptions);
        this.toEvaluator = (0, rx_operators_1.newDefaultEvaluator)();
        this.policy = enums_1.PolicyType.PasswordGenerator;
    }
    // algorithm
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = Object.assign({}, subaddress_generator_options_1.DefaultSubaddressOptions, options);
            const subaddressEmail = o.subaddressEmail;
            if (subaddressEmail == null || subaddressEmail.length < 3) {
                return o.subaddressEmail;
            }
            const atIndex = subaddressEmail.indexOf("@");
            if (atIndex < 1 || atIndex >= subaddressEmail.length - 1) {
                return subaddressEmail;
            }
            if (o.subaddressType == null) {
                o.subaddressType = "random";
            }
            const emailBeginning = subaddressEmail.substr(0, atIndex);
            const emailEnding = subaddressEmail.substr(atIndex + 1, subaddressEmail.length);
            let subaddressString = "";
            if (o.subaddressType === "random") {
                subaddressString = yield this.random.chars(8);
            }
            else if (o.subaddressType === "website-name") {
                subaddressString = o.website;
            }
            return emailBeginning + "+" + subaddressString + "@" + emailEnding;
        });
    }
}
exports.SubaddressGeneratorStrategy = SubaddressGeneratorStrategy;
//# sourceMappingURL=subaddress-generator-strategy.js.map