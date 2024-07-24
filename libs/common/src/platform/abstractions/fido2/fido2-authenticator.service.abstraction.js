"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fido2AuthenticatorError = exports.Fido2AuthenticatorErrorCode = exports.Fido2AlgorithmIdentifier = exports.Fido2AuthenticatorService = void 0;
/**
 * This class represents an abstraction of the WebAuthn Authenticator model as described by W3C:
 * https://www.w3.org/TR/webauthn-3/#sctn-authenticator-model
 *
 * The authenticator provides key management and cryptographic signatures.
 */
class Fido2AuthenticatorService {
}
exports.Fido2AuthenticatorService = Fido2AuthenticatorService;
var Fido2AlgorithmIdentifier;
(function (Fido2AlgorithmIdentifier) {
    Fido2AlgorithmIdentifier[Fido2AlgorithmIdentifier["ES256"] = -7] = "ES256";
    Fido2AlgorithmIdentifier[Fido2AlgorithmIdentifier["RS256"] = -257] = "RS256";
})(Fido2AlgorithmIdentifier || (exports.Fido2AlgorithmIdentifier = Fido2AlgorithmIdentifier = {}));
var Fido2AuthenticatorErrorCode;
(function (Fido2AuthenticatorErrorCode) {
    Fido2AuthenticatorErrorCode["Unknown"] = "UnknownError";
    Fido2AuthenticatorErrorCode["NotSupported"] = "NotSupportedError";
    Fido2AuthenticatorErrorCode["InvalidState"] = "InvalidStateError";
    Fido2AuthenticatorErrorCode["NotAllowed"] = "NotAllowedError";
    Fido2AuthenticatorErrorCode["Constraint"] = "ConstraintError";
})(Fido2AuthenticatorErrorCode || (exports.Fido2AuthenticatorErrorCode = Fido2AuthenticatorErrorCode = {}));
class Fido2AuthenticatorError extends Error {
    constructor(errorCode) {
        super(errorCode);
        this.errorCode = errorCode;
    }
}
exports.Fido2AuthenticatorError = Fido2AuthenticatorError;
//# sourceMappingURL=fido2-authenticator.service.abstraction.js.map