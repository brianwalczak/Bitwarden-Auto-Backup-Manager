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
exports.CryptoServiceRandomizer = void 0;
/** A randomizer backed by a CryptoService. */
class CryptoServiceRandomizer {
    constructor(crypto) {
        this.crypto = crypto;
    }
    pick(list) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = yield this.uniform(0, list.length - 1);
            return list[index];
        });
    }
    pickWord(list, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let word = yield this.pick(list);
            if ((_a = options === null || options === void 0 ? void 0 : options.titleCase) !== null && _a !== void 0 ? _a : false) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            if ((_b = options === null || options === void 0 ? void 0 : options.number) !== null && _b !== void 0 ? _b : false) {
                const num = yield this.crypto.randomNumber(1, 9);
                word = word + num.toString();
            }
            return word;
        });
    }
    // ref: https://stackoverflow.com/a/12646864/1090359
    shuffle(items, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const shuffled = ((_a = options === null || options === void 0 ? void 0 : options.copy) !== null && _a !== void 0 ? _a : true) ? [...items] : items;
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = yield this.uniform(0, i);
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        });
    }
    chars(length) {
        return __awaiter(this, void 0, void 0, function* () {
            let str = "";
            const charSet = "abcdefghijklmnopqrstuvwxyz1234567890";
            for (let i = 0; i < length; i++) {
                const randomCharIndex = yield this.uniform(0, charSet.length - 1);
                str += charSet.charAt(randomCharIndex);
            }
            return str;
        });
    }
    uniform(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.crypto.randomNumber(min, max);
        });
    }
    // ref: https://stackoverflow.com/a/10073788
    zeroPad(number, width) {
        return number.length >= width
            ? number
            : new Array(width - number.length + 1).join("0") + number;
    }
}
exports.CryptoServiceRandomizer = CryptoServiceRandomizer;
//# sourceMappingURL=random.js.map