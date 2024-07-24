"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreloginResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class PreloginResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.kdf = this.getResponseProperty("Kdf");
        this.kdfIterations = this.getResponseProperty("KdfIterations");
        this.kdfMemory = this.getResponseProperty("KdfMemory");
        this.kdfParallelism = this.getResponseProperty("KdfParallelism");
    }
}
exports.PreloginResponse = PreloginResponse;
//# sourceMappingURL=prelogin.response.js.map