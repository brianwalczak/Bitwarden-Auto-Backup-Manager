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
exports.ProviderApiService = void 0;
const provider_response_1 = require("../../models/response/provider/provider.response");
class ProviderApiService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    postProviderSetup(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/providers/" + id + "/setup", request, true, true);
            return new provider_response_1.ProviderResponse(r);
        });
    }
    getProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/providers/" + id, null, true, true);
            return new provider_response_1.ProviderResponse(r);
        });
    }
    putProvider(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/providers/" + id, request, true, true);
            return new provider_response_1.ProviderResponse(r);
        });
    }
    providerRecoverDeleteToken(providerId, request) {
        return this.apiService.send("POST", "/providers/" + providerId + "/delete-recover-token", request, false, false);
    }
    deleteProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.send("DELETE", "/providers/" + id, null, true, false);
        });
    }
}
exports.ProviderApiService = ProviderApiService;
//# sourceMappingURL=provider-api.service.js.map