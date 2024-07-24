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
exports.DefaultConfigService = exports.GLOBAL_SERVER_CONFIGURATIONS = exports.USER_SERVER_CONFIG = exports.RETRIEVAL_INTERVAL = void 0;
const rxjs_1 = require("rxjs");
const semver_1 = require("semver");
const authentication_status_1 = require("../../../auth/enums/authentication-status");
const feature_flag_enum_1 = require("../../../enums/feature-flag.enum");
const server_config_1 = require("../../abstractions/config/server-config");
const environment_service_1 = require("../../abstractions/environment.service");
const flags_1 = require("../../misc/flags");
const server_config_data_1 = require("../../models/data/server-config.data");
const state_1 = require("../../state");
exports.RETRIEVAL_INTERVAL = (0, flags_1.devFlagEnabled)("configRetrievalIntervalMs")
    ? (0, flags_1.devFlagValue)("configRetrievalIntervalMs")
    : 3600000; // 1 hour
exports.USER_SERVER_CONFIG = new state_1.UserKeyDefinition(state_1.CONFIG_DISK, "serverConfig", {
    deserializer: (data) => (data == null ? null : server_config_1.ServerConfig.fromJSON(data)),
    clearOn: ["logout"],
});
exports.GLOBAL_SERVER_CONFIGURATIONS = state_1.KeyDefinition.record(state_1.CONFIG_DISK, "byServer", {
    deserializer: (data) => (data == null ? null : server_config_1.ServerConfig.fromJSON(data)),
});
// FIXME: currently we are limited to api requests for active users. Update to accept a UserId and APIUrl once ApiService supports it.
class DefaultConfigService {
    constructor(configApiService, environmentService, logService, stateProvider, authService) {
        this.configApiService = configApiService;
        this.environmentService = environmentService;
        this.logService = logService;
        this.stateProvider = stateProvider;
        this.authService = authService;
        this.failedFetchFallbackSubject = new rxjs_1.Subject();
        const apiUrl$ = this.environmentService.environment$.pipe((0, rxjs_1.map)((environment) => environment.getApiUrl()));
        const userId$ = this.stateProvider.activeUserId$;
        const authStatus$ = userId$.pipe((0, rxjs_1.switchMap)((userId) => (userId == null ? (0, rxjs_1.of)(null) : this.authService.authStatusFor$(userId))));
        this.serverConfig$ = (0, rxjs_1.combineLatest)([userId$, apiUrl$, authStatus$]).pipe((0, rxjs_1.switchMap)(([userId, apiUrl, authStatus]) => {
            if (userId == null || authStatus !== authentication_status_1.AuthenticationStatus.Unlocked) {
                return this.globalConfigFor$(apiUrl).pipe((0, rxjs_1.map)((config) => [config, null, apiUrl]));
            }
            return this.userConfigFor$(userId).pipe((0, rxjs_1.map)((config) => [config, userId, apiUrl]));
        }), (0, rxjs_1.tap)((rec) => __awaiter(this, void 0, void 0, function* () {
            const [existingConfig, userId, apiUrl] = rec;
            // Grab new config if older retrieval interval
            if (!existingConfig || this.olderThanRetrievalInterval(existingConfig.utcDate)) {
                yield this.renewConfig(existingConfig, userId, apiUrl);
            }
        })), (0, rxjs_1.switchMap)(([existingConfig]) => {
            // If we needed to fetch, stop this emit, we'll get a new one after update
            // This is split up with the above tap because we need to return an observable from a failed promise,
            // which isn't very doable since promises are converted to observables in switchMap
            if (!existingConfig || this.olderThanRetrievalInterval(existingConfig.utcDate)) {
                return rxjs_1.NEVER;
            }
            return (0, rxjs_1.of)(existingConfig);
        }), 
        // If fetch fails, we'll emit on this subject to fallback to the existing config
        (0, rxjs_1.mergeWith)(this.failedFetchFallbackSubject), (0, rxjs_1.shareReplay)({ refCount: true, bufferSize: 1 }));
        this.cloudRegion$ = this.serverConfig$.pipe((0, rxjs_1.map)((config) => { var _a, _b; return (_b = (_a = config === null || config === void 0 ? void 0 : config.environment) === null || _a === void 0 ? void 0 : _a.cloudRegion) !== null && _b !== void 0 ? _b : environment_service_1.Region.US; }));
    }
    getFeatureFlag$(key) {
        return this.serverConfig$.pipe((0, rxjs_1.map)((serverConfig) => {
            if ((serverConfig === null || serverConfig === void 0 ? void 0 : serverConfig.featureStates) == null || serverConfig.featureStates[key] == null) {
                return feature_flag_enum_1.DefaultFeatureFlagValue[key];
            }
            return serverConfig.featureStates[key];
        }));
    }
    getFeatureFlag(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.getFeatureFlag$(key));
        });
    }
    checkServerMeetsVersionRequirement$(minimumRequiredServerVersion) {
        return this.serverConfig$.pipe((0, rxjs_1.map)((serverConfig) => {
            if (serverConfig == null) {
                return false;
            }
            const serverVersion = new semver_1.SemVer(serverConfig.version);
            return serverVersion.compare(minimumRequiredServerVersion) >= 0;
        }));
    }
    ensureConfigFetched() {
        return __awaiter(this, void 0, void 0, function* () {
            // Triggering a retrieval for the given user ensures that the config is less than RETRIEVAL_INTERVAL old
            yield (0, rxjs_1.firstValueFrom)(this.serverConfig$);
        });
    }
    olderThanRetrievalInterval(date) {
        return new Date().getTime() - date.getTime() > exports.RETRIEVAL_INTERVAL;
    }
    // Updates the on-disk configuration with a newly retrieved configuration
    renewConfig(existingConfig, userId, apiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield this.configApiService.get(userId);
                const newConfig = new server_config_1.ServerConfig(new server_config_data_1.ServerConfigData(response));
                // Update the environment region
                if (((_a = newConfig === null || newConfig === void 0 ? void 0 : newConfig.environment) === null || _a === void 0 ? void 0 : _a.cloudRegion) != null &&
                    ((_b = existingConfig === null || existingConfig === void 0 ? void 0 : existingConfig.environment) === null || _b === void 0 ? void 0 : _b.cloudRegion) != newConfig.environment.cloudRegion) {
                    // Null userId sets global, otherwise sets to the given user
                    yield this.environmentService.setCloudRegion(userId, (_c = newConfig === null || newConfig === void 0 ? void 0 : newConfig.environment) === null || _c === void 0 ? void 0 : _c.cloudRegion);
                }
                if (userId == null) {
                    // update global state with new pulled config
                    yield this.stateProvider.getGlobal(exports.GLOBAL_SERVER_CONFIGURATIONS).update((configs) => {
                        return Object.assign(Object.assign({}, configs), { [apiUrl]: newConfig });
                    });
                }
                else {
                    // update state with new pulled config
                    yield this.stateProvider.setUserState(exports.USER_SERVER_CONFIG, newConfig, userId);
                }
            }
            catch (e) {
                // mutate error to be handled by catchError
                this.logService.error(`Unable to fetch ServerConfig from ${apiUrl}: ${e === null || e === void 0 ? void 0 : e.message}`);
                // Emit the existing config
                this.failedFetchFallbackSubject.next(existingConfig);
            }
        });
    }
    globalConfigFor$(apiUrl) {
        return this.stateProvider
            .getGlobal(exports.GLOBAL_SERVER_CONFIGURATIONS)
            .state$.pipe((0, rxjs_1.map)((configs) => configs === null || configs === void 0 ? void 0 : configs[apiUrl]));
    }
    userConfigFor$(userId) {
        return this.stateProvider.getUser(userId, exports.USER_SERVER_CONFIG).state$;
    }
}
exports.DefaultConfigService = DefaultConfigService;
//# sourceMappingURL=default-config.service.js.map