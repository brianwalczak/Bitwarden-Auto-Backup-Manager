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
exports.CatchallGeneratorStrategy = void 0;
const enums_1 = require("../../../admin-console/enums");
const key_definitions_1 = require("../key-definitions");
const rx_operators_1 = require("../rx-operators");
const util_1 = require("../util");
const catchall_generator_options_1 = require("./catchall-generator-options");
/** Strategy for creating usernames using a catchall email address */
class CatchallGeneratorStrategy {
    /** Instantiates the generation strategy
     *  @param usernameService generates a catchall address for a domain
     */
    constructor(random, stateProvider, defaultOptions = catchall_generator_options_1.DefaultCatchallOptions) {
        this.random = random;
        this.stateProvider = stateProvider;
        this.defaultOptions = defaultOptions;
        // configuration
        this.durableState = (0, util_1.sharedStateByUserId)(key_definitions_1.CATCHALL_SETTINGS, this.stateProvider);
        this.defaults$ = (0, util_1.clone$PerUserId)(this.defaultOptions);
        this.toEvaluator = (0, rx_operators_1.newDefaultEvaluator)();
        this.policy = enums_1.PolicyType.PasswordGenerator;
    }
    // algorithm
    generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = Object.assign({}, catchall_generator_options_1.DefaultCatchallOptions, options);
            if (o.catchallDomain == null || o.catchallDomain === "") {
                return null;
            }
            if (o.catchallType == null) {
                o.catchallType = "random";
            }
            let startString = "";
            if (o.catchallType === "random") {
                startString = yield this.random.chars(8);
            }
            else if (o.catchallType === "website-name") {
                startString = o.website;
            }
            return startString + "@" + o.catchallDomain;
        });
    }
}
exports.CatchallGeneratorStrategy = CatchallGeneratorStrategy;
//# sourceMappingURL=catchall-generator-strategy.js.map