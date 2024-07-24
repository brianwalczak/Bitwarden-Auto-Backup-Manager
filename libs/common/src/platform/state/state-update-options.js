"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
exports.populateOptionsWithDefault = populateOptionsWithDefault;
exports.DEFAULT_OPTIONS = {
    shouldUpdate: () => true,
    combineLatestWith: null,
    msTimeout: 1000,
};
function populateOptionsWithDefault(options) {
    return Object.assign(Object.assign({}, exports.DEFAULT_OPTIONS), options);
}
//# sourceMappingURL=state-update-options.js.map