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
exports.RestClient = void 0;
/** Makes remote procedure calls using a RESTful interface. */
class RestClient {
    constructor(api, i18n) {
        this.api = api;
        this.i18n = i18n;
    }
    /** uses the fetch API to request a JSON payload. */
    fetchJson(rpc, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = rpc.toRequest(params);
            const response = yield this.api.nativeFetch(request);
            // FIXME: once legacy password generator is removed, replace forwarder-specific error
            //   messages with RPC-generalized ones.
            let error = undefined;
            let cause = undefined;
            if (response.status === 401 || response.status === 403) {
                cause = yield this.tryGetErrorMessage(response);
                error = cause ? "forwarderInvalidTokenWithMessage" : "forwarderInvalidToken";
            }
            else if (response.status >= 500) {
                cause = yield this.tryGetErrorMessage(response);
                cause = cause !== null && cause !== void 0 ? cause : response.statusText;
                error = "forwarderError";
            }
            let ok = undefined;
            if (!error && rpc.hasJsonPayload(response)) {
                [ok, cause] = rpc.processJson(yield response.json());
            }
            // success
            if (ok) {
                return ok;
            }
            // failure
            if (!error) {
                error = cause ? "forwarderError" : "forwarderUnknownError";
            }
            throw this.i18n.t(error, rpc.requestor.name, cause);
        });
    }
    tryGetErrorMessage(response) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = (_a = (yield response.text())) !== null && _a !== void 0 ? _a : "";
            if (!body.startsWith("{")) {
                return undefined;
            }
            const json = JSON.parse(body);
            if ("error" in json) {
                return json.error;
            }
            else if ("message" in json) {
                return json.message;
            }
            return undefined;
        });
    }
}
exports.RestClient = RestClient;
//# sourceMappingURL=rest-client.js.map