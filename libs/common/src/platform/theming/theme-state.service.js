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
exports.DefaultThemeStateService = exports.ThemeStateService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../enums");
const state_1 = require("../state");
class ThemeStateService {
}
exports.ThemeStateService = ThemeStateService;
const THEME_SELECTION = new state_1.KeyDefinition(state_1.THEMING_DISK, "selection", {
    deserializer: (s) => s,
});
class DefaultThemeStateService {
    constructor(globalStateProvider, defaultTheme = enums_1.ThemeType.System) {
        this.globalStateProvider = globalStateProvider;
        this.defaultTheme = defaultTheme;
        this.selectedThemeState = this.globalStateProvider.get(THEME_SELECTION);
        this.selectedTheme$ = this.selectedThemeState.state$.pipe((0, rxjs_1.map)((theme) => theme !== null && theme !== void 0 ? theme : this.defaultTheme));
    }
    setSelectedTheme(theme) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.selectedThemeState.update(() => theme, {
                shouldUpdate: (currentTheme) => currentTheme !== theme,
            });
        });
    }
}
exports.DefaultThemeStateService = DefaultThemeStateService;
//# sourceMappingURL=theme-state.service.js.map