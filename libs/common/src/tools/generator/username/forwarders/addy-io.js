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
exports.DefaultOptions = exports.AddyIoForwarder = exports.DefaultAddyIoOptions = void 0;
const key_definitions_1 = require("../../key-definitions");
const forwarder_generator_strategy_1 = require("../forwarder-generator-strategy");
const constants_1 = require("../options/constants");
exports.DefaultAddyIoOptions = Object.freeze({
    website: null,
    baseUrl: "https://app.addy.io",
    token: "",
    domain: "",
});
/** Generates a forwarding address for addy.io (formerly anon addy) */
class AddyIoForwarder extends forwarder_generator_strategy_1.ForwarderGeneratorStrategy {
    /** Instantiates the forwarder
     *  @param apiService used for ajax requests to the forwarding service
     *  @param i18nService used to look up error strings
     *  @param encryptService protects sensitive forwarder options
     *  @param keyService looks up the user key when protecting data.
     *  @param stateProvider creates the durable state for options storage
     */
    constructor(apiService, i18nService, encryptService, keyService, stateProvider) {
        super(encryptService, keyService, stateProvider, exports.DefaultAddyIoOptions);
        this.apiService = apiService;
        this.i18nService = i18nService;
        // configuration
        this.key = key_definitions_1.ADDY_IO_FORWARDER;
        this.rolloverKey = key_definitions_1.ADDY_IO_BUFFER;
        // request
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!options.token || options.token === "") {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.AddyIo.name);
                throw error;
            }
            if (!options.domain || options.domain === "") {
                const error = this.i18nService.t("forwarderNoDomain", constants_1.Forwarders.AddyIo.name);
                throw error;
            }
            if (!options.baseUrl || options.baseUrl === "") {
                const error = this.i18nService.t("forwarderNoUrl", constants_1.Forwarders.AddyIo.name);
                throw error;
            }
            let descriptionId = "forwarderGeneratedByWithWebsite";
            if (!options.website || options.website === "") {
                descriptionId = "forwarderGeneratedBy";
            }
            const description = this.i18nService.t(descriptionId, (_a = options.website) !== null && _a !== void 0 ? _a : "");
            const url = options.baseUrl + "/api/v1/aliases";
            const request = new Request(url, {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authorization: "Bearer " + options.token,
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                }),
                body: JSON.stringify({
                    domain: options.domain,
                    description,
                }),
            });
            const response = yield this.apiService.nativeFetch(request);
            if (response.status === 200 || response.status === 201) {
                const json = yield response.json();
                return (_b = json === null || json === void 0 ? void 0 : json.data) === null || _b === void 0 ? void 0 : _b.email;
            }
            else if (response.status === 401) {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.AddyIo.name);
                throw error;
            }
            else if (response === null || response === void 0 ? void 0 : response.statusText) {
                const error = this.i18nService.t("forwarderError", constants_1.Forwarders.AddyIo.name, response.statusText);
                throw error;
            }
            else {
                const error = this.i18nService.t("forwarderUnknownError", constants_1.Forwarders.AddyIo.name);
                throw error;
            }
        });
    }
}
exports.AddyIoForwarder = AddyIoForwarder;
exports.DefaultOptions = Object.freeze({
    website: null,
    baseUrl: "https://app.addy.io",
    domain: "",
    token: "",
});
//# sourceMappingURL=addy-io.js.map