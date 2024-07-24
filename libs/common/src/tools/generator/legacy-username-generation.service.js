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
exports.LegacyUsernameGenerationService = void 0;
exports.legacyUsernameGenerationServiceFactory = legacyUsernameGenerationServiceFactory;
const rxjs_1 = require("rxjs");
const default_generator_service_1 = require("./default-generator.service");
const default_generator_navigation_service_1 = require("./navigation/default-generator-navigation.service");
const random_1 = require("./random");
const username_1 = require("./username");
const addy_io_1 = require("./username/forwarders/addy-io");
const duck_duck_go_1 = require("./username/forwarders/duck-duck-go");
const fastmail_1 = require("./username/forwarders/fastmail");
const firefox_relay_1 = require("./username/forwarders/firefox-relay");
const forward_email_1 = require("./username/forwarders/forward-email");
const simple_login_1 = require("./username/forwarders/simple-login");
const constants_1 = require("./username/options/constants");
function legacyUsernameGenerationServiceFactory(apiService, i18nService, cryptoService, encryptService, policyService, accountService, stateProvider) {
    const randomizer = new random_1.CryptoServiceRandomizer(cryptoService);
    const effUsername = new default_generator_service_1.DefaultGeneratorService(new username_1.EffUsernameGeneratorStrategy(randomizer, stateProvider), policyService);
    const subaddress = new default_generator_service_1.DefaultGeneratorService(new username_1.SubaddressGeneratorStrategy(randomizer, stateProvider), policyService);
    const catchall = new default_generator_service_1.DefaultGeneratorService(new username_1.CatchallGeneratorStrategy(randomizer, stateProvider), policyService);
    const addyIo = new default_generator_service_1.DefaultGeneratorService(new addy_io_1.AddyIoForwarder(apiService, i18nService, encryptService, cryptoService, stateProvider), policyService);
    const duckDuckGo = new default_generator_service_1.DefaultGeneratorService(new duck_duck_go_1.DuckDuckGoForwarder(apiService, i18nService, encryptService, cryptoService, stateProvider), policyService);
    const fastmail = new default_generator_service_1.DefaultGeneratorService(new fastmail_1.FastmailForwarder(apiService, i18nService, encryptService, cryptoService, stateProvider), policyService);
    const firefoxRelay = new default_generator_service_1.DefaultGeneratorService(new firefox_relay_1.FirefoxRelayForwarder(apiService, i18nService, encryptService, cryptoService, stateProvider), policyService);
    const forwardEmail = new default_generator_service_1.DefaultGeneratorService(new forward_email_1.ForwardEmailForwarder(apiService, i18nService, encryptService, cryptoService, stateProvider), policyService);
    const simpleLogin = new default_generator_service_1.DefaultGeneratorService(new simple_login_1.SimpleLoginForwarder(apiService, i18nService, encryptService, cryptoService, stateProvider), policyService);
    const navigation = new default_generator_navigation_service_1.DefaultGeneratorNavigationService(stateProvider, policyService);
    return new LegacyUsernameGenerationService(accountService, navigation, catchall, effUsername, subaddress, addyIo, duckDuckGo, fastmail, firefoxRelay, forwardEmail, simpleLogin);
}
/** Adapts the generator 2.0 design to 1.0 angular services. */
class LegacyUsernameGenerationService {
    constructor(accountService, navigation, catchall, effUsername, subaddress, addyIo, duckDuckGo, fastmail, firefoxRelay, forwardEmail, simpleLogin) {
        this.accountService = accountService;
        this.navigation = navigation;
        this.catchall = catchall;
        this.effUsername = effUsername;
        this.subaddress = subaddress;
        this.addyIo = addyIo;
        this.duckDuckGo = duckDuckGo;
        this.fastmail = fastmail;
        this.firefoxRelay = firefoxRelay;
        this.forwardEmail = forwardEmail;
        this.simpleLogin = simpleLogin;
    }
    generateUsername(options) {
        if (options.type === "catchall") {
            return this.generateCatchall(options);
        }
        else if (options.type === "subaddress") {
            return this.generateSubaddress(options);
        }
        else if (options.type === "forwarded") {
            return this.generateForwarded(options);
        }
        else {
            return this.generateWord(options);
        }
    }
    generateWord(options) {
        return this.effUsername.generate(options);
    }
    generateSubaddress(options) {
        return this.subaddress.generate(options);
    }
    generateCatchall(options) {
        return this.catchall.generate(options);
    }
    generateForwarded(options) {
        if (!options.forwardedService) {
            return null;
        }
        const stored = this.toStoredOptions(options);
        switch (options.forwardedService) {
            case constants_1.Forwarders.AddyIo.id:
                return this.addyIo.generate(stored.forwarders.addyIo);
            case constants_1.Forwarders.DuckDuckGo.id:
                return this.duckDuckGo.generate(stored.forwarders.duckDuckGo);
            case constants_1.Forwarders.Fastmail.id:
                return this.fastmail.generate(stored.forwarders.fastmail);
            case constants_1.Forwarders.FirefoxRelay.id:
                return this.firefoxRelay.generate(stored.forwarders.firefoxRelay);
            case constants_1.Forwarders.ForwardEmail.id:
                return this.forwardEmail.generate(stored.forwarders.forwardEmail);
            case constants_1.Forwarders.SimpleLogin.id:
                return this.simpleLogin.generate(stored.forwarders.simpleLogin);
        }
    }
    getOptions$() {
        // look upon my works, ye mighty, and despair!
        const options$ = this.accountService.activeAccount$.pipe((0, rxjs_1.concatMap)((account) => (0, rxjs_1.combineLatest)([
            this.navigation.options$(account.id),
            this.navigation.defaults$(account.id),
            this.catchall.options$(account.id),
            this.catchall.defaults$(account.id),
            this.effUsername.options$(account.id),
            this.effUsername.defaults$(account.id),
            this.subaddress.options$(account.id),
            this.subaddress.defaults$(account.id),
            this.addyIo.options$(account.id),
            this.addyIo.defaults$(account.id),
            this.duckDuckGo.options$(account.id),
            this.duckDuckGo.defaults$(account.id),
            this.fastmail.options$(account.id),
            this.fastmail.defaults$(account.id),
            this.firefoxRelay.options$(account.id),
            this.firefoxRelay.defaults$(account.id),
            this.forwardEmail.options$(account.id),
            this.forwardEmail.defaults$(account.id),
            this.simpleLogin.options$(account.id),
            this.simpleLogin.defaults$(account.id),
        ])), (0, rxjs_1.map)(([generatorOptions, generatorDefaults, catchallOptions, catchallDefaults, effUsernameOptions, effUsernameDefaults, subaddressOptions, subaddressDefaults, addyIoOptions, addyIoDefaults, duckDuckGoOptions, duckDuckGoDefaults, fastmailOptions, fastmailDefaults, firefoxRelayOptions, firefoxRelayDefaults, forwardEmailOptions, forwardEmailDefaults, simpleLoginOptions, simpleLoginDefaults,]) => this.toUsernameOptions({
            generator: generatorOptions !== null && generatorOptions !== void 0 ? generatorOptions : generatorDefaults,
            algorithms: {
                catchall: catchallOptions !== null && catchallOptions !== void 0 ? catchallOptions : catchallDefaults,
                effUsername: effUsernameOptions !== null && effUsernameOptions !== void 0 ? effUsernameOptions : effUsernameDefaults,
                subaddress: subaddressOptions !== null && subaddressOptions !== void 0 ? subaddressOptions : subaddressDefaults,
            },
            forwarders: {
                addyIo: addyIoOptions !== null && addyIoOptions !== void 0 ? addyIoOptions : addyIoDefaults,
                duckDuckGo: duckDuckGoOptions !== null && duckDuckGoOptions !== void 0 ? duckDuckGoOptions : duckDuckGoDefaults,
                fastmail: fastmailOptions !== null && fastmailOptions !== void 0 ? fastmailOptions : fastmailDefaults,
                firefoxRelay: firefoxRelayOptions !== null && firefoxRelayOptions !== void 0 ? firefoxRelayOptions : firefoxRelayDefaults,
                forwardEmail: forwardEmailOptions !== null && forwardEmailOptions !== void 0 ? forwardEmailOptions : forwardEmailDefaults,
                simpleLogin: simpleLoginOptions !== null && simpleLoginOptions !== void 0 ? simpleLoginOptions : simpleLoginDefaults,
            },
        })));
        return options$;
    }
    getOptions() {
        return (0, rxjs_1.firstValueFrom)(this.getOptions$());
    }
    saveOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const stored = this.toStoredOptions(options);
            const activeAccount = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$);
            // generator settings needs to preserve whether password or passphrase is selected,
            // so `navigationOptions` is mutated.
            const navigationOptions$ = (0, rxjs_1.zip)(this.navigation.options$(activeAccount.id), this.navigation.defaults$(activeAccount.id)).pipe((0, rxjs_1.map)(([options, defaults]) => options !== null && options !== void 0 ? options : defaults));
            let navigationOptions = yield (0, rxjs_1.firstValueFrom)(navigationOptions$);
            navigationOptions = Object.assign(navigationOptions, stored.generator);
            yield this.navigation.saveOptions(activeAccount.id, navigationOptions);
            // overwrite all other settings with latest values
            yield Promise.all([
                this.catchall.saveOptions(activeAccount.id, stored.algorithms.catchall),
                this.effUsername.saveOptions(activeAccount.id, stored.algorithms.effUsername),
                this.subaddress.saveOptions(activeAccount.id, stored.algorithms.subaddress),
                this.addyIo.saveOptions(activeAccount.id, stored.forwarders.addyIo),
                this.duckDuckGo.saveOptions(activeAccount.id, stored.forwarders.duckDuckGo),
                this.fastmail.saveOptions(activeAccount.id, stored.forwarders.fastmail),
                this.firefoxRelay.saveOptions(activeAccount.id, stored.forwarders.firefoxRelay),
                this.forwardEmail.saveOptions(activeAccount.id, stored.forwarders.forwardEmail),
                this.simpleLogin.saveOptions(activeAccount.id, stored.forwarders.simpleLogin),
            ]);
        });
    }
    toStoredOptions(options) {
        const forwarders = {
            addyIo: {
                baseUrl: options.forwardedAnonAddyBaseUrl,
                token: options.forwardedAnonAddyApiToken,
                domain: options.forwardedAnonAddyDomain,
                website: options.website,
            },
            duckDuckGo: {
                token: options.forwardedDuckDuckGoToken,
                website: options.website,
            },
            fastmail: {
                token: options.forwardedFastmailApiToken,
                website: options.website,
            },
            firefoxRelay: {
                token: options.forwardedFirefoxApiToken,
                website: options.website,
            },
            forwardEmail: {
                token: options.forwardedForwardEmailApiToken,
                domain: options.forwardedForwardEmailDomain,
                website: options.website,
            },
            simpleLogin: {
                token: options.forwardedSimpleLoginApiKey,
                baseUrl: options.forwardedSimpleLoginBaseUrl,
                website: options.website,
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
                website: options.website,
            },
            subaddress: {
                subaddressType: options.subaddressType,
                subaddressEmail: options.subaddressEmail,
                website: options.website,
            },
            catchall: {
                catchallType: options.catchallType,
                catchallDomain: options.catchallDomain,
                website: options.website,
            },
        };
        return { generator, algorithms, forwarders };
    }
    toUsernameOptions(options) {
        return {
            type: options.generator.username,
            wordCapitalize: options.algorithms.effUsername.wordCapitalize,
            wordIncludeNumber: options.algorithms.effUsername.wordIncludeNumber,
            subaddressType: options.algorithms.subaddress.subaddressType,
            subaddressEmail: options.algorithms.subaddress.subaddressEmail,
            catchallType: options.algorithms.catchall.catchallType,
            catchallDomain: options.algorithms.catchall.catchallDomain,
            forwardedService: options.generator.forwarder,
            forwardedAnonAddyApiToken: options.forwarders.addyIo.token,
            forwardedAnonAddyDomain: options.forwarders.addyIo.domain,
            forwardedAnonAddyBaseUrl: options.forwarders.addyIo.baseUrl,
            forwardedDuckDuckGoToken: options.forwarders.duckDuckGo.token,
            forwardedFirefoxApiToken: options.forwarders.firefoxRelay.token,
            forwardedFastmailApiToken: options.forwarders.fastmail.token,
            forwardedForwardEmailApiToken: options.forwarders.forwardEmail.token,
            forwardedForwardEmailDomain: options.forwarders.forwardEmail.domain,
            forwardedSimpleLoginApiKey: options.forwarders.simpleLogin.token,
            forwardedSimpleLoginBaseUrl: options.forwarders.simpleLogin.baseUrl,
        };
    }
}
exports.LegacyUsernameGenerationService = LegacyUsernameGenerationService;
//# sourceMappingURL=legacy-username-generation.service.js.map