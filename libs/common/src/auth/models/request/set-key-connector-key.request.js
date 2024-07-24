"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetKeyConnectorKeyRequest = void 0;
const enums_1 = require("../../../platform/enums");
class SetKeyConnectorKeyRequest {
    constructor(key, kdfConfig, orgIdentifier, keys) {
        this.key = key;
        this.kdf = kdfConfig.kdfType;
        this.kdfIterations = kdfConfig.iterations;
        if (kdfConfig.kdfType === enums_1.KdfType.Argon2id) {
            this.kdfMemory = kdfConfig.memory;
            this.kdfParallelism = kdfConfig.parallelism;
        }
        this.orgIdentifier = orgIdentifier;
        this.keys = keys;
    }
}
exports.SetKeyConnectorKeyRequest = SetKeyConnectorKeyRequest;
//# sourceMappingURL=set-key-connector-key.request.js.map