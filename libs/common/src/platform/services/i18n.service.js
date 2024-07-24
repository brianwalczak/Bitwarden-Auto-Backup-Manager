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
exports.I18nService = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../state");
const translation_service_1 = require("./translation.service");
const LOCALE_KEY = new state_1.KeyDefinition(state_1.TRANSLATION_DISK, "locale", {
    deserializer: (value) => value,
});
class I18nService extends translation_service_1.TranslationService {
    constructor(systemLanguage, localesDirectory, getLocalesJson, globalStateProvider) {
        super(systemLanguage, localesDirectory, getLocalesJson);
        this.systemLanguage = systemLanguage;
        this.localesDirectory = localesDirectory;
        this.getLocalesJson = getLocalesJson;
        this.translationLocaleState = globalStateProvider.get(LOCALE_KEY);
        this.userSetLocale$ = this.translationLocaleState.state$;
        this.locale$ = this.userSetLocale$.pipe((0, rxjs_1.map)((locale) => locale !== null && locale !== void 0 ? locale : this.translationLocale));
    }
    setLocale(locale) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.translationLocaleState.update(() => locale);
        });
    }
    init() {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const storedLocale = yield (0, rxjs_1.firstValueFrom)(this.translationLocaleState.state$);
            yield _super.init.call(this, storedLocale);
        });
    }
}
exports.I18nService = I18nService;
//# sourceMappingURL=i18n.service.js.map