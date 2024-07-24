"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNoteExport = void 0;
const enums_1 = require("../../vault/enums");
const secure_note_1 = require("../../vault/models/domain/secure-note");
const secure_note_view_1 = require("../../vault/models/view/secure-note.view");
class SecureNoteExport {
    static template() {
        const req = new SecureNoteExport();
        req.type = enums_1.SecureNoteType.Generic;
        return req;
    }
    static toView(req, view = new secure_note_view_1.SecureNoteView()) {
        view.type = req.type;
        return view;
    }
    static toDomain(req, view = new secure_note_1.SecureNote()) {
        view.type = req.type;
        return view;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.type = o.type;
    }
}
exports.SecureNoteExport = SecureNoteExport;
//# sourceMappingURL=secure-note.export.js.map