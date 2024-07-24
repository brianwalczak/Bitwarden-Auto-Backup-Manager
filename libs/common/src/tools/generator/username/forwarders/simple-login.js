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
exports.DefaultOptions = exports.SimpleLoginForwarder = exports.DefaultSimpleLoginOptions = void 0;
const key_definitions_1 = require("../../key-definitions");
const forwarder_generator_strategy_1 = require("../forwarder-generator-strategy");
const constants_1 = require("../options/constants");
exports.DefaultSimpleLoginOptions = Object.freeze({
    website: null,
    baseUrl: "https://app.simplelogin.io",
    token: "",
});
/** Generates a forwarding address for Simple Login */
class SimpleLoginForwarder extends forwarder_generator_strategy_1.ForwarderGeneratorStrategy {
    /** Instantiates the forwarder
     *  @param apiService used for ajax requests to the forwarding service
     *  @param i18nService used to look up error strings
     *  @param encryptService protects sensitive forwarder options
     *  @param keyService looks up the user key when protecting data.
     *  @param stateProvider creates the durable state for options storage
     */
    constructor(apiService, i18nService, encryptService, keyService, stateProvider) {
        super(encryptService, keyService, stateProvider, exports.DefaultSimpleLoginOptions);
        this.apiService = apiService;
        this.i18nService = i18nService;
        // configuration
        this.key = key_definitions_1.SIMPLE_LOGIN_FORWARDER;
        this.rolloverKey = key_definitions_1.SIMPLE_LOGIN_BUFFER;
        // request
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!options.token || options.token === "") {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.SimpleLogin.name);
                throw error;
            }
            if (!options.baseUrl || options.baseUrl === "") {
                const error = this.i18nService.t("forwarderNoUrl", constants_1.Forwarders.SimpleLogin.name);
                throw error;
            }
            let url = options.baseUrl + "/api/alias/random/new";
            let noteId = "forwarderGeneratedBy";
            if (options.website && options.website !== "") {
                url += "?hostname=" + options.website;
                noteId = "forwarderGeneratedByWithWebsite";
            }
            const note = this.i18nService.t(noteId, (_a = options.website) !== null && _a !== void 0 ? _a : "");
            const request = new Request(url, {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authentication: options.token,
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({ note }),
            });
            const response = yield this.apiService.nativeFetch(request);
            if (response.status === 401) {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.SimpleLogin.name);
                throw error;
            }
            const json = yield response.json();
            if (response.status === 200 || response.status === 201) {
                return json.alias;
            }
            else if (json === null || json === void 0 ? void 0 : json.error) {
                const error = this.i18nService.t("forwarderError", constants_1.Forwarders.SimpleLogin.name, json.error);
                throw error;
            }
            else {
                const error = this.i18nService.t("forwarderUnknownError", constants_1.Forwarders.SimpleLogin.name);
                throw error;
            }
        });
    }
}
exports.SimpleLoginForwarder = SimpleLoginForwarder;
exports.DefaultOptions = Object.freeze({
    website: null,
    baseUrl: "https://app.simplelogin.io",
    token: "",
});
//# sourceMappingURL=simple-login.js.map