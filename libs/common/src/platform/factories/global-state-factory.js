"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalStateFactory = void 0;
class GlobalStateFactory {
    constructor(globalStateConstructor) {
        this.globalStateConstructor = globalStateConstructor;
    }
    create(args) {
        return new this.globalStateConstructor(args);
    }
}
exports.GlobalStateFactory = GlobalStateFactory;
//# sourceMappingURL=global-state-factory.js.map