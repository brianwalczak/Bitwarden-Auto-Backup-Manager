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
exports.UserVerificationApiService = void 0;
class UserVerificationApiService {
    constructor(apiService) {
        this.apiService = apiService;
    }
    postAccountVerifyOTP(request) {
        return this.apiService.send("POST", "/accounts/verify-otp", request, true, false);
    }
    postAccountRequestOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiService.send("POST", "/accounts/request-otp", null, true, false);
        });
    }
    postAccountVerifyPassword(request) {
        return this.apiService.send("POST", "/accounts/verify-password", request, true, true);
    }
}
exports.UserVerificationApiService = UserVerificationApiService;
//# sourceMappingURL=user-verification-api.service.js.map