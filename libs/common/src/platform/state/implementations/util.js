"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoredValue = getStoredValue;
function getStoredValue(key, storage, deserializer) {
    return __awaiter(this, void 0, void 0, function* () {
        if (storage.valuesRequireDeserialization) {
            const jsonValue = yield storage.get(key);
            const value = deserializer(jsonValue);
            return value;
        }
        else {
            const value = yield storage.get(key);
            return value !== null && value !== void 0 ? value : null;
        }
    });
}
//# sourceMappingURL=util.js.map