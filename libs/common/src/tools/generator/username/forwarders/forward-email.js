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
exports.DefaultOptions = exports.ForwardEmailForwarder = exports.DefaultForwardEmailOptions = void 0;
const utils_1 = require("../../../../platform/misc/utils");
const key_definitions_1 = require("../../key-definitions");
const forwarder_generator_strategy_1 = require("../forwarder-generator-strategy");
const constants_1 = require("../options/constants");
exports.DefaultForwardEmailOptions = Object.freeze({
    website: null,
    token: "",
    domain: "",
});
/** Generates a forwarding address for Forward Email */
class ForwardEmailForwarder extends forwarder_generator_strategy_1.ForwarderGeneratorStrategy {
    /** Instantiates the forwarder
     *  @param apiService used for ajax requests to the forwarding service
     *  @param i18nService used to look up error strings
     *  @param encryptService protects sensitive forwarder options
     *  @param keyService looks up the user key when protecting data.
     *  @param stateProvider creates the durable state for options storage
     */
    constructor(apiService, i18nService, encryptService, keyService, stateProvider) {
        super(encryptService, keyService, stateProvider, exports.DefaultForwardEmailOptions);
        this.apiService = apiService;
        this.i18nService = i18nService;
        // configuration
        this.key = key_definitions_1.FORWARD_EMAIL_FORWARDER;
        this.rolloverKey = key_definitions_1.FORWARD_EMAIL_BUFFER;
        // request
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!options.token || options.token === "") {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.ForwardEmail.name);
                throw error;
            }
            if (!options.domain || options.domain === "") {
                const error = this.i18nService.t("forwarderNoDomain", constants_1.Forwarders.ForwardEmail.name);
                throw error;
            }
            const url = `https://api.forwardemail.net/v1/domains/${options.domain}/aliases`;
            let descriptionId = "forwarderGeneratedByWithWebsite";
            if (!options.website || options.website === "") {
                descriptionId = "forwarderGeneratedBy";
            }
            const description = this.i18nService.t(descriptionId, (_a = options.website) !== null && _a !== void 0 ? _a : "");
            const request = new Request(url, {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authorization: "Basic " + utils_1.Utils.fromUtf8ToB64(options.token + ":"),
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                    labels: options.website,
                    description,
                }),
            });
            const response = yield this.apiService.nativeFetch(request);
            const json = yield response.json();
            if (response.status === 401) {
                const messageKey = "message" in json ? "forwaderInvalidTokenWithMessage" : "forwaderInvalidToken";
                const error = this.i18nService.t(messageKey, constants_1.Forwarders.ForwardEmail.name, json.message);
                throw error;
            }
            else if (response.status === 200 || response.status === 201) {
                const { name, domain } = yield response.json();
                const domainPart = (domain === null || domain === void 0 ? void 0 : domain.name) || options.domain;
                return `${name}@${domainPart}`;
            }
            else if (json === null || json === void 0 ? void 0 : json.message) {
                const error = this.i18nService.t("forwarderError", constants_1.Forwarders.ForwardEmail.name, json.message);
                throw error;
            }
            else if (json === null || json === void 0 ? void 0 : json.error) {
                const error = this.i18nService.t("forwarderError", constants_1.Forwarders.ForwardEmail.name, json.error);
                throw error;
            }
            else {
                const error = this.i18nService.t("forwarderUnknownError", constants_1.Forwarders.ForwardEmail.name);
                throw error;
            }
        });
    }
}
exports.ForwardEmailForwarder = ForwardEmailForwarder;
exports.DefaultOptions = Object.freeze({
    website: null,
    token: "",
    domain: "",
});
//# sourceMappingURL=forward-email.js.map