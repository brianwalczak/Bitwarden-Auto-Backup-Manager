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
exports.SsoLoginService = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../platform/state");
/**
 * Uses disk storage so that the code verifier can be persisted across sso redirects.
 */
const CODE_VERIFIER = new state_1.KeyDefinition(state_1.SSO_DISK, "ssoCodeVerifier", {
    deserializer: (codeVerifier) => codeVerifier,
});
/**
 * Uses disk storage so that the sso state can be persisted across sso redirects.
 */
const SSO_STATE = new state_1.KeyDefinition(state_1.SSO_DISK, "ssoState", {
    deserializer: (state) => state,
});
/**
 * Uses disk storage so that the organization sso identifier can be persisted across sso redirects.
 */
const USER_ORGANIZATION_SSO_IDENTIFIER = new state_1.UserKeyDefinition(state_1.SSO_DISK, "organizationSsoIdentifier", {
    deserializer: (organizationIdentifier) => organizationIdentifier,
    clearOn: ["logout"], // Used for login, so not needed past logout
});
/**
 * Uses disk storage so that the organization sso identifier can be persisted across sso redirects.
 */
const GLOBAL_ORGANIZATION_SSO_IDENTIFIER = new state_1.KeyDefinition(state_1.SSO_DISK, "organizationSsoIdentifier", {
    deserializer: (organizationIdentifier) => organizationIdentifier,
});
/**
 * Uses disk storage so that the user's email can be persisted across sso redirects.
 */
const SSO_EMAIL = new state_1.KeyDefinition(state_1.SSO_DISK, "ssoEmail", {
    deserializer: (state) => state,
});
class SsoLoginService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.codeVerifierState = this.stateProvider.getGlobal(CODE_VERIFIER);
        this.ssoState = this.stateProvider.getGlobal(SSO_STATE);
        this.orgSsoIdentifierState = this.stateProvider.getGlobal(GLOBAL_ORGANIZATION_SSO_IDENTIFIER);
        this.ssoEmailState = this.stateProvider.getGlobal(SSO_EMAIL);
        this.activeUserOrgSsoIdentifierState = this.stateProvider.getActive(USER_ORGANIZATION_SSO_IDENTIFIER);
    }
    getCodeVerifier() {
        return (0, rxjs_1.firstValueFrom)(this.codeVerifierState.state$);
    }
    setCodeVerifier(codeVerifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.codeVerifierState.update((_) => codeVerifier);
        });
    }
    getSsoState() {
        return (0, rxjs_1.firstValueFrom)(this.ssoState.state$);
    }
    setSsoState(ssoState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ssoState.update((_) => ssoState);
        });
    }
    getOrganizationSsoIdentifier() {
        return (0, rxjs_1.firstValueFrom)(this.orgSsoIdentifierState.state$);
    }
    setOrganizationSsoIdentifier(organizationIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.orgSsoIdentifierState.update((_) => organizationIdentifier);
        });
    }
    getSsoEmail() {
        return (0, rxjs_1.firstValueFrom)(this.ssoEmailState.state$);
    }
    setSsoEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ssoEmailState.update((_) => email);
        });
    }
    getActiveUserOrganizationSsoIdentifier() {
        return (0, rxjs_1.firstValueFrom)(this.activeUserOrgSsoIdentifierState.state$);
    }
    setActiveUserOrganizationSsoIdentifier(organizationIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.activeUserOrgSsoIdentifierState.update((_) => organizationIdentifier);
        });
    }
}
exports.SsoLoginService = SsoLoginService;
//# sourceMappingURL=sso-login.service.js.map