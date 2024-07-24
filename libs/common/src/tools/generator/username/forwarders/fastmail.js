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
exports.DefaultOptions = exports.FastmailForwarder = exports.DefaultFastmailOptions = void 0;
const key_definitions_1 = require("../../key-definitions");
const forwarder_generator_strategy_1 = require("../forwarder-generator-strategy");
const constants_1 = require("../options/constants");
exports.DefaultFastmailOptions = Object.freeze({
    website: "",
    domain: "",
    prefix: "",
    token: "",
});
/** Generates a forwarding address for Fastmail */
class FastmailForwarder extends forwarder_generator_strategy_1.ForwarderGeneratorStrategy {
    /** Instantiates the forwarder
     *  @param apiService used for ajax requests to the forwarding service
     *  @param i18nService used to look up error strings
     *  @param encryptService protects sensitive forwarder options
     *  @param keyService looks up the user key when protecting data.
     *  @param stateProvider creates the durable state for options storage
     */
    constructor(apiService, i18nService, encryptService, keyService, stateProvider) {
        super(encryptService, keyService, stateProvider, exports.DefaultFastmailOptions);
        this.apiService = apiService;
        this.i18nService = i18nService;
        // configuration
        this.key = key_definitions_1.FASTMAIL_FORWARDER;
        this.rolloverKey = key_definitions_1.FASTMAIL_BUFFER;
        // request
        this.generate = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (!options.token || options.token === "") {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.Fastmail.name);
                throw error;
            }
            const accountId = yield this.getAccountId(options);
            if (!accountId || accountId === "") {
                const error = this.i18nService.t("forwarderNoAccountId", constants_1.Forwarders.Fastmail.name);
                throw error;
            }
            const body = JSON.stringify({
                using: ["https://www.fastmail.com/dev/maskedemail", "urn:ietf:params:jmap:core"],
                methodCalls: [
                    [
                        "MaskedEmail/set",
                        {
                            accountId: accountId,
                            create: {
                                "new-masked-email": {
                                    state: "enabled",
                                    description: "",
                                    forDomain: (_a = options.website) !== null && _a !== void 0 ? _a : "",
                                    emailPrefix: options.prefix,
                                },
                            },
                        },
                        "0",
                    ],
                ],
            });
            const requestInit = {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authorization: "Bearer " + options.token,
                    "Content-Type": "application/json",
                }),
                body,
            };
            const url = "https://api.fastmail.com/jmap/api/";
            const request = new Request(url, requestInit);
            const response = yield this.apiService.nativeFetch(request);
            if (response.status === 200) {
                const json = yield response.json();
                if (json.methodResponses != null &&
                    json.methodResponses.length > 0 &&
                    json.methodResponses[0].length > 0) {
                    if (json.methodResponses[0][0] === "MaskedEmail/set") {
                        if (((_c = (_b = json.methodResponses[0][1]) === null || _b === void 0 ? void 0 : _b.created) === null || _c === void 0 ? void 0 : _c["new-masked-email"]) != null) {
                            return (_f = (_e = (_d = json.methodResponses[0][1]) === null || _d === void 0 ? void 0 : _d.created) === null || _e === void 0 ? void 0 : _e["new-masked-email"]) === null || _f === void 0 ? void 0 : _f.email;
                        }
                        if (((_h = (_g = json.methodResponses[0][1]) === null || _g === void 0 ? void 0 : _g.notCreated) === null || _h === void 0 ? void 0 : _h["new-masked-email"]) != null) {
                            const errorDescription = (_l = (_k = (_j = json.methodResponses[0][1]) === null || _j === void 0 ? void 0 : _j.notCreated) === null || _k === void 0 ? void 0 : _k["new-masked-email"]) === null || _l === void 0 ? void 0 : _l.description;
                            const error = this.i18nService.t("forwarderError", constants_1.Forwarders.Fastmail.name, errorDescription);
                            throw error;
                        }
                    }
                    else if (json.methodResponses[0][0] === "error") {
                        const errorDescription = (_m = json.methodResponses[0][1]) === null || _m === void 0 ? void 0 : _m.description;
                        const error = this.i18nService.t("forwarderError", constants_1.Forwarders.Fastmail.name, errorDescription);
                        throw error;
                    }
                }
            }
            else if (response.status === 401 || response.status === 403) {
                const error = this.i18nService.t("forwaderInvalidToken", constants_1.Forwarders.Fastmail.name);
                throw error;
            }
            const error = this.i18nService.t("forwarderUnknownError", constants_1.Forwarders.Fastmail.name);
            throw error;
        });
    }
    getAccountId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestInit = {
                cache: "no-store",
                method: "GET",
                headers: new Headers({
                    Authorization: "Bearer " + options.token,
                }),
            };
            const url = "https://api.fastmail.com/.well-known/jmap";
            const request = new Request(url, requestInit);
            const response = yield this.apiService.nativeFetch(request);
            if (response.status === 200) {
                const json = yield response.json();
                if (json.primaryAccounts != null) {
                    return json.primaryAccounts["https://www.fastmail.com/dev/maskedemail"];
                }
            }
            return null;
        });
    }
}
exports.FastmailForwarder = FastmailForwarder;
exports.DefaultOptions = Object.freeze({
    website: null,
    domain: "",
    prefix: "",
    token: "",
});
//# sourceMappingURL=fastmail.js.map