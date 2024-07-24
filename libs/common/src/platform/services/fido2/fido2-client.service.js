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
exports.Fido2ClientService = void 0;
const rxjs_1 = require("rxjs");
const tldts_1 = require("tldts");
const authentication_status_1 = require("../../../auth/enums/authentication-status");
const fido2_authenticator_service_abstraction_1 = require("../../abstractions/fido2/fido2-authenticator.service.abstraction");
const fido2_client_service_abstraction_1 = require("../../abstractions/fido2/fido2-client.service.abstraction");
const utils_1 = require("../../misc/utils");
const scheduled_task_name_enum_1 = require("../../scheduling/scheduled-task-name.enum");
const domain_utils_1 = require("./domain-utils");
const fido2_utils_1 = require("./fido2-utils");
/**
 * Bitwarden implementation of the Web Authentication API as described by W3C
 * https://www.w3.org/TR/webauthn-3/#sctn-api
 *
 * It is highly recommended that the W3C specification is used a reference when reading this code.
 */
class Fido2ClientService {
    constructor(authenticator, configService, authService, vaultSettingsService, domainSettingsService, taskSchedulerService, logService) {
        this.authenticator = authenticator;
        this.configService = configService;
        this.authService = authService;
        this.vaultSettingsService = vaultSettingsService;
        this.domainSettingsService = domainSettingsService;
        this.taskSchedulerService = taskSchedulerService;
        this.logService = logService;
        this.TIMEOUTS = {
            NO_VERIFICATION: {
                DEFAULT: 120000,
                MIN: 30000,
                MAX: 180000,
            },
            WITH_VERIFICATION: {
                DEFAULT: 300000,
                MIN: 30000,
                MAX: 600000,
            },
        };
        this.setAbortTimeout = (abortController, userVerification, timeout) => {
            let clampedTimeout;
            const { WITH_VERIFICATION, NO_VERIFICATION } = this.TIMEOUTS;
            if (userVerification === "required") {
                timeout = timeout !== null && timeout !== void 0 ? timeout : WITH_VERIFICATION.DEFAULT;
                clampedTimeout = Math.max(WITH_VERIFICATION.MIN, Math.min(timeout, WITH_VERIFICATION.MAX));
            }
            else {
                timeout = timeout !== null && timeout !== void 0 ? timeout : NO_VERIFICATION.DEFAULT;
                clampedTimeout = Math.max(NO_VERIFICATION.MIN, Math.min(timeout, NO_VERIFICATION.MAX));
            }
            this.timeoutAbortController = abortController;
            return this.taskSchedulerService.setTimeout(scheduled_task_name_enum_1.ScheduledTaskNames.fido2ClientAbortTimeout, clampedTimeout);
        };
        this.taskSchedulerService.registerTaskHandler(scheduled_task_name_enum_1.ScheduledTaskNames.fido2ClientAbortTimeout, () => { var _a; return (_a = this.timeoutAbortController) === null || _a === void 0 ? void 0 : _a.abort(); });
    }
    isFido2FeatureEnabled(hostname, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const isUserLoggedIn = (yield this.authService.getAuthStatus()) !== authentication_status_1.AuthenticationStatus.LoggedOut;
            if (!isUserLoggedIn) {
                return false;
            }
            const neverDomains = yield (0, rxjs_1.firstValueFrom)(this.domainSettingsService.neverDomains$);
            const isExcludedDomain = neverDomains != null && hostname in neverDomains;
            if (isExcludedDomain) {
                return false;
            }
            const serverConfig = yield (0, rxjs_1.firstValueFrom)(this.configService.serverConfig$);
            const isOriginEqualBitwardenVault = origin === ((_a = serverConfig.environment) === null || _a === void 0 ? void 0 : _a.vault);
            if (isOriginEqualBitwardenVault) {
                return false;
            }
            return yield (0, rxjs_1.firstValueFrom)(this.vaultSettingsService.enablePasskeys$);
        });
    }
    createCredential(params_1, tab_1) {
        return __awaiter(this, arguments, void 0, function* (params, tab, abortController = new AbortController()) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            const parsedOrigin = (0, tldts_1.parse)(params.origin, { allowPrivateDomains: true });
            const enableFido2VaultCredentials = yield this.isFido2FeatureEnabled(parsedOrigin.hostname, params.origin);
            if (!enableFido2VaultCredentials) {
                (_a = this.logService) === null || _a === void 0 ? void 0 : _a.warning(`[Fido2Client] Fido2VaultCredential is not enabled`);
                throw new fido2_client_service_abstraction_1.FallbackRequestedError();
            }
            if (!params.sameOriginWithAncestors) {
                (_b = this.logService) === null || _b === void 0 ? void 0 : _b.warning(`[Fido2Client] Invalid 'sameOriginWithAncestors' value: ${params.sameOriginWithAncestors}`);
                throw new DOMException("Invalid 'sameOriginWithAncestors' value", "NotAllowedError");
            }
            const userId = fido2_utils_1.Fido2Utils.stringToBuffer(params.user.id);
            if (userId.length < 1 || userId.length > 64) {
                (_c = this.logService) === null || _c === void 0 ? void 0 : _c.warning(`[Fido2Client] Invalid 'user.id' length: ${params.user.id} (${userId.length})`);
                throw new TypeError("Invalid 'user.id' length");
            }
            params.rp.id = (_d = params.rp.id) !== null && _d !== void 0 ? _d : parsedOrigin.hostname;
            if (parsedOrigin.hostname == undefined ||
                (!params.origin.startsWith("https://") && parsedOrigin.hostname !== "localhost")) {
                (_e = this.logService) === null || _e === void 0 ? void 0 : _e.warning(`[Fido2Client] Invalid https origin: ${params.origin}`);
                throw new DOMException("'origin' is not a valid https origin", "SecurityError");
            }
            if (!(0, domain_utils_1.isValidRpId)(params.rp.id, params.origin)) {
                (_f = this.logService) === null || _f === void 0 ? void 0 : _f.warning(`[Fido2Client] 'rp.id' cannot be used with the current origin: rp.id = ${params.rp.id}; origin = ${params.origin}`);
                throw new DOMException("'rp.id' cannot be used with the current origin", "SecurityError");
            }
            let credTypesAndPubKeyAlgs;
            if (((_g = params.pubKeyCredParams) === null || _g === void 0 ? void 0 : _g.length) > 0) {
                // Filter out all unsupported algorithms
                credTypesAndPubKeyAlgs = params.pubKeyCredParams.filter((kp) => kp.alg === -7 && kp.type === "public-key");
            }
            else {
                // Assign default algorithms
                credTypesAndPubKeyAlgs = [
                    { alg: -7, type: "public-key" },
                    { alg: -257, type: "public-key" },
                ];
            }
            if (credTypesAndPubKeyAlgs.length === 0) {
                const requestedAlgorithms = credTypesAndPubKeyAlgs.map((p) => p.alg).join(", ");
                (_h = this.logService) === null || _h === void 0 ? void 0 : _h.warning(`[Fido2Client] No compatible algorithms found, RP requested: ${requestedAlgorithms}`);
                throw new DOMException("No supported key algorithms were found", "NotSupportedError");
            }
            const collectedClientData = {
                type: "webauthn.create",
                challenge: params.challenge,
                origin: params.origin,
                crossOrigin: !params.sameOriginWithAncestors,
                // tokenBinding: {} // Not currently supported
            };
            const clientDataJSON = JSON.stringify(collectedClientData);
            const clientDataJSONBytes = utils_1.Utils.fromByteStringToArray(clientDataJSON);
            const clientDataHash = yield crypto.subtle.digest({ name: "SHA-256" }, clientDataJSONBytes);
            const makeCredentialParams = mapToMakeCredentialParams({
                params,
                credTypesAndPubKeyAlgs,
                clientDataHash,
            });
            // Set timeout before invoking authenticator
            if (abortController.signal.aborted) {
                (_j = this.logService) === null || _j === void 0 ? void 0 : _j.info(`[Fido2Client] Aborted with AbortController`);
                throw new DOMException("The operation either timed out or was not allowed.", "AbortError");
            }
            const timeoutSubscription = this.setAbortTimeout(abortController, (_k = params.authenticatorSelection) === null || _k === void 0 ? void 0 : _k.userVerification, params.timeout);
            let makeCredentialResult;
            try {
                makeCredentialResult = yield this.authenticator.makeCredential(makeCredentialParams, tab, abortController);
            }
            catch (error) {
                if (abortController.signal.aborted &&
                    abortController.signal.reason === fido2_client_service_abstraction_1.UserRequestedFallbackAbortReason) {
                    (_l = this.logService) === null || _l === void 0 ? void 0 : _l.info(`[Fido2Client] Aborting because user requested fallback`);
                    throw new fido2_client_service_abstraction_1.FallbackRequestedError();
                }
                if (error instanceof fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError &&
                    error.errorCode === fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.InvalidState) {
                    (_m = this.logService) === null || _m === void 0 ? void 0 : _m.warning(`[Fido2Client] Unknown error: ${error}`);
                    throw new DOMException("Unknown error occured.", "InvalidStateError");
                }
                (_o = this.logService) === null || _o === void 0 ? void 0 : _o.info(`[Fido2Client] Aborted by user: ${error}`);
                throw new DOMException("The operation either timed out or was not allowed.", "NotAllowedError");
            }
            if (abortController.signal.aborted) {
                (_p = this.logService) === null || _p === void 0 ? void 0 : _p.info(`[Fido2Client] Aborted with AbortController`);
                throw new DOMException("The operation either timed out or was not allowed.", "AbortError");
            }
            let credProps;
            if ((_q = params.extensions) === null || _q === void 0 ? void 0 : _q.credProps) {
                credProps = {
                    rk: makeCredentialParams.requireResidentKey,
                };
            }
            timeoutSubscription === null || timeoutSubscription === void 0 ? void 0 : timeoutSubscription.unsubscribe();
            return {
                credentialId: fido2_utils_1.Fido2Utils.bufferToString(makeCredentialResult.credentialId),
                attestationObject: fido2_utils_1.Fido2Utils.bufferToString(makeCredentialResult.attestationObject),
                authData: fido2_utils_1.Fido2Utils.bufferToString(makeCredentialResult.authData),
                clientDataJSON: fido2_utils_1.Fido2Utils.bufferToString(clientDataJSONBytes),
                publicKey: fido2_utils_1.Fido2Utils.bufferToString(makeCredentialResult.publicKey),
                publicKeyAlgorithm: makeCredentialResult.publicKeyAlgorithm,
                transports: params.rp.id === "google.com" ? ["internal", "usb"] : ["internal"],
                extensions: { credProps },
            };
        });
    }
    assertCredential(params_1, tab_1) {
        return __awaiter(this, arguments, void 0, function* (params, tab, abortController = new AbortController()) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const parsedOrigin = (0, tldts_1.parse)(params.origin, { allowPrivateDomains: true });
            const enableFido2VaultCredentials = yield this.isFido2FeatureEnabled(parsedOrigin.hostname, params.origin);
            if (!enableFido2VaultCredentials) {
                (_a = this.logService) === null || _a === void 0 ? void 0 : _a.warning(`[Fido2Client] Fido2VaultCredential is not enabled`);
                throw new fido2_client_service_abstraction_1.FallbackRequestedError();
            }
            params.rpId = (_b = params.rpId) !== null && _b !== void 0 ? _b : parsedOrigin.hostname;
            if (parsedOrigin.hostname == undefined ||
                (!params.origin.startsWith("https://") && parsedOrigin.hostname !== "localhost")) {
                (_c = this.logService) === null || _c === void 0 ? void 0 : _c.warning(`[Fido2Client] Invalid https origin: ${params.origin}`);
                throw new DOMException("'origin' is not a valid https origin", "SecurityError");
            }
            if (!(0, domain_utils_1.isValidRpId)(params.rpId, params.origin)) {
                (_d = this.logService) === null || _d === void 0 ? void 0 : _d.warning(`[Fido2Client] 'rp.id' cannot be used with the current origin: rp.id = ${params.rpId}; origin = ${params.origin}`);
                throw new DOMException("'rp.id' cannot be used with the current origin", "SecurityError");
            }
            const collectedClientData = {
                type: "webauthn.get",
                challenge: params.challenge,
                origin: params.origin,
                crossOrigin: !params.sameOriginWithAncestors,
                // tokenBinding: {} // Not currently supported
            };
            const clientDataJSON = JSON.stringify(collectedClientData);
            const clientDataJSONBytes = utils_1.Utils.fromByteStringToArray(clientDataJSON);
            const clientDataHash = yield crypto.subtle.digest({ name: "SHA-256" }, clientDataJSONBytes);
            const getAssertionParams = mapToGetAssertionParams({ params, clientDataHash });
            if (abortController.signal.aborted) {
                (_e = this.logService) === null || _e === void 0 ? void 0 : _e.info(`[Fido2Client] Aborted with AbortController`);
                throw new DOMException("The operation either timed out or was not allowed.", "AbortError");
            }
            const timeoutSubscription = this.setAbortTimeout(abortController, params.userVerification, params.timeout);
            let getAssertionResult;
            try {
                getAssertionResult = yield this.authenticator.getAssertion(getAssertionParams, tab, abortController);
            }
            catch (error) {
                if (abortController.signal.aborted &&
                    abortController.signal.reason === fido2_client_service_abstraction_1.UserRequestedFallbackAbortReason) {
                    (_f = this.logService) === null || _f === void 0 ? void 0 : _f.info(`[Fido2Client] Aborting because user requested fallback`);
                    throw new fido2_client_service_abstraction_1.FallbackRequestedError();
                }
                if (error instanceof fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError &&
                    error.errorCode === fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.InvalidState) {
                    (_g = this.logService) === null || _g === void 0 ? void 0 : _g.warning(`[Fido2Client] Unknown error: ${error}`);
                    throw new DOMException("Unknown error occured.", "InvalidStateError");
                }
                (_h = this.logService) === null || _h === void 0 ? void 0 : _h.info(`[Fido2Client] Aborted by user: ${error}`);
                throw new DOMException("The operation either timed out or was not allowed.", "NotAllowedError");
            }
            if (abortController.signal.aborted) {
                (_j = this.logService) === null || _j === void 0 ? void 0 : _j.info(`[Fido2Client] Aborted with AbortController`);
                throw new DOMException("The operation either timed out or was not allowed.", "AbortError");
            }
            timeoutSubscription === null || timeoutSubscription === void 0 ? void 0 : timeoutSubscription.unsubscribe();
            return {
                authenticatorData: fido2_utils_1.Fido2Utils.bufferToString(getAssertionResult.authenticatorData),
                clientDataJSON: fido2_utils_1.Fido2Utils.bufferToString(clientDataJSONBytes),
                credentialId: fido2_utils_1.Fido2Utils.bufferToString(getAssertionResult.selectedCredential.id),
                userHandle: getAssertionResult.selectedCredential.userHandle !== undefined
                    ? fido2_utils_1.Fido2Utils.bufferToString(getAssertionResult.selectedCredential.userHandle)
                    : undefined,
                signature: fido2_utils_1.Fido2Utils.bufferToString(getAssertionResult.signature),
            };
        });
    }
}
exports.Fido2ClientService = Fido2ClientService;
/**
 * Convert data gathered by the WebAuthn Client to a format that can be used by the authenticator.
 */
function mapToMakeCredentialParams({ params, credTypesAndPubKeyAlgs, clientDataHash, }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const excludeCredentialDescriptorList = (_b = (_a = params.excludeCredentials) === null || _a === void 0 ? void 0 : _a.map((credential) => ({
        id: fido2_utils_1.Fido2Utils.stringToBuffer(credential.id),
        transports: credential.transports,
        type: credential.type,
    }))) !== null && _b !== void 0 ? _b : [];
    const requireResidentKey = ((_c = params.authenticatorSelection) === null || _c === void 0 ? void 0 : _c.residentKey) === "required" ||
        ((_d = params.authenticatorSelection) === null || _d === void 0 ? void 0 : _d.residentKey) === "preferred" ||
        (((_e = params.authenticatorSelection) === null || _e === void 0 ? void 0 : _e.residentKey) === undefined &&
            ((_f = params.authenticatorSelection) === null || _f === void 0 ? void 0 : _f.requireResidentKey) === true);
    const requireUserVerification = ((_g = params.authenticatorSelection) === null || _g === void 0 ? void 0 : _g.userVerification) === "required" ||
        ((_h = params.authenticatorSelection) === null || _h === void 0 ? void 0 : _h.userVerification) === "preferred" ||
        ((_j = params.authenticatorSelection) === null || _j === void 0 ? void 0 : _j.userVerification) === undefined;
    return {
        requireResidentKey,
        requireUserVerification,
        enterpriseAttestationPossible: params.attestation === "enterprise",
        excludeCredentialDescriptorList,
        credTypesAndPubKeyAlgs,
        hash: clientDataHash,
        rpEntity: {
            id: params.rp.id,
            name: params.rp.name,
        },
        userEntity: {
            id: fido2_utils_1.Fido2Utils.stringToBuffer(params.user.id),
            displayName: params.user.displayName,
            name: params.user.name,
        },
        fallbackSupported: params.fallbackSupported,
    };
}
/**
 * Convert data gathered by the WebAuthn Client to a format that can be used by the authenticator.
 */
function mapToGetAssertionParams({ params, clientDataHash, }) {
    const allowCredentialDescriptorList = params.allowedCredentialIds.map((id) => ({
        id: fido2_utils_1.Fido2Utils.stringToBuffer(id),
        type: "public-key",
    }));
    const requireUserVerification = params.userVerification === "required" ||
        params.userVerification === "preferred" ||
        params.userVerification === undefined;
    return {
        rpId: params.rpId,
        requireUserVerification,
        hash: clientDataHash,
        allowCredentialDescriptorList,
        extensions: {},
        fallbackSupported: params.fallbackSupported,
    };
}
//# sourceMappingURL=fido2-client.service.js.map