"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldView = void 0;
class FieldView {
    constructor(f) {
        this.name = null;
        this.value = null;
        this.type = null;
        this.newField = false; // Marks if the field is new and hasn't been saved
        this.showValue = false;
        this.showCount = false;
        this.linkedId = null;
        if (!f) {
            return;
        }
        this.type = f.type;
        this.linkedId = f.linkedId;
    }
    get maskedValue() {
        return this.value != null ? "••••••••" : null;
    }
    static fromJSON(obj) {
        return Object.assign(new FieldView(), obj);
    }
}
exports.FieldView = FieldView;
//# sourceMappingURL=field.view.js.map