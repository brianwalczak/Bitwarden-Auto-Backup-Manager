"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackRequestedError = exports.Fido2ClientService = exports.UserRequestedFallbackAbortReason = void 0;
exports.UserRequestedFallbackAbortReason = "UserRequestedFallback";
/**
 * This class represents an abstraction of the WebAuthn Client as described by W3C:
 * https://www.w3.org/TR/webauthn-3/#webauthn-client
 *
 * The WebAuthn Client is an intermediary entity typically implemented in the user agent
 * (in whole, or in part). Conceptually, it underlies the Web Authentication API and embodies
 * the implementation of the Web Authentication API's operations.
 *
 * It is responsible for both marshalling the inputs for the underlying authenticator operations,
 * and for returning the results of the latter operations to the Web Authentication API's callers.
 */
class Fido2ClientService {
}
exports.Fido2ClientService = Fido2ClientService;
/**
 * Error thrown when the user requests a fallback to the browser's built-in WebAuthn implementation.
 */
class FallbackRequestedError extends Error {
    constructor() {
        super("FallbackRequested");
        this.fallbackRequested = true;
    }
}
exports.FallbackRequestedError = FallbackRequestedError;
//# sourceMappingURL=fido2-client.service.abstraction.js.map