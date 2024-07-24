"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthRequestStorable = void 0;
const utils_1 = require("../../../platform/misc/utils");
class AdminAuthRequestStorable {
    constructor(init) {
        if (init) {
            Object.assign(this, init);
        }
    }
    toJSON() {
        return {
            id: this.id,
            privateKey: utils_1.Utils.fromBufferToByteString(this.privateKey),
        };
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        let privateKeyBuffer = null;
        if (obj.privateKey) {
            privateKeyBuffer = utils_1.Utils.fromByteStringToArray(obj.privateKey);
        }
        return new AdminAuthRequestStorable({
            id: obj.id,
            privateKey: privateKeyBuffer,
        });
    }
}
exports.AdminAuthRequestStorable = AdminAuthRequestStorable;
//# sourceMappingURL=admin-auth-req-storable.js.map