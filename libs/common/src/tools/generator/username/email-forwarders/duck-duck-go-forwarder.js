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
exports.DuckDuckGoForwarder = void 0;
class DuckDuckGoForwarder {
    generate(apiService, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.apiKey == null || options.apiKey === "") {
                throw "Invalid DuckDuckGo API token.";
            }
            const requestInit = {
                redirect: "manual",
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Authorization: "Bearer " + options.apiKey,
                    "Content-Type": "application/json",
                }),
            };
            const url = "https://quack.duckduckgo.com/api/email/addresses";
            const request = new Request(url, requestInit);
            const response = yield apiService.nativeFetch(request);
            if (response.status === 200 || response.status === 201) {
                const json = yield response.json();
                if (json.address) {
                    return `${json.address}@duck.com`;
                }
            }
            else if (response.status === 401) {
                throw "Invalid DuckDuckGo API token.";
            }
            throw "Unknown DuckDuckGo error occurred.";
        });
    }
}
exports.DuckDuckGoForwarder = DuckDuckGoForwarder;
//# sourceMappingURL=duck-duck-go-forwarder.js.map