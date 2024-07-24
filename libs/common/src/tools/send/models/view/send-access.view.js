"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAccessView = void 0;
const send_file_view_1 = require("./send-file.view");
const send_text_view_1 = require("./send-text.view");
class SendAccessView {
    constructor(s) {
        this.id = null;
        this.name = null;
        this.type = null;
        this.text = new send_text_view_1.SendTextView();
        this.file = new send_file_view_1.SendFileView();
        this.expirationDate = null;
        this.creatorIdentifier = null;
        if (!s) {
            return;
        }
        this.id = s.id;
        this.type = s.type;
        this.expirationDate = s.expirationDate;
        this.creatorIdentifier = s.creatorIdentifier;
    }
}
exports.SendAccessView = SendAccessView;
//# sourceMappingURL=send-access.view.js.map