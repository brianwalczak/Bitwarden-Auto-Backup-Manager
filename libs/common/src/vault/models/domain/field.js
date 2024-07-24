"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const field_data_1 = require("../data/field.data");
const field_view_1 = require("../view/field.view");
class Field extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
        this.linkedId = obj.linkedId;
        this.buildDomainModel(this, obj, {
            name: null,
            value: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new field_view_1.FieldView(this), {
            name: null,
            value: null,
        }, orgId, encKey);
    }
    toFieldData() {
        const f = new field_data_1.FieldData();
        this.buildDataModel(this, f, {
            name: null,
            value: null,
            type: null,
            linkedId: null,
        }, ["type", "linkedId"]);
        return f;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const name = enc_string_1.EncString.fromJSON(obj.name);
        const value = enc_string_1.EncString.fromJSON(obj.value);
        return Object.assign(new Field(), obj, {
            name,
            value,
        });
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map