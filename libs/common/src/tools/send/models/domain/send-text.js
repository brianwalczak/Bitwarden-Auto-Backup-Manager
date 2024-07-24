"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendText = void 0;
const domain_base_1 = require("../../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../../platform/models/domain/enc-string");
const send_text_view_1 = require("../view/send-text.view");
class SendText extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.hidden = obj.hidden;
        this.buildDomainModel(this, obj, {
            text: null,
        }, []);
    }
    decrypt(key) {
        return this.decryptObj(new send_text_view_1.SendTextView(this), {
            text: null,
        }, null, key);
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(new SendText(), obj, {
            text: enc_string_1.EncString.fromJSON(obj.text),
        });
    }
}
exports.SendText = SendText;
//# sourceMappingURL=send-text.js.map