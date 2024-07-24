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
exports.TranslationService = void 0;
class TranslationService {
    constructor(systemLanguage, localesDirectory, getLocalesJson) {
        this.systemLanguage = systemLanguage;
        this.localesDirectory = localesDirectory;
        this.getLocalesJson = getLocalesJson;
        // First locale is the default (English)
        this.supportedTranslationLocales = ["en"];
        this.defaultLocale = "en";
        this.localeNames = new Map([
            ["af", "Afrikaans"],
            ["ar", "العربية الفصحى"],
            ["az", "Azərbaycanca"],
            ["be", "Беларуская"],
            ["bg", "български"],
            ["bn", "বাংলা"],
            ["bs", "bosanski jezik"],
            ["ca", "català"],
            ["cs", "čeština"],
            ["cy", "Cymraeg, y Gymraeg"],
            ["da", "dansk"],
            ["de", "Deutsch"],
            ["el", "Ελληνικά"],
            ["en", "English"],
            ["en-GB", "English (British)"],
            ["en-IN", "English (India)"],
            ["eo", "Esperanto"],
            ["es", "español"],
            ["et", "eesti"],
            ["eu", "euskara"],
            ["fa", "فارسی"],
            ["fi", "suomi"],
            ["fil", "Wikang Filipino"],
            ["fr", "français"],
            ["gl", "galego"],
            ["he", "עברית"],
            ["hi", "हिन्दी"],
            ["hr", "hrvatski"],
            ["hu", "magyar"],
            ["id", "Bahasa Indonesia"],
            ["it", "italiano"],
            ["ja", "日本語"],
            ["ka", "ქართული"],
            ["km", "ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ"],
            ["kn", "ಕನ್ನಡ"],
            ["ko", "한국어"],
            ["lt", "lietuvių kalba"],
            ["lv", "Latvietis"],
            ["me", "црногорски"],
            ["ml", "മലയാളം"],
            ["mr", "मराठी"],
            ["my", "ဗမာစကား"],
            ["nb", "norsk (bokmål)"],
            ["ne", "नेपाली"],
            ["nl", "Nederlands"],
            ["nn", "Norsk Nynorsk"],
            ["or", "ଓଡ଼ିଆ"],
            ["pl", "polski"],
            ["pt-BR", "português do Brasil"],
            ["pt-PT", "português"],
            ["ro", "română"],
            ["ru", "русский"],
            ["si", "සිංහල"],
            ["sk", "slovenčina"],
            ["sl", "Slovenski jezik, Slovenščina"],
            ["sr", "Српски"],
            ["sv", "svenska"],
            ["te", "తెలుగు"],
            ["th", "ไทย"],
            ["tr", "Türkçe"],
            ["uk", "українська"],
            ["vi", "Tiếng Việt"],
            ["zh-CN", "中文（中国大陆）"],
            ["zh-TW", "中文（台灣）"],
        ]);
        this.defaultMessages = {};
        this.localeMessages = {};
        this.systemLanguage = systemLanguage.replace("_", "-");
    }
    init(locale) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inited) {
                throw new Error("i18n already initialized.");
            }
            if (this.supportedTranslationLocales == null || this.supportedTranslationLocales.length === 0) {
                throw new Error("supportedTranslationLocales not set.");
            }
            this.inited = true;
            this.translationLocale = locale != null ? locale : this.systemLanguage;
            try {
                this.collator = new Intl.Collator(this.translationLocale, {
                    numeric: true,
                    sensitivity: "base",
                });
            }
            catch (_a) {
                this.collator = null;
            }
            if (this.supportedTranslationLocales.indexOf(this.translationLocale) === -1) {
                this.translationLocale = this.translationLocale.slice(0, 2);
                if (this.supportedTranslationLocales.indexOf(this.translationLocale) === -1) {
                    this.translationLocale = this.defaultLocale;
                }
            }
            if (this.localesDirectory != null) {
                yield this.loadMessages(this.translationLocale, this.localeMessages);
                if (this.translationLocale !== this.defaultLocale) {
                    yield this.loadMessages(this.defaultLocale, this.defaultMessages);
                }
            }
        });
    }
    t(id, p1, p2, p3) {
        return this.translate(id, p1, p2, p3);
    }
    translate(id, p1, p2, p3) {
        let result;
        // eslint-disable-next-line
        if (this.localeMessages.hasOwnProperty(id) && this.localeMessages[id]) {
            result = this.localeMessages[id];
            // eslint-disable-next-line
        }
        else if (this.defaultMessages.hasOwnProperty(id) && this.defaultMessages[id]) {
            result = this.defaultMessages[id];
        }
        else {
            result = "";
        }
        if (result !== "") {
            if (p1 != null) {
                result = result.split("__$1__").join(p1.toString());
            }
            if (p2 != null) {
                result = result.split("__$2__").join(p2.toString());
            }
            if (p3 != null) {
                result = result.split("__$3__").join(p3.toString());
            }
        }
        return result;
    }
    loadMessages(locale, messagesObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedLocale = locale.replace("-", "_");
            const locales = yield this.getLocalesJson(formattedLocale);
            for (const prop in locales) {
                // eslint-disable-next-line
                if (!locales.hasOwnProperty(prop)) {
                    continue;
                }
                messagesObj[prop] = locales[prop].message;
                if (locales[prop].placeholders) {
                    for (const placeProp in locales[prop].placeholders) {
                        if (!locales[prop].placeholders.hasOwnProperty(placeProp) || // eslint-disable-line
                            !locales[prop].placeholders[placeProp].content) {
                            continue;
                        }
                        const replaceToken = "\\$" + placeProp.toUpperCase() + "\\$";
                        let replaceContent = locales[prop].placeholders[placeProp].content;
                        if (replaceContent === "$1" || replaceContent === "$2" || replaceContent === "$3") {
                            replaceContent = "__$" + replaceContent + "__";
                        }
                        messagesObj[prop] = messagesObj[prop].replace(new RegExp(replaceToken, "g"), replaceContent);
                    }
                }
            }
        });
    }
}
exports.TranslationService = TranslationService;
//# sourceMappingURL=translation.service.js.map