"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lazy = void 0;
class Lazy {
    constructor(factory) {
        this.factory = factory;
        this._value = undefined;
        this._isCreated = false;
    }
    /**
     * Resolves the factory and returns the result. Guaranteed to resolve the value only once.
     *
     * @returns The value produced by your factory.
     */
    get() {
        if (!this._isCreated) {
            this._value = this.factory();
            this._isCreated = true;
        }
        return this._value;
    }
}
exports.Lazy = Lazy;
//# sourceMappingURL=lazy.js.map