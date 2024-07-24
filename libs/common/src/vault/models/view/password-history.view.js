"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHistoryView = void 0;
class PasswordHistoryView {
    constructor(ph) {
        this.password = null;
        this.lastUsedDate = null;
        if (!ph) {
            return;
        }
        this.lastUsedDate = ph.lastUsedDate;
    }
    static fromJSON(obj) {
        const lastUsedDate = obj.lastUsedDate == null ? null : new Date(obj.lastUsedDate);
        return Object.assign(new PasswordHistoryView(), obj, {
            lastUsedDate: lastUsedDate,
        });
    }
}
exports.PasswordHistoryView = PasswordHistoryView;
//# sourceMappingURL=password-history.view.js.map