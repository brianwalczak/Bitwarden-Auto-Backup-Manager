"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedMetadata = void 0;
exports.linkedFieldOption = linkedFieldOption;
class LinkedMetadata {
    constructor(propertyKey, _i18nKey) {
        this.propertyKey = propertyKey;
        this._i18nKey = _i18nKey;
    }
    get i18nKey() {
        var _a;
        return (_a = this._i18nKey) !== null && _a !== void 0 ? _a : this.propertyKey;
    }
}
exports.LinkedMetadata = LinkedMetadata;
/**
 * A decorator used to set metadata used by Linked custom fields. Apply it to a class property or getter to make it
 *    available as a Linked custom field option.
 * @param id - A unique value that is saved in the Field model. It is used to look up the decorated class property.
 * @param i18nKey - The i18n key used to describe the decorated class property in the UI. If it is null, then the name
 *    of the class property will be used as the i18n key.
 */
function linkedFieldOption(id, i18nKey) {
    return (prototype, propertyKey) => {
        if (prototype.linkedFieldOptions == null) {
            prototype.linkedFieldOptions = new Map();
        }
        prototype.linkedFieldOptions.set(id, new LinkedMetadata(propertyKey, i18nKey));
    };
}
//# sourceMappingURL=linked-field-option.decorator.js.map