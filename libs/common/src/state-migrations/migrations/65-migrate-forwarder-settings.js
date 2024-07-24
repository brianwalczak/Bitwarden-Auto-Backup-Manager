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
exports.ForwarderOptionsMigrator = exports.SIMPLE_LOGIN = exports.FORWARD_EMAIL = exports.FIREFOX_RELAY = exports.FASTMAIL = exports.DUCK_DUCK_GO = exports.ADDY_IO = exports.SUBADDRESS = exports.EFF_USERNAME = exports.CATCHALL = exports.NAVIGATION = void 0;
const migrator_1 = require("../migrator");
exports.NAVIGATION = {
    stateDefinition: {
        name: "generator",
    },
    key: "generatorSettings",
};
exports.CATCHALL = {
    stateDefinition: {
        name: "generator",
    },
    key: "catchallGeneratorSettings",
};
exports.EFF_USERNAME = {
    stateDefinition: {
        name: "generator",
    },
    key: "effUsernameGeneratorSettings",
};
exports.SUBADDRESS = {
    stateDefinition: {
        name: "generator",
    },
    key: "subaddressGeneratorSettings",
};
exports.ADDY_IO = {
    stateDefinition: {
        name: "generator",
    },
    key: "addyIoBuffer",
};
exports.DUCK_DUCK_GO = {
    stateDefinition: {
        name: "generator",
    },
    key: "duckDuckGoBuffer",
};
exports.FASTMAIL = {
    stateDefinition: {
        name: "generator",
    },
    key: "fastmailBuffer",
};
exports.FIREFOX_RELAY = {
    stateDefinition: {
        name: "generator",
    },
    key: "firefoxRelayBuffer",
};
exports.FORWARD_EMAIL = {
    stateDefinition: {
        name: "generator",
    },
    key: "forwardEmailBuffer",
};
exports.SIMPLE_LOGIN = {
    stateDefinition: {
        name: "generator",
    },
    key: "simpleLoginBuffer",
};
class ForwarderOptionsMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield helper.getAccounts();
            function migrateAccount(userId, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const legacyOptions = (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? void 0 : _a.usernameGenerationOptions;
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
exports.ForwarderOptionsMigrator = ForwarderOptionsMigrator;
function convertSettings(options) {
    const forwarders = {
        addyIo: {
            baseUrl: options.forwardedAnonAddyBaseUrl,
            token: options.forwardedAnonAddyApiToken,
            domain: options.forwardedAnonAddyDomain,
        },
        duckDuckGo: {
            token: options.forwardedDuckDuckGoToken,
        },
        fastmail: {
            token: options.forwardedFastmailApiToken,
        },
        firefoxRelay: {
            token: options.forwardedFirefoxApiToken,
        },
        forwardEmail: {
            token: options.forwardedForwardEmailApiToken,
            domain: options.forwardedForwardEmailDomain,
        },
        simpleLogin: {
            token: options.forwardedSimpleLoginApiKey,
            baseUrl: options.forwardedSimpleLoginBaseUrl,
        },
    };
    const generator = {
        username: options.type,
        forwarder: options.forwardedService,
    };
    const algorithms = {
        effUsername: {
            wordCapitalize: options.wordCapitalize,
            wordIncludeNumber: options.wordIncludeNumber,
        },
        subaddress: {
            subaddressType: options.subaddressType,
            subaddressEmail: options.subaddressEmail,
        },
        catchall: {
            catchallType: options.catchallType,
            catchallDomain: options.catchallDomain,
        },
    };
    return { generator, algorithms, forwarders };
}
function storeSettings(helper, userId, converted) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            helper.setToUser(userId, exports.NAVIGATION, converted.generator),
            helper.setToUser(userId, exports.CATCHALL, converted.algorithms.catchall),
            helper.setToUser(userId, exports.EFF_USERNAME, converted.algorithms.effUsername),
            helper.setToUser(userId, exports.SUBADDRESS, converted.algorithms.subaddress),
            helper.setToUser(userId, exports.ADDY_IO, converted.forwarders.addyIo),
            helper.setToUser(userId, exports.DUCK_DUCK_GO, converted.forwarders.duckDuckGo),
            helper.setToUser(userId, exports.FASTMAIL, converted.forwarders.fastmail),
            helper.setToUser(userId, exports.FIREFOX_RELAY, converted.forwarders.firefoxRelay),
            helper.setToUser(userId, exports.FORWARD_EMAIL, converted.forwarders.forwardEmail),
            helper.setToUser(userId, exports.SIMPLE_LOGIN, converted.forwarders.simpleLogin),
        ]);
    });
}
function deleteSettings(helper, userId, account) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        (_a = account === null || account === void 0 ? void 0 : account.settings) === null || _a === void 0 ? true : delete _a.usernameGenerationOptions;
        yield helper.set(userId, account);
    });
}
//# sourceMappingURL=65-migrate-forwarder-settings.js.map