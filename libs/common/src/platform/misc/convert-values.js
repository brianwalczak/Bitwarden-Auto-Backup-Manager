"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertValues = convertValues;
const rxjs_1 = require("rxjs");
/**
 * Converts a record of keys and values into a record preserving the original key and converting each value into an {@link ObservableInput}.
 * @param project A function to project a given key and value pair into an {@link ObservableInput}
 */
function convertValues(project) {
    return (0, rxjs_1.map)((inputRecord) => {
        if (inputRecord == null) {
            return null;
        }
        // Can't use TKey in here, have to use `PropertyKey`
        const result = {};
        for (const [key, value] of Object.entries(inputRecord)) {
            result[key] = project(key, value);
        }
        return result;
    });
}
//# sourceMappingURL=convert-values.js.map