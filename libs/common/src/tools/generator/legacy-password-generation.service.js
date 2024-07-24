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
exports.LegacyPasswordGenerationService = void 0;
exports.legacyPasswordGenerationServiceFactory = legacyPasswordGenerationServiceFactory;
const rxjs_1 = require("rxjs");
const password_generator_policy_options_1 = require("../../admin-console/models/domain/password-generator-policy-options");
const default_generator_service_1 = require("./default-generator.service");
const local_generator_history_service_1 = require("./history/local-generator-history.service");
const default_generator_navigation_service_1 = require("./navigation/default-generator-navigation.service");
const passphrase_1 = require("./passphrase");
const password_1 = require("./password");
const random_1 = require("./random");
function legacyPasswordGenerationServiceFactory(encryptService, cryptoService, policyService, accountService, stateProvider) {
    const randomizer = new random_1.CryptoServiceRandomizer(cryptoService);
    const passwords = new default_generator_service_1.DefaultGeneratorService(new password_1.PasswordGeneratorStrategy(randomizer, stateProvider), policyService);
    const passphrases = new default_generator_service_1.DefaultGeneratorService(new passphrase_1.PassphraseGeneratorStrategy(randomizer, stateProvider), policyService);
    const navigation = new default_generator_navigation_service_1.DefaultGeneratorNavigationService(stateProvider, policyService);
    const history = new local_generator_history_service_1.LocalGeneratorHistoryService(encryptService, cryptoService, stateProvider);
    return new LegacyPasswordGenerationService(accountService, navigation, passwords, passphrases, history);
}
/** Adapts the generator 2.0 design to 1.0 angular services. */
class LegacyPasswordGenerationService {
    constructor(accountService, navigation, passwords, passphrases, history) {
        this.accountService = accountService;
        this.navigation = navigation;
        this.passwords = passwords;
        this.passphrases = passphrases;
        this.history = history;
    }
    generatePassword(options) {
        if (options.type === "password") {
            return this.passwords.generate(options);
        }
        else {
            return this.passphrases.generate(options);
        }
    }
    generatePassphrase(options) {
        return this.passphrases.generate(options);
    }
    getRawOptions$() {
        function withSequenceNumber(observable$) {
            return observable$.pipe((0, rxjs_1.map)((evaluator, i) => [evaluator, i]));
        }
        // initial array ensures that destructuring never fails; sequence numbers
        // set to `-1` so that the first update reflects that the policy changed from
        // "unknown" to "whatever was provided by the service". This needs to be called
        // each time the active user changes or the `concat` will block.
        function initial$() {
            const initial = [
                null,
                null,
                [null, -1],
                null,
                null,
                [null, -1],
                null,
                null,
                [null, -1],
            ];
            return (0, rxjs_1.of)(initial);
        }
        function intermediatePairsToRawOptions([previous, current]) {
            const [, , [, passwordPrevious], , , [, passphrasePrevious], , , [, generatorPrevious]] = previous;
            const [passwordOptions, passwordDefaults, [passwordEvaluator, passwordCurrent], passphraseOptions, passphraseDefaults, [passphraseEvaluator, passphraseCurrent], generatorOptions, generatorDefaults, [generatorEvaluator, generatorCurrent],] = current;
            // when any of the sequence numbers change, the emission occurs as the result of
            // a policy update
            const policyEmitted = passwordPrevious < passwordCurrent ||
                passphrasePrevious < passphraseCurrent ||
                generatorPrevious < generatorCurrent;
            const result = [
                passwordOptions,
                passwordDefaults,
                passwordEvaluator,
                passphraseOptions,
                passphraseDefaults,
                passphraseEvaluator,
                generatorOptions,
                generatorDefaults,
                generatorEvaluator,
                policyEmitted,
            ];
            return result;
        }
        // look upon my works, ye mighty, and despair!
        const rawOptions$ = this.accountService.activeAccount$.pipe((0, rxjs_1.concatMap)((activeUser) => (0, rxjs_1.concat)(initial$(), (0, rxjs_1.combineLatest)([
            this.passwords.options$(activeUser.id),
            this.passwords.defaults$(activeUser.id),
            withSequenceNumber(this.passwords.evaluator$(activeUser.id)),
            this.passphrases.options$(activeUser.id),
            this.passphrases.defaults$(activeUser.id),
            withSequenceNumber(this.passphrases.evaluator$(activeUser.id)),
            this.navigation.options$(activeUser.id),
            this.navigation.defaults$(activeUser.id),
            withSequenceNumber(this.navigation.evaluator$(activeUser.id)),
        ]))), (0, rxjs_1.pairwise)(), (0, rxjs_1.map)(intermediatePairsToRawOptions));
        return rawOptions$;
    }
    getOptions$() {
        const options$ = this.getRawOptions$().pipe((0, rxjs_1.map)(([passwordOptions, passwordDefaults, passwordEvaluator, passphraseOptions, passphraseDefaults, passphraseEvaluator, generatorOptions, generatorDefaults, generatorEvaluator, policyUpdated,]) => {
            const passwordOptionsWithPolicy = passwordEvaluator.applyPolicy(passwordOptions !== null && passwordOptions !== void 0 ? passwordOptions : passwordDefaults);
            const passphraseOptionsWithPolicy = passphraseEvaluator.applyPolicy(passphraseOptions !== null && passphraseOptions !== void 0 ? passphraseOptions : passphraseDefaults);
            const generatorOptionsWithPolicy = generatorEvaluator.applyPolicy(generatorOptions !== null && generatorOptions !== void 0 ? generatorOptions : generatorDefaults);
            const options = this.toPasswordGeneratorOptions({
                password: passwordEvaluator.sanitize(passwordOptionsWithPolicy),
                passphrase: passphraseEvaluator.sanitize(passphraseOptionsWithPolicy),
                generator: generatorEvaluator.sanitize(generatorOptionsWithPolicy),
                policyUpdated,
            });
            const policy = Object.assign(new password_generator_policy_options_1.PasswordGeneratorPolicyOptions(), passwordEvaluator.policy, passphraseEvaluator.policy, generatorEvaluator.policy);
            return [options, policy];
        }));
        return options$;
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.getOptions$());
        });
    }
    enforcePasswordGeneratorPoliciesOnOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const options$ = this.accountService.activeAccount$.pipe((0, rxjs_1.concatMap)((activeUser) => (0, rxjs_1.zip)(this.passwords.evaluator$(activeUser.id), this.passphrases.evaluator$(activeUser.id), this.navigation.evaluator$(activeUser.id))), (0, rxjs_1.map)(([passwordEvaluator, passphraseEvaluator, navigationEvaluator]) => {
                const policy = Object.assign(new password_generator_policy_options_1.PasswordGeneratorPolicyOptions(), passwordEvaluator.policy, passphraseEvaluator.policy, navigationEvaluator.policy);
                const navigationApplied = navigationEvaluator.applyPolicy(options);
                const navigationSanitized = Object.assign(Object.assign({}, options), navigationEvaluator.sanitize(navigationApplied));
                if (options.type === "password") {
                    const applied = passwordEvaluator.applyPolicy(navigationSanitized);
                    const sanitized = passwordEvaluator.sanitize(applied);
                    return [sanitized, policy];
                }
                else {
                    const applied = passphraseEvaluator.applyPolicy(navigationSanitized);
                    const sanitized = passphraseEvaluator.sanitize(applied);
                    return [sanitized, policy];
                }
            }));
            const [sanitized, policy] = yield (0, rxjs_1.firstValueFrom)(options$);
            return [
                // callers assume this function updates the options parameter
                Object.assign(options, sanitized),
                policy,
            ];
        });
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
            yield this.passwords.saveOptions(activeAccount.id, stored.password);
            yield this.passphrases.saveOptions(activeAccount.id, stored.passphrase);
        });
    }
    toStoredOptions(options) {
        return {
            generator: {
                type: options.type,
            },
            password: {
                length: options.length,
                minLength: options.minLength,
                ambiguous: options.ambiguous,
                uppercase: options.uppercase,
                minUppercase: options.minUppercase,
                lowercase: options.lowercase,
                minLowercase: options.minLowercase,
                number: options.number,
                minNumber: options.minNumber,
                special: options.special,
                minSpecial: options.minSpecial,
            },
            passphrase: {
                numWords: options.numWords,
                wordSeparator: options.wordSeparator,
                capitalize: options.capitalize,
                includeNumber: options.includeNumber,
            },
            policyUpdated: false,
        };
    }
    toPasswordGeneratorOptions(options) {
        return {
            type: options.generator.type,
            length: options.password.length,
            minLength: options.password.minLength,
            ambiguous: options.password.ambiguous,
            uppercase: options.password.uppercase,
            minUppercase: options.password.minUppercase,
            lowercase: options.password.lowercase,
            minLowercase: options.password.minLowercase,
            number: options.password.number,
            minNumber: options.password.minNumber,
            special: options.password.special,
            minSpecial: options.password.minSpecial,
            numWords: options.passphrase.numWords,
            wordSeparator: options.passphrase.wordSeparator,
            capitalize: options.passphrase.capitalize,
            includeNumber: options.passphrase.includeNumber,
            policyUpdated: options.policyUpdated,
        };
    }
    getHistory() {
        const history = this.accountService.activeAccount$.pipe((0, rxjs_1.concatMap)((account) => this.history.credentials$(account.id)), (0, rxjs_1.timeout)({
            // timeout after 1 second
            each: 1000,
            with() {
                return [];
            },
        }), (0, rxjs_1.map)((history) => history.map(toGeneratedPasswordHistory)));
        return (0, rxjs_1.firstValueFrom)(history);
    }
    addHistory(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$);
            if (account === null || account === void 0 ? void 0 : account.id) {
                // legacy service doesn't distinguish credential types
                yield this.history.track(account.id, password, "password");
            }
        });
    }
    clear() {
        const history$ = this.accountService.activeAccount$.pipe((0, rxjs_1.filter)((account) => !!(account === null || account === void 0 ? void 0 : account.id)), (0, rxjs_1.concatMap)((account) => this.history.clear(account.id)), (0, rxjs_1.timeout)({
            // timeout after 1 second
            each: 1000,
            with() {
                return [];
            },
        }), (0, rxjs_1.map)((history) => history.map(toGeneratedPasswordHistory)));
        return (0, rxjs_1.firstValueFrom)(history$);
    }
}
exports.LegacyPasswordGenerationService = LegacyPasswordGenerationService;
function toGeneratedPasswordHistory(value) {
    return new password_1.GeneratedPasswordHistory(value.credential, value.generationDate.valueOf());
}
//# sourceMappingURL=legacy-password-generation.service.js.map