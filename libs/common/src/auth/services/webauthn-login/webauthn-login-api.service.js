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
exports.WebAuthnLoginApiService = void 0;
const rxjs_1 = require("rxjs");
const credential_assertion_options_response_1 = require("./response/credential-assertion-options.response");
class WebAuthnLoginApiService {
    constructor(apiService, environmentService) {
        this.apiService = apiService;
        this.environmentService = environmentService;
    }
    getCredentialAssertionOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const response = yield this.apiService.send("GET", `/accounts/webauthn/assertion-options`, null, false, true, env.getIdentityUrl());
            return new credential_assertion_options_response_1.CredentialAssertionOptionsResponse(response);
        });
    }
}
exports.WebAuthnLoginApiService = WebAuthnLoginApiService;
//# sourceMappingURL=webauthn-login-api.service.js.map