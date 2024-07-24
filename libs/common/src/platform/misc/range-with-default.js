"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeWithDefault = void 0;
/**
 * A range with a default value.
 *
 * Enforces constraints to ensure min > default > max.
 */
class RangeWithDefault {
    constructor(min, max, defaultValue) {
        this.min = min;
        this.max = max;
        this.defaultValue = defaultValue;
        if (min > max) {
            throw new Error(`${min} is greater than ${max}.`);
        }
        if (this.inRange(defaultValue) === false) {
            throw new Error("Default value is not in range.");
        }
    }
    inRange(value) {
        return value >= this.min && value <= this.max;
    }
}
exports.RangeWithDefault = RangeWithDefault;
//# sourceMappingURL=range-with-default.js.map