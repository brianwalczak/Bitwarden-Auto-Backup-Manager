"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserKeyResponse = void 0;
const base_response_1 = require("./base.response");
class UserKeyResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.userId = this.getResponseProperty("UserId");
        this.publicKey = this.getResponseProperty("PublicKey");
    }
}
exports.UserKeyResponse = UserKeyResponse;
//# sourceMappingURL=user-key.response.js.map