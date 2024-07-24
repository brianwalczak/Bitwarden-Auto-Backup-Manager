"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeResponse = exports.KeyResponse = exports.TwoFactorWebAuthnResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const utils_1 = require("../../../platform/misc/utils");
class TwoFactorWebAuthnResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        const keys = this.getResponseProperty("Keys");
        this.keys = keys == null ? null : keys.map((k) => new KeyResponse(k));
    }
}
exports.TwoFactorWebAuthnResponse = TwoFactorWebAuthnResponse;
class KeyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.name = this.getResponseProperty("Name");
        this.id = this.getResponseProperty("Id");
        this.migrated = this.getResponseProperty("Migrated");
    }
}
exports.KeyResponse = KeyResponse;
class ChallengeResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.attestation = this.getResponseProperty("attestation");
        this.authenticatorSelection = this.getResponseProperty("authenticatorSelection");
        this.challenge = utils_1.Utils.fromUrlB64ToArray(this.getResponseProperty("challenge"));
        this.excludeCredentials = this.getResponseProperty("excludeCredentials").map((c) => {
            c.id = utils_1.Utils.fromUrlB64ToArray(c.id).buffer;
            return c;
        });
        this.extensions = this.getResponseProperty("extensions");
        this.pubKeyCredParams = this.getResponseProperty("pubKeyCredParams");
        this.rp = this.getResponseProperty("rp");
        this.timeout = this.getResponseProperty("timeout");
        const user = this.getResponseProperty("user");
        user.id = utils_1.Utils.fromUrlB64ToArray(user.id);
        this.user = user;
    }
}
exports.ChallengeResponse = ChallengeResponse;
//# sourceMappingURL=two-factor-web-authn.response.js.map