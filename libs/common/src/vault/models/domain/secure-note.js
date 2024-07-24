"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNote = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const secure_note_data_1 = require("../data/secure-note.data");
const secure_note_view_1 = require("../view/secure-note.view");
class SecureNote extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
    }
    decrypt(orgId, encKey) {
        return Promise.resolve(new secure_note_view_1.SecureNoteView(this));
    }
    toSecureNoteData() {
        const n = new secure_note_data_1.SecureNoteData();
        n.type = this.type;
        return n;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(new SecureNote(), obj);
    }
}
exports.SecureNote = SecureNote;
//# sourceMappingURL=secure-note.js.map