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
exports.PasswordOptionsMigrator = exports.PASSPHRASE = exports.PASSWORD = exports.NAVIGATION = void 0;
const migrator_1 = require("../migrator");
exports.NAVIGATION = {
    stateDefinition: {
        name: "generator",
    },
    key: "generatorSettings",
};
exports.PASSWORD = {
    stateDefinition: {
        name: "generator",
    },
    key: "passwordGeneratorSettings",
};
exports.PASSPHRASE = {
    stateDefinition: {
        name: "generator",
    },
    key: "passphraseGeneratorSettings",
};
class PasswordOptionsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const legacyOptions = (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.passwordGenerationOptions;
                    if (legacyOptions) {
                        const converted = convertSettings(legacyOptions);
                        yield storeSettings(helper, userId, converted);
                        yield deleteSettings(helper, userId, account);
                    }
                });
            }
            yield Promise.all([...accounts.map(({ userId, account }) => migrateAccount(userId, account))]);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // not supported
        });
    }
}
exports.PasswordOptionsMigrator = PasswordOptionsMigrator;
function convertSettings(options) {
    const password = {
        length: options.length,
        ambiguous: options.ambiguous,
        uppercase: options.uppercase,
        minUppercase: options.minUppercase,
        lowercase: options.lowercase,
        minLowercase: options.minLowercase,
        number: options.number,
        minNumber: options.minNumber,
        special: options.special,
        minSpecial: options.minSpecial,
    };
    const generator = {
        type: options.type,
    };
    const passphrase = {
        numWords: options.numWords,
        wordSeparator: options.wordSeparator,
        capitalize: options.capitalize,
        includeNumber: options.includeNumber,
    };
    return { generator, password, passphrase };
}
function storeSettings(helper, userId, converted) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const existing = (_a = (yield helper.getFromUser(userId, exports.NAVIGATION))) !== null && _a !== void 0 ? _a : {};
        const updated = Object.assign(existing, converted.generator);
        yield Promise.all([
            helper.setToUser(userId, exports.NAVIGATION, updated),
            helper.setToUser(userId, exports.PASSPHRASE, converted.passphrase),
            helper.setToUser(userId, exports.PASSWORD, converted.password),
        ]);
    });
}
function deleteSettings(helper, userId, account) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? true : delete _a.passwordGenerationOptions;
        yield helper.set(userId, account);
    });
}
//# sourceMappingURL=63-migrate-password-settings.js.map