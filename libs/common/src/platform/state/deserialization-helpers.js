"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = array;
exports.record = record;
/**
 *
 * @param elementDeserializer
 * @returns
 */
function array(elementDeserializer) {
    return (array) => {
        if (array == null) {
            return null;
        }
        return array.map((element) => elementDeserializer(element));
    };
}
/**
 *
 * @param valueDeserializer
 */
function record(valueDeserializer) {
    return (jsonValue) => {
        if (jsonValue == null) {
            return null;
        }
        const output = {};
        Object.entries(jsonValue).forEach(([key, value]) => {
            output[key] = valueDeserializer(value);
        });
        return output;
    };
}
//# sourceMappingURL=deserialization-helpers.js.map