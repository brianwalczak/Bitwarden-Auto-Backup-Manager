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
exports.PreferredLanguageMigrator = exports.LOCALE_KEY = void 0;
const migrator_1 = require("../migrator");
exports.LOCALE_KEY = {
    key: "locale",
    stateDefinition: {
        name: "translation",
    },
};
class PreferredLanguageMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // global state
            const global = yield helper.get("global");
            if (!(global === null || global === void 0 ? void 0 : global.locale)) {
                return;
            }
            yield helper.setToGlobal(exports.LOCALE_KEY, global.locale);
            delete global.locale;
            yield helper.set("global", global);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const locale = yield helper.getFromGlobal(exports.LOCALE_KEY);
            if (!locale) {
                return;
            }
            const global = (_a = (yield helper.get("global"))) !== null && _a !== void 0 ? _a : {};
            global.locale = locale;
            yield helper.set("global", global);
            yield helper.setToGlobal(exports.LOCALE_KEY, null);
        });
    }
}
exports.PreferredLanguageMigrator = PreferredLanguageMigrator;
//# sourceMappingURL=32-move-preferred-language.js.map