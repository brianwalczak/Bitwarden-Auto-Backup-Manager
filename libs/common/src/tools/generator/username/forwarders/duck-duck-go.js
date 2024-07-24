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
exports.DefaultOptions = exports.DuckDuckGoForwarder = exports.DefaultDuckDuckGoOptions = void 0;
const key_definitions_1 = require("../../key-definitions");
const forwarder_generator_strategy_1 = require("../forwarder-generator-strategy");
const constants_1 = require("../options/constants");
exports.DefaultDuckDuckGoOptions = Object.freeze({
    website: null,
    token: "",
});
/** Generates a forwarding address for DuckDuckGo */
class DuckDuckGoForwarder extends forwarder_generator_strategy_1.ForwarderGeneratorStrategy {
    /** Instantiates the forwarder
     *  @param apiService used for ajax requests to the forwarding service
     *  @param i18nService used to look up error strings
     *  @param encryptService protects sensitive forwarder options
     *  @param keyService looks up the user key when protecting data.
     *  @param stateProvider creates the durable state for options storage
     */
    constructor(apiService, i18nService, encryptService, keyService, stateProvider) {
        super(encryptService, keyService, stateProvider, exports.DefaultDuckDuckGoOptions);
        this.apiService = apiService;
        this.i18nService = i18nService;
        // configuration
        this.key = key_definitions_1.DUCK_DUCK_GO_FORWARDER;
        this.rolloverKey = key_definitions_1.DUCK_DUCK_GO_BUFFER;
        // request
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            if (!options.token || options.token === "") {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.DuckDuckGo.name);
                throw error;
            }
            const url = "https://quack.duckduckgo.com/api/email/addresses";
            const request = new Request(url, {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authorization: "Bearer " + options.token,
                    "Content-Type": "application/json",
                }),
            });
            const response = yield this.apiService.nativeFetch(request);
            if (response.status === 200 || response.status === 201) {
                const json = yield response.json();
                if (json.address) {
                    return `${json.address}@duck.com`;
                }
                else {
                    const error = this.i18nService.t("forwarderUnknownError", constants_1.Forwarders.DuckDuckGo.name);
                    throw error;
                }
            }
            else if (response.status === 401) {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.DuckDuckGo.name);
                throw error;
            }
            else {
                const error = this.i18nService.t("forwarderUnknownError", constants_1.Forwarders.DuckDuckGo.name);
                throw error;
            }
        });
    }
}
exports.DuckDuckGoForwarder = DuckDuckGoForwarder;
exports.DefaultOptions = Object.freeze({
    website: null,
    token: "",
});
//# sourceMappingURL=duck-duck-go.js.map