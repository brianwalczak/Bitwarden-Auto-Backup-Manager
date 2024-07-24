"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagAsExternal = exports.isExternalMessage = exports.EXTERNAL_SOURCE_TAG = exports.getCommand = void 0;
const rxjs_1 = require("rxjs");
const getCommand = (commandDefinition) => {
    if (typeof commandDefinition === "string") {
        return commandDefinition;
    }
    else {
        return commandDefinition.command;
    }
};
exports.getCommand = getCommand;
exports.EXTERNAL_SOURCE_TAG = Symbol("externalSource");
const isExternalMessage = (message) => {
    return (message === null || message === void 0 ? void 0 : message[exports.EXTERNAL_SOURCE_TAG]) === true;
};
exports.isExternalMessage = isExternalMessage;
const tagAsExternal = () => {
    return (0, rxjs_1.map)((message) => {
        return Object.assign(message, { [exports.EXTERNAL_SOURCE_TAG]: true });
    });
};
exports.tagAsExternal = tagAsExternal;
//# sourceMappingURL=helpers.js.map