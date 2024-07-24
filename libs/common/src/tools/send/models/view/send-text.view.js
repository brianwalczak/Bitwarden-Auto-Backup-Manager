"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTextView = void 0;
class SendTextView {
    constructor(t) {
        this.text = null;
        if (!t) {
            return;
        }
        this.hidden = t.hidden;
    }
    get maskedText() {
        return this.text != null ? "••••••••" : null;
    }
    static fromJSON(json) {
        if (json == null) {
            return null;
        }
        return Object.assign(new SendTextView(), json);
    }
}
exports.SendTextView = SendTextView;
//# sourceMappingURL=send-text.view.js.map