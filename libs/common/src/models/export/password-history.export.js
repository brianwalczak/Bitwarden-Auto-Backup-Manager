"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHistoryExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const password_1 = require("../../vault/models/domain/password");
const password_history_view_1 = require("../../vault/models/view/password-history.view");
const utils_1 = require("./utils");
class PasswordHistoryExport {
    static template() {
        const req = new PasswordHistoryExport();
        req.password = null;
        req.lastUsedDate = null;
        return req;
    }
    static toView(req, view = new password_history_view_1.PasswordHistoryView()) {
        view.password = req.password;
        view.lastUsedDate = req.lastUsedDate;
        return view;
    }
    static toDomain(req, domain = new password_1.Password()) {
        domain.password = req.password != null ? new enc_string_1.EncString(req.password) : null;
        domain.lastUsedDate = req.lastUsedDate;
        return domain;
    }
    constructor(o) {
        this.lastUsedDate = null;
        if (o == null) {
            return;
        }
        this.password = (0, utils_1.safeGetString)(o.password);
        this.lastUsedDate = o.lastUsedDate;
    }
}
exports.PasswordHistoryExport = PasswordHistoryExport;
//# sourceMappingURL=password-history.export.js.map