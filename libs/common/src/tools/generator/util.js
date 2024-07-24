"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone$PerUserId = clone$PerUserId;
exports.sharedByUserId = sharedByUserId;
exports.sharedStateByUserId = sharedStateByUserId;
const rxjs_1 = require("rxjs");
/** construct a method that outputs a copy of `defaultValue` as an observable. */
function clone$PerUserId(defaultValue) {
    const _subjects = new Map();
    return (key) => {
        let value = _subjects.get(key);
        if (value === undefined) {
            value = new rxjs_1.BehaviorSubject(Object.assign({}, defaultValue));
            _subjects.set(key, value);
        }
        return value.asObservable();
    };
}
/** construct a method that caches user-specific states by userid. */
function sharedByUserId(create) {
    const _subjects = new Map();
    return (key) => {
        let value = _subjects.get(key);
        if (value === undefined) {
            value = create(key);
            _subjects.set(key, value);
        }
        return value;
    };
}
/** construct a method that loads a user-specific state from the provider. */
function sharedStateByUserId(key, provider) {
    return (id) => provider.getUser(id, key);
}
//# sourceMappingURL=util.js.map