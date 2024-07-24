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
exports.AccountApiServiceImplementation = void 0;
const rxjs_1 = require("rxjs");
const error_response_1 = require("../../models/response/error.response");
class AccountApiServiceImplementation {
    constructor(apiService, userVerificationService, logService, accountService, environmentService) {
        this.apiService = apiService;
        this.userVerificationService = userVerificationService;
        this.logService = logService;
        this.accountService = accountService;
        this.environmentService = environmentService;
    }
    deleteAccount(verification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verificationRequest = yield this.userVerificationService.buildRequest(verification);
                yield this.apiService.send("DELETE", "/accounts", verificationRequest, true, false);
                this.accountService.delete();
            }
            catch (e) {
                this.logService.error(e);
                throw e;
            }
        });
    }
    registerSendVerificationEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            try {
                const response = yield this.apiService.send("POST", "/accounts/register/send-verification-email", request, false, true, env.getIdentityUrl());
                return response;
            }
            catch (e) {
                if (e instanceof error_response_1.ErrorResponse) {
                    if (e.statusCode === 204) {
                        // No content is a success response.
                        return null;
                    }
                }
                this.logService.error(e);
                throw e;
            }
        });
    }
    registerVerificationEmailClicked(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            try {
                const response = yield this.apiService.send("POST", "/accounts/register/verification-email-clicked", request, false, false, env.getIdentityUrl());
                return response;
            }
            catch (e) {
                this.logService.error(e);
                throw e;
            }
        });
    }
    registerFinish(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            try {
                const response = yield this.apiService.send("POST", "/accounts/register/finish", request, false, true, env.getIdentityUrl());
                return response;
            }
            catch (e) {
                this.logService.error(e);
                throw e;
            }
        });
    }
}
exports.AccountApiServiceImplementation = AccountApiServiceImplementation;
//# sourceMappingURL=account-api.service.js.map