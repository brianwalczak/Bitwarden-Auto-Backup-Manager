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
exports.FastmailForwarder = void 0;
class FastmailForwarder {
    generate(apiService, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (options.apiKey == null || options.apiKey === "") {
                throw "Invalid Fastmail API token.";
            }
            const accountId = yield this.getAccountId(apiService, options);
            if (accountId == null || accountId === "") {
                throw "Unable to obtain Fastmail masked email account ID.";
            }
            const forDomain = options.website || "";
            const requestInit = {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authorization: "Bearer " + options.apiKey,
                    "Content-Type": "application/json",
                }),
            };
            const url = "https://api.fastmail.com/jmap/api/";
            requestInit.body = JSON.stringify({
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
                                    forDomain: forDomain,
                                    emailPrefix: options.fastmail.prefix,
                                },
                            },
                        },
                        "0",
                    ],
                ],
            });
            const request = new Request(url, requestInit);
            const response = yield apiService.nativeFetch(request);
            if (response.status === 200) {
                const json = yield response.json();
                if (json.methodResponses != null &&
                    json.methodResponses.length > 0 &&
                    json.methodResponses[0].length > 0) {
                    if (json.methodResponses[0][0] === "MaskedEmail/set") {
                        if (((_b = (_a = json.methodResponses[0][1]) === null || _a === void 0 ? void 0 : _a.created) === null || _b === void 0 ? void 0 : _b["new-masked-email"]) != null) {
                            return (_e = (_d = (_c = json.methodResponses[0][1]) === null || _c === void 0 ? void 0 : _c.created) === null || _d === void 0 ? void 0 : _d["new-masked-email"]) === null || _e === void 0 ? void 0 : _e.email;
                        }
                        if (((_g = (_f = json.methodResponses[0][1]) === null || _f === void 0 ? void 0 : _f.notCreated) === null || _g === void 0 ? void 0 : _g["new-masked-email"]) != null) {
                            throw ("Fastmail error: " +
                                ((_k = (_j = (_h = json.methodResponses[0][1]) === null || _h === void 0 ? void 0 : _h.notCreated) === null || _j === void 0 ? void 0 : _j["new-masked-email"]) === null || _k === void 0 ? void 0 : _k.description));
                        }
                    }
                    else if (json.methodResponses[0][0] === "error") {
                        throw "Fastmail error: " + ((_l = json.methodResponses[0][1]) === null || _l === void 0 ? void 0 : _l.description);
                    }
                }
            }
            if (response.status === 401 || response.status === 403) {
                throw "Invalid Fastmail API token.";
            }
            throw "Unknown Fastmail error occurred.";
        });
    }
    getAccountId(apiService, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestInit = {
                cache: "no-store",
                method: "GET",
                headers: new Headers({
                    Authorization: "Bearer " + options.apiKey,
                }),
            };
            const url = "https://api.fastmail.com/.well-known/jmap";
            const request = new Request(url, requestInit);
            const response = yield apiService.nativeFetch(request);
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
//# sourceMappingURL=fastmail-forwarder.js.map