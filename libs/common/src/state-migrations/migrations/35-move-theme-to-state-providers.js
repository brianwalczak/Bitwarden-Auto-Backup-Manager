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
exports.MoveThemeToStateProviderMigrator = void 0;
const migrator_1 = require("../migrator");
const THEME_SELECTION = {
    key: "selection",
    stateDefinition: { name: "theming" },
};
class MoveThemeToStateProviderMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyGlobalState = yield helper.get("global");
            const theme = legacyGlobalState === null || legacyGlobalState === void 0 ? void 0 : legacyGlobalState.theme;
            if (theme != null) {
                yield helper.setToGlobal(THEME_SELECTION, theme);
                delete legacyGlobalState.theme;
                yield helper.set("global", legacyGlobalState);
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const theme = yield helper.getFromGlobal(THEME_SELECTION);
            if (theme != null) {
                const legacyGlobal = (_a = (yield helper.get("global"))) !== null && _a !== void 0 ? _a : {};
                legacyGlobal.theme = theme;
                yield helper.set("global", legacyGlobal);
                yield helper.removeFromGlobal(THEME_SELECTION);
            }
        });
    }
}
exports.MoveThemeToStateProviderMigrator = MoveThemeToStateProviderMigrator;
//# sourceMappingURL=35-move-theme-to-state-providers.js.map