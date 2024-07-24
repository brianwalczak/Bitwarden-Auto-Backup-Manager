"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceCollection = reduceCollection;
exports.distinctIfShallowMatch = distinctIfShallowMatch;
const rxjs_1 = require("rxjs");
/**
 * An observable operator that reduces an emitted collection to a single object,
 * returning a default if all items are ignored.
 * @param reduce The reduce function to apply to the filtered collection. The
 *  first argument is the accumulator, and the second is the current item. The
 *  return value is the new accumulator.
 * @param defaultValue The default value to return if the collection is empty. The
 *   default value is also the initial value of the accumulator.
 */
function reduceCollection(reduce, defaultValue) {
    return (0, rxjs_1.map)((values) => {
        const reduced = (values !== null && values !== void 0 ? values : []).reduce(reduce, structuredClone(defaultValue));
        return reduced;
    });
}
/**
 * An observable operator that emits distinct values by checking that all
 *   values in the previous entry match the next entry. This method emits
 *   when a key is added and does not when a key is removed.
 * @remarks This method checks objects. It does not check items in arrays.
 */
function distinctIfShallowMatch() {
    return (0, rxjs_1.distinctUntilChanged)((previous, current) => {
        let isDistinct = true;
        for (const key in current) {
            isDistinct && (isDistinct = previous[key] === current[key]);
        }
        return isDistinct;
    });
}
//# sourceMappingURL=rx.js.map