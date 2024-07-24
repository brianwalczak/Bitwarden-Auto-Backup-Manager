"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureNoteView = void 0;
const item_view_1 = require("./item.view");
class SecureNoteView extends item_view_1.ItemView {
    constructor(n) {
        super();
        this.type = null;
        if (!n) {
            return;
        }
        this.type = n.type;
    }
    get subTitle() {
        return null;
    }
    static fromJSON(obj) {
        return Object.assign(new SecureNoteView(), obj);
    }
}
exports.SecureNoteView = SecureNoteView;
//# sourceMappingURL=secure-note.view.js.map