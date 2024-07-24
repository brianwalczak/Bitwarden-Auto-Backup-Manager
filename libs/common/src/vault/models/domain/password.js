"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const password_history_data_1 = require("../data/password-history.data");
const password_history_view_1 = require("../view/password-history.view");
class Password extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            password: null,
        });
        this.lastUsedDate = new Date(obj.lastUsedDate);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new password_history_view_1.PasswordHistoryView(this), {
            password: null,
        }, orgId, encKey);
    }
    toPasswordHistoryData() {
        const ph = new password_history_data_1.PasswordHistoryData();
        ph.lastUsedDate = this.lastUsedDate.toISOString();
        this.buildDataModel(this, ph, {
            password: null,
        });
        return ph;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const password = enc_string_1.EncString.fromJSON(obj.password);
        const lastUsedDate = obj.lastUsedDate == null ? null : new Date(obj.lastUsedDate);
        return Object.assign(new Password(), obj, {
            password,
            lastUsedDate,
        });
    }
}
exports.Password = Password;
//# sourceMappingURL=password.js.map