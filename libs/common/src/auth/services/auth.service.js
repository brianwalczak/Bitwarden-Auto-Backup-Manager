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
exports.AuthService = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../platform/misc/utils");
const authentication_status_1 = require("../enums/authentication-status");
class AuthService {
    constructor(accountService, messageSender, cryptoService, apiService, stateService, tokenService) {
        this.accountService = accountService;
        this.messageSender = messageSender;
        this.cryptoService = cryptoService;
        this.apiService = apiService;
        this.stateService = stateService;
        this.tokenService = tokenService;
        this.activeAccountStatus$ = this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id), (0, rxjs_1.switchMap)((userId) => {
            return this.authStatusFor$(userId);
        }));
        this.authStatuses$ = this.accountService.accounts$.pipe((0, rxjs_1.map)((accounts) => Object.keys(accounts)), (0, rxjs_1.switchMap)((entries) => {
            if (entries.length === 0) {
                return (0, rxjs_1.of)([]);
            }
            return (0, rxjs_1.combineLatest)(entries.map((userId) => this.authStatusFor$(userId).pipe((0, rxjs_1.map)((status) => ({ userId, status })))));
        }), (0, rxjs_1.map)((statuses) => {
            return statuses.reduce((acc, { userId, status }) => {
                acc[userId] = status;
                return acc;
            }, {});
        }));
    }
    authStatusFor$(userId) {
        if (!utils_1.Utils.isGuid(userId)) {
            return (0, rxjs_1.of)(authentication_status_1.AuthenticationStatus.LoggedOut);
        }
        return (0, rxjs_1.combineLatest)([
            this.cryptoService.getInMemoryUserKeyFor$(userId),
            this.tokenService.hasAccessToken$(userId),
        ]).pipe((0, rxjs_1.map)(([userKey, hasAccessToken]) => {
            if (!hasAccessToken) {
                return authentication_status_1.AuthenticationStatus.LoggedOut;
            }
            if (!userKey) {
                return authentication_status_1.AuthenticationStatus.Locked;
            }
            return authentication_status_1.AuthenticationStatus.Unlocked;
        }), (0, rxjs_1.distinctUntilChanged)(), (0, rxjs_1.shareReplay)({ bufferSize: 1, refCount: false }));
    }
    getAuthStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id))));
            return yield (0, rxjs_1.firstValueFrom)(this.authStatusFor$(userId));
        });
    }
    logOut(callback) {
        callback();
        this.messageSender.send("loggedOut");
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map