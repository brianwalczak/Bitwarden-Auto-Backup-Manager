"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGlobalState = void 0;
const key_definition_1 = require("../key-definition");
const state_base_1 = require("./state-base");
class DefaultGlobalState extends state_base_1.StateBase {
    constructor(keyDefinition, chosenLocation) {
        super((0, key_definition_1.globalKeyBuilder)(keyDefinition), chosenLocation, keyDefinition);
    }
}
exports.DefaultGlobalState = DefaultGlobalState;
//# sourceMappingURL=default-global-state.js.map