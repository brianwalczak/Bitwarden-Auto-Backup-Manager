"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentView = void 0;
const symmetric_crypto_key_1 = require("../../../platform/models/domain/symmetric-crypto-key");
class AttachmentView {
    constructor(a) {
        this.id = null;
        this.url = null;
        this.size = null;
        this.sizeName = null;
        this.fileName = null;
        this.key = null;
        if (!a) {
            return;
        }
        this.id = a.id;
        this.url = a.url;
        this.size = a.size;
        this.sizeName = a.sizeName;
    }
    get fileSize() {
        try {
            if (this.size != null) {
                return parseInt(this.size, null);
            }
        }
        catch (_a) {
            // Invalid file size.
        }
        return 0;
    }
    static fromJSON(obj) {
        const key = obj.key == null ? null : symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(obj.key);
        return Object.assign(new AttachmentView(), obj, { key: key });
    }
}
exports.AttachmentView = AttachmentView;
//# sourceMappingURL=attachment.view.js.map