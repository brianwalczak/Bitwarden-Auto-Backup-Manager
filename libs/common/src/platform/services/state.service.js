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
exports.StateService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../enums");
const account_1 = require("../models/domain/account");
const state_1 = require("../models/domain/state");
const keys = {
    state: "state",
    stateVersion: "stateVersion",
    global: "global",
    tempAccountSettings: "tempAccountSettings", // used to hold account specific settings (i.e clear clipboard) between initial migration and first account authentication
};
const partialKeys = {
    userAutoKey: "_user_auto",
    userBiometricKey: "_user_biometric",
    autoKey: "_masterkey_auto",
    masterKey: "_masterkey",
};
const DDG_SHARED_KEY = "DuckDuckGoSharedKey";
class StateService {
    constructor(storageService, secureStorageService, memoryStorageService, logService, stateFactory, accountService, environmentService, tokenService, migrationRunner) {
        this.storageService = storageService;
        this.secureStorageService = secureStorageService;
        this.memoryStorageService = memoryStorageService;
        this.logService = logService;
        this.stateFactory = stateFactory;
        this.accountService = accountService;
        this.environmentService = environmentService;
        this.tokenService = tokenService;
        this.migrationRunner = migrationRunner;
        this.hasBeenInited = false;
        this.isRecoveredSession = false;
        // default account serializer, must be overridden by child class
        this.accountDeserializer = account_1.Account.fromJSON;
    }
    init() {
        return __awaiter(this, arguments, void 0, function* (initOptions = {}) {
            // Deconstruct and apply defaults
            const { runMigrations = true } = initOptions;
            if (this.hasBeenInited) {
                return;
            }
            if (runMigrations) {
                yield this.migrationRunner.run();
            }
            else {
                // It may have been requested to not run the migrations but we should defensively not
                // continue this method until migrations have a chance to be completed elsewhere.
                yield this.migrationRunner.waitForCompletion();
            }
            yield this.state().then((state) => __awaiter(this, void 0, void 0, function* () {
                if (state == null) {
                    yield this.setState(new state_1.State(this.createGlobals()));
                }
                else {
                    this.isRecoveredSession = true;
                }
            }));
            yield this.initAccountState();
            this.hasBeenInited = true;
        });
    }
    initAccountState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRecoveredSession) {
                return;
            }
            // Get all likely authenticated accounts
            const authenticatedAccounts = yield (0, rxjs_1.firstValueFrom)(this.accountService.accounts$.pipe((0, rxjs_1.map)((accounts) => Object.keys(accounts))));
            yield this.updateState((state) => __awaiter(this, void 0, void 0, function* () {
                for (const i in authenticatedAccounts) {
                    state = yield this.syncAccountFromDisk(authenticatedAccounts[i]);
                }
                return state;
            }));
        });
    }
    syncAccountFromDisk(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                return;
            }
            const diskAccount = yield this.getAccountFromDisk({ userId: userId });
            const state = yield this.updateState((state) => __awaiter(this, void 0, void 0, function* () {
                if (state.accounts == null) {
                    state.accounts = {};
                }
                state.accounts[userId] = this.createAccount();
                state.accounts[userId].profile = diskAccount.profile;
                return state;
            }));
            return state;
        });
    }
    addAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.environmentService.seedUserEnvironment(account.profile.userId);
            yield this.updateState((state) => __awaiter(this, void 0, void 0, function* () {
                state.accounts[account.profile.userId] = account;
                return state;
            }));
            yield this.scaffoldNewAccountStorage(account);
        });
    }
    clean(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(options, yield this.defaultInMemoryOptions());
            yield this.deAuthenticateAccount(options.userId);
            yield this.removeAccountFromDisk(options === null || options === void 0 ? void 0 : options.userId);
            yield this.removeAccountFromMemory(options === null || options === void 0 ? void 0 : options.userId);
        });
    }
    /**
     * user key when using the "never" option of vault timeout
     */
    getUserKeyAutoUnlock(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(this.reconcileOptions(options, { keySuffix: "auto" }), yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return null;
            }
            return yield this.secureStorageService.get(`${options.userId}${partialKeys.userAutoKey}`, options);
        });
    }
    /**
     * user key when using the "never" option of vault timeout
     */
    setUserKeyAutoUnlock(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(this.reconcileOptions(options, { keySuffix: "auto" }), yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return;
            }
            yield this.saveSecureStorageKey(partialKeys.userAutoKey, value, options);
        });
    }
    /**
     * User's encrypted symmetric key when using biometrics
     */
    getUserKeyBiometric(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(this.reconcileOptions(options, { keySuffix: "biometric" }), yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return null;
            }
            return yield this.secureStorageService.get(`${options.userId}${partialKeys.userBiometricKey}`, options);
        });
    }
    hasUserKeyBiometric(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(this.reconcileOptions(options, { keySuffix: "biometric" }), yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return false;
            }
            return yield this.secureStorageService.has(`${options.userId}${partialKeys.userBiometricKey}`, options);
        });
    }
    setUserKeyBiometric(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(this.reconcileOptions(options, { keySuffix: "biometric" }), yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return;
            }
            yield this.saveSecureStorageKey(partialKeys.userBiometricKey, value, options);
        });
    }
    /**
     * @deprecated Use UserKeyAuto instead
     */
    setCryptoMasterKeyAuto(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(this.reconcileOptions(options, { keySuffix: "auto" }), yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return;
            }
            yield this.saveSecureStorageKey(partialKeys.autoKey, value, options);
        });
    }
    /**
     * @deprecated I don't see where this is even used
     */
    getCryptoMasterKeyB64(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(options, yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return null;
            }
            return yield this.secureStorageService.get(`${options === null || options === void 0 ? void 0 : options.userId}${partialKeys.masterKey}`, options);
        });
    }
    /**
     * @deprecated I don't see where this is even used
     */
    setCryptoMasterKeyB64(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(options, yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return;
            }
            yield this.saveSecureStorageKey(partialKeys.masterKey, value, options);
        });
    }
    getDuckDuckGoSharedKey(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(options, yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return null;
            }
            return yield this.secureStorageService.get(DDG_SHARED_KEY, options);
        });
    }
    setDuckDuckGoSharedKey(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = this.reconcileOptions(options, yield this.defaultSecureStorageOptions());
            if ((options === null || options === void 0 ? void 0 : options.userId) == null) {
                return;
            }
            value == null
                ? yield this.secureStorageService.remove(DDG_SHARED_KEY, options)
                : yield this.secureStorageService.save(DDG_SHARED_KEY, value, options);
        });
    }
    setEnableDuckDuckGoBrowserIntegration(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const globals = yield this.getGlobals(this.reconcileOptions(options, yield this.defaultOnDiskOptions()));
            globals.enableDuckDuckGoBrowserIntegration = value;
            yield this.saveGlobals(globals, this.reconcileOptions(options, yield this.defaultOnDiskOptions()));
        });
    }
    /**
     * @deprecated Use UserKey instead
     */
    getEncryptedCryptoSymmetricKey(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return (_a = (yield this.getAccount(this.reconcileOptions(options, yield this.defaultOnDiskOptions())))) === null || _a === void 0 ? void 0 : _a.keys.cryptoSymmetricKey.encrypted;
        });
    }
    getIsAuthenticated(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.tokenService.getAccessToken(options === null || options === void 0 ? void 0 : options.userId)) != null &&
                (yield this.getUserId(options)) != null);
        });
    }
    getLastSync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return (_b = (_a = (yield this.getAccount(this.reconcileOptions(options, yield this.defaultOnDiskMemoryOptions())))) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.lastSync;
        });
    }
    setLastSync(value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccount(this.reconcileOptions(options, yield this.defaultOnDiskMemoryOptions()));
            account.profile.lastSync = value;
            yield this.saveAccount(account, this.reconcileOptions(options, yield this.defaultOnDiskMemoryOptions()));
        });
    }
    getUserId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return (_b = (_a = (yield this.getAccount(this.reconcileOptions(options, yield this.defaultOnDiskOptions())))) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.userId;
        });
    }
    getGlobals(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let globals;
            if (this.useMemory(options.storageLocation)) {
                globals = yield this.getGlobalsFromMemory();
            }
            if (this.useDisk && globals == null) {
                globals = yield this.getGlobalsFromDisk(options);
            }
            if (globals == null) {
                globals = this.createGlobals();
            }
            return globals;
        });
    }
    saveGlobals(globals, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.useMemory(options.storageLocation)
                ? this.saveGlobalsToMemory(globals)
                : yield this.saveGlobalsToDisk(globals, options);
        });
    }
    getGlobalsFromMemory() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.state()).globals;
        });
    }
    getGlobalsFromDisk(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.storageService.get(keys.global, options);
        });
    }
    saveGlobalsToMemory(globals) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateState((state) => __awaiter(this, void 0, void 0, function* () {
                state.globals = globals;
                return state;
            }));
        });
    }
    saveGlobalsToDisk(globals, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.useSecureStorage) {
                yield this.secureStorageService.save(keys.global, globals, options);
            }
            else {
                yield this.storageService.save(keys.global, globals, options);
            }
        });
    }
    getAccount(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account;
                if (this.useMemory(options.storageLocation)) {
                    account = yield this.getAccountFromMemory(options);
                }
                if (this.useDisk(options.storageLocation) && account == null) {
                    account = yield this.getAccountFromDisk(options);
                }
                return account;
            }
            catch (e) {
                this.logService.error(e);
            }
        });
    }
    getAccountFromMemory(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = options.userId) !== null && _a !== void 0 ? _a : (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id))));
            return yield this.state().then((state) => __awaiter(this, void 0, void 0, function* () {
                if (state.accounts == null) {
                    return null;
                }
                return state.accounts[userId];
            }));
        });
    }
    getAccountFromDisk(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = options.userId) !== null && _a !== void 0 ? _a : (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id))));
            if (userId == null) {
                return null;
            }
            const account = (options === null || options === void 0 ? void 0 : options.useSecureStorage)
                ? (_b = (yield this.secureStorageService.get(options.userId, options))) !== null && _b !== void 0 ? _b : (yield this.storageService.get(options.userId, this.reconcileOptions(options, { htmlStorageLocation: enums_1.HtmlStorageLocation.Local })))
                : yield this.storageService.get(options.userId, options);
            return account;
        });
    }
    useMemory(storageLocation) {
        return storageLocation === enums_1.StorageLocation.Memory || storageLocation === enums_1.StorageLocation.Both;
    }
    useDisk(storageLocation) {
        return storageLocation === enums_1.StorageLocation.Disk || storageLocation === enums_1.StorageLocation.Both;
    }
    saveAccount(account_2) {
        return __awaiter(this, arguments, void 0, function* (account, options = {
            storageLocation: enums_1.StorageLocation.Both,
            useSecureStorage: false,
        }) {
            return this.useMemory(options.storageLocation)
                ? yield this.saveAccountToMemory(account)
                : yield this.saveAccountToDisk(account, options);
        });
    }
    saveAccountToDisk(account, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const storageLocation = options.useSecureStorage
                ? this.secureStorageService
                : this.storageService;
            yield storageLocation.save(`${options.userId}`, account, options);
        });
    }
    saveAccountToMemory(account) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.getAccountFromMemory({ userId: account.profile.userId })) !== null) {
                yield this.updateState((state) => {
                    return new Promise((resolve) => {
                        state.accounts[account.profile.userId] = account;
                        resolve(state);
                    });
                });
            }
        });
    }
    scaffoldNewAccountStorage(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // We don't want to manipulate the referenced in memory account
            const deepClone = JSON.parse(JSON.stringify(account));
            yield this.scaffoldNewAccountLocalStorage(deepClone);
            yield this.scaffoldNewAccountSessionStorage(deepClone);
            yield this.scaffoldNewAccountMemoryStorage(deepClone);
        });
    }
    // TODO: There is a tech debt item for splitting up these methods - only Web uses multiple storage locations in its storageService.
    // For now these methods exist with some redundancy to facilitate this special web requirement.
    scaffoldNewAccountLocalStorage(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveAccount(account, this.reconcileOptions({ userId: account.profile.userId }, yield this.defaultOnDiskLocalOptions()));
        });
    }
    scaffoldNewAccountMemoryStorage(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.save(account.profile.userId, account, yield this.defaultOnDiskMemoryOptions());
            yield this.saveAccount(account, this.reconcileOptions({ userId: account.profile.userId }, yield this.defaultOnDiskMemoryOptions()));
        });
    }
    scaffoldNewAccountSessionStorage(account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.save(account.profile.userId, account, yield this.defaultOnDiskMemoryOptions());
            yield this.saveAccount(account, this.reconcileOptions({ userId: account.profile.userId }, yield this.defaultOnDiskOptions()));
        });
    }
    reconcileOptions(requestedOptions, defaultOptions) {
        var _a, _b, _c, _d, _e;
        if (requestedOptions == null) {
            return defaultOptions;
        }
        requestedOptions.userId = (_a = requestedOptions === null || requestedOptions === void 0 ? void 0 : requestedOptions.userId) !== null && _a !== void 0 ? _a : defaultOptions.userId;
        requestedOptions.storageLocation =
            (_b = requestedOptions === null || requestedOptions === void 0 ? void 0 : requestedOptions.storageLocation) !== null && _b !== void 0 ? _b : defaultOptions.storageLocation;
        requestedOptions.useSecureStorage =
            (_c = requestedOptions === null || requestedOptions === void 0 ? void 0 : requestedOptions.useSecureStorage) !== null && _c !== void 0 ? _c : defaultOptions.useSecureStorage;
        requestedOptions.htmlStorageLocation =
            (_d = requestedOptions === null || requestedOptions === void 0 ? void 0 : requestedOptions.htmlStorageLocation) !== null && _d !== void 0 ? _d : defaultOptions.htmlStorageLocation;
        requestedOptions.keySuffix = (_e = requestedOptions === null || requestedOptions === void 0 ? void 0 : requestedOptions.keySuffix) !== null && _e !== void 0 ? _e : defaultOptions.keySuffix;
        return requestedOptions;
    }
    defaultInMemoryOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id)));
            return {
                storageLocation: enums_1.StorageLocation.Memory,
                userId,
            };
        });
    }
    defaultOnDiskOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id)));
            return {
                storageLocation: enums_1.StorageLocation.Disk,
                htmlStorageLocation: enums_1.HtmlStorageLocation.Session,
                userId,
                useSecureStorage: false,
            };
        });
    }
    defaultOnDiskLocalOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id)));
            return {
                storageLocation: enums_1.StorageLocation.Disk,
                htmlStorageLocation: enums_1.HtmlStorageLocation.Local,
                userId,
                useSecureStorage: false,
            };
        });
    }
    defaultOnDiskMemoryOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id)));
            return {
                storageLocation: enums_1.StorageLocation.Disk,
                htmlStorageLocation: enums_1.HtmlStorageLocation.Memory,
                userId,
                useSecureStorage: false,
            };
        });
    }
    defaultSecureStorageOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id)));
            return {
                storageLocation: enums_1.StorageLocation.Disk,
                useSecureStorage: true,
                userId,
            };
        });
    }
    getActiveUserIdFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id)));
        });
    }
    removeAccountFromLocalStorage() {
        return __awaiter(this, arguments, void 0, function* (userId = null) {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id))));
            const storedAccount = yield this.getAccount(this.reconcileOptions({ userId: userId }, yield this.defaultOnDiskLocalOptions()));
            yield this.saveAccount(this.resetAccount(storedAccount), this.reconcileOptions({ userId: userId }, yield this.defaultOnDiskLocalOptions()));
        });
    }
    removeAccountFromSessionStorage() {
        return __awaiter(this, arguments, void 0, function* (userId = null) {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id))));
            const storedAccount = yield this.getAccount(this.reconcileOptions({ userId: userId }, yield this.defaultOnDiskOptions()));
            yield this.saveAccount(this.resetAccount(storedAccount), this.reconcileOptions({ userId: userId }, yield this.defaultOnDiskOptions()));
        });
    }
    removeAccountFromSecureStorage() {
        return __awaiter(this, arguments, void 0, function* (userId = null) {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id))));
            yield this.setUserKeyAutoUnlock(null, { userId: userId });
            yield this.setUserKeyBiometric(null, { userId: userId });
            yield this.setCryptoMasterKeyAuto(null, { userId: userId });
            yield this.setCryptoMasterKeyB64(null, { userId: userId });
        });
    }
    removeAccountFromMemory() {
        return __awaiter(this, arguments, void 0, function* (userId = null) {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((account) => account === null || account === void 0 ? void 0 : account.id))));
            yield this.updateState((state) => __awaiter(this, void 0, void 0, function* () {
                delete state.accounts[userId];
                return state;
            }));
        });
    }
    // settings persist even on reset, and are not affected by this method
    resetAccount(account) {
        // All settings have been moved to StateProviders
        return this.createAccount();
    }
    createAccount(init = null) {
        return this.stateFactory.createAccount(init);
    }
    createGlobals(init = null) {
        return this.stateFactory.createGlobal(init);
    }
    deAuthenticateAccount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // We must have a manual call to clear tokens as we can't leverage state provider to clean
            // up our data as we have secure storage in the mix.
            yield this.tokenService.clearTokens(userId);
        });
    }
    removeAccountFromDisk(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeAccountFromSessionStorage(userId);
            yield this.removeAccountFromLocalStorage(userId);
            yield this.removeAccountFromSecureStorage(userId);
        });
    }
    saveSecureStorageKey(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return value == null
                ? yield this.secureStorageService.remove(`${options.userId}${key}`, options)
                : yield this.secureStorageService.save(`${options.userId}${key}`, value, options);
        });
    }
    state() {
        return __awaiter(this, void 0, void 0, function* () {
            let state = yield this.memoryStorageService.get(keys.state);
            if (this.memoryStorageService.valuesRequireDeserialization) {
                state = state_1.State.fromJSON(state, this.accountDeserializer);
            }
            return state;
        });
    }
    setState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.memoryStorageService.save(keys.state, state);
            return state;
        });
    }
    updateState(stateUpdater) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.state().then((state) => __awaiter(this, void 0, void 0, function* () {
                const updatedState = yield stateUpdater(state);
                if (updatedState == null) {
                    throw new Error("Attempted to update state to null value");
                }
                return yield this.setState(updatedState);
            }));
        });
    }
}
exports.StateService = StateService;
//# sourceMappingURL=state.service.js.map