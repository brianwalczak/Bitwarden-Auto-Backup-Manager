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
exports.ConfigApiService = void 0;
const server_config_response_1 = require("../../models/response/server-config.response");
class ConfigApiService {
    constructor(apiService, tokenService) {
        this.apiService = apiService;
        this.tokenService = tokenService;
    }
    get(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Authentication adds extra context to config responses, if the user has an access token, we want to use it
            // We don't particularly care about ensuring the token is valid and not expired, just that it exists
            const authed = userId == null ? false : (yield this.tokenService.getAccessToken(userId)) != null;
            const r = yield this.apiService.send("GET", "/config", null, authed, true);
            return new server_config_response_1.ServerConfigResponse(r);
        });
    }
}
exports.ConfigApiService = ConfigApiService;
//# sourceMappingURL=config-api.service.js.map