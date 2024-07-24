"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorYubiKeyResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class TwoFactorYubiKeyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        this.key1 = this.getResponseProperty("Key1");
        this.key2 = this.getResponseProperty("Key2");
        this.key3 = this.getResponseProperty("Key3");
        this.key4 = this.getResponseProperty("Key4");
        this.key5 = this.getResponseProperty("Key5");
        this.nfc = this.getResponseProperty("Nfc");
    }
}
exports.TwoFactorYubiKeyResponse = TwoFactorYubiKeyResponse;
//# sourceMappingURL=two-factor-yubi-key.response.js.map