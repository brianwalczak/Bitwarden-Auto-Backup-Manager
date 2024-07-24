"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendView = void 0;
const utils_1 = require("../../../../platform/misc/utils");
const symmetric_crypto_key_1 = require("../../../../platform/models/domain/symmetric-crypto-key");
const send_file_view_1 = require("./send-file.view");
const send_text_view_1 = require("./send-text.view");
class SendView {
    constructor(s) {
        this.id = null;
        this.accessId = null;
        this.name = null;
        this.notes = null;
        this.type = null;
        this.text = new send_text_view_1.SendTextView();
        this.file = new send_file_view_1.SendFileView();
        this.maxAccessCount = null;
        this.accessCount = 0;
        this.revisionDate = null;
        this.deletionDate = null;
        this.expirationDate = null;
        this.password = null;
        this.disabled = false;
        this.hideEmail = false;
        if (!s) {
            return;
        }
        this.id = s.id;
        this.accessId = s.accessId;
        this.type = s.type;
        this.maxAccessCount = s.maxAccessCount;
        this.accessCount = s.accessCount;
        this.revisionDate = s.revisionDate;
        this.deletionDate = s.deletionDate;
        this.expirationDate = s.expirationDate;
        this.disabled = s.disabled;
        this.password = s.password;
        this.hideEmail = s.hideEmail;
    }
    get urlB64Key() {
        return utils_1.Utils.fromBufferToUrlB64(this.key);
    }
    get maxAccessCountReached() {
        if (this.maxAccessCount == null) {
            return false;
        }
        return this.accessCount >= this.maxAccessCount;
    }
    get expired() {
        if (this.expirationDate == null) {
            return false;
        }
        return this.expirationDate <= new Date();
    }
    get pendingDelete() {
        return this.deletionDate <= new Date();
    }
    toJSON() {
        return utils_1.Utils.merge(Object.assign({}, this), {
            key: utils_1.Utils.fromBufferToB64(this.key),
        });
    }
    static fromJSON(json) {
        if (json == null) {
            return null;
        }
        return Object.assign(new SendView(), json, {
            key: utils_1.Utils.fromB64ToArray(json.key),
            cryptoKey: symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(json.cryptoKey),
            text: send_text_view_1.SendTextView.fromJSON(json.text),
            file: send_file_view_1.SendFileView.fromJSON(json.file),
            revisionDate: json.revisionDate == null ? null : new Date(json.revisionDate),
            deletionDate: json.deletionDate == null ? null : new Date(json.deletionDate),
            expirationDate: json.expirationDate == null ? null : new Date(json.expirationDate),
        });
    }
}
exports.SendView = SendView;
//# sourceMappingURL=send.view.js.map