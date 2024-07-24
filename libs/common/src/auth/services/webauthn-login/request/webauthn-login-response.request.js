"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnLoginResponseRequest = void 0;
const utils_1 = require("../../../../platform/misc/utils");
class WebAuthnLoginResponseRequest {
    constructor(credential) {
        this.id = credential.id;
        this.rawId = utils_1.Utils.fromBufferToUrlB64(credential.rawId);
        this.type = credential.type;
        // WARNING: do not add PRF information here by mapping
        // credential.getClientExtensionResults() into the extensions property,
        // as it will be sent to the server (leaking credentials).
        this.extensions = {}; // Extensions are handled client-side
    }
}
exports.WebAuthnLoginResponseRequest = WebAuthnLoginResponseRequest;
//# sourceMappingURL=webauthn-login-response.request.js.map