"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const enums_1 = require("../../vault/enums");
const field_1 = require("../../vault/models/domain/field");
const field_view_1 = require("../../vault/models/view/field.view");
const utils_1 = require("./utils");
class FieldExport {
    static template() {
        const req = new FieldExport();
        req.name = "Field name";
        req.value = "Some value";
        req.type = enums_1.FieldType.Text;
        return req;
    }
    static toView(req, view = new field_view_1.FieldView()) {
        view.type = req.type;
        view.value = req.value;
        view.name = req.name;
        view.linkedId = req.linkedId;
        return view;
    }
    static toDomain(req, domain = new field_1.Field()) {
        domain.type = req.type;
        domain.value = req.value != null ? new enc_string_1.EncString(req.value) : null;
        domain.name = req.name != null ? new enc_string_1.EncString(req.name) : null;
        domain.linkedId = req.linkedId;
        return domain;
    }
    constructor(o) {
        if (o == null) {
            return;
        }
        this.name = (0, utils_1.safeGetString)(o.name);
        this.value = (0, utils_1.safeGetString)(o.value);
        this.type = o.type;
        this.linkedId = o.linkedId;
    }
}
exports.FieldExport = FieldExport;
//# sourceMappingURL=field.export.js.map