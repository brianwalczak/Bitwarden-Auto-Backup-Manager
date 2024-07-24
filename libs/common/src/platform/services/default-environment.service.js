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
exports.SelfHostedEnvironment = exports.CloudEnvironment = exports.DefaultEnvironmentService = exports.PRODUCTION_REGIONS = exports.USER_CLOUD_REGION_KEY = exports.GLOBAL_CLOUD_REGION_KEY = exports.USER_ENVIRONMENT_KEY = exports.GLOBAL_ENVIRONMENT_KEY = exports.EnvironmentUrls = void 0;
const rxjs_1 = require("rxjs");
const environment_service_1 = require("../abstractions/environment.service");
const utils_1 = require("../misc/utils");
const state_1 = require("../state");
class EnvironmentUrls {
    constructor() {
        this.base = null;
        this.api = null;
        this.identity = null;
        this.icons = null;
        this.notifications = null;
        this.events = null;
        this.webVault = null;
        this.keyConnector = null;
    }
}
exports.EnvironmentUrls = EnvironmentUrls;
class EnvironmentState {
    static fromJSON(obj) {
        return Object.assign(new EnvironmentState(), obj);
    }
}
exports.GLOBAL_ENVIRONMENT_KEY = new state_1.KeyDefinition(state_1.ENVIRONMENT_DISK, "environment", {
    deserializer: EnvironmentState.fromJSON,
});
exports.USER_ENVIRONMENT_KEY = new state_1.UserKeyDefinition(state_1.ENVIRONMENT_DISK, "environment", {
    deserializer: EnvironmentState.fromJSON,
    clearOn: ["logout"],
});
exports.GLOBAL_CLOUD_REGION_KEY = new state_1.KeyDefinition(state_1.ENVIRONMENT_MEMORY, "cloudRegion", {
    deserializer: (b) => b,
});
exports.USER_CLOUD_REGION_KEY = new state_1.UserKeyDefinition(state_1.ENVIRONMENT_MEMORY, "cloudRegion", {
    deserializer: (b) => b,
    clearOn: ["logout"],
});
/**
 * The production regions available for selection.
 *
 * In the future we desire to load these urls from the config endpoint.
 */
exports.PRODUCTION_REGIONS = [
    {
        key: environment_service_1.Region.US,
        domain: "bitwarden.com",
        urls: {
            base: null,
            api: "https://api.bitwarden.com",
            identity: "https://identity.bitwarden.com",
            icons: "https://icons.bitwarden.net",
            webVault: "https://vault.bitwarden.com",
            notifications: "https://notifications.bitwarden.com",
            events: "https://events.bitwarden.com",
            scim: "https://scim.bitwarden.com",
        },
    },
    {
        key: environment_service_1.Region.EU,
        domain: "bitwarden.eu",
        urls: {
            base: null,
            api: "https://api.bitwarden.eu",
            identity: "https://identity.bitwarden.eu",
            icons: "https://icons.bitwarden.eu",
            webVault: "https://vault.bitwarden.eu",
            notifications: "https://notifications.bitwarden.eu",
            events: "https://events.bitwarden.eu",
            scim: "https://scim.bitwarden.eu",
        },
    },
];
/**
 * The default region when starting the app.
 */
const DEFAULT_REGION = environment_service_1.Region.US;
/**
 * The default region configuration.
 */
const DEFAULT_REGION_CONFIG = exports.PRODUCTION_REGIONS.find((r) => r.key === DEFAULT_REGION);
class DefaultEnvironmentService {
    constructor(stateProvider, accountService) {
        this.stateProvider = stateProvider;
        this.accountService = accountService;
        // We intentionally don't want the helper on account service, we want the null back if there is no active user
        this.activeAccountId$ = this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id));
        this.globalState = this.stateProvider.getGlobal(exports.GLOBAL_ENVIRONMENT_KEY);
        this.globalCloudRegionState = this.stateProvider.getGlobal(exports.GLOBAL_CLOUD_REGION_KEY);
        const account$ = this.activeAccountId$.pipe(
        // Use == here to not trigger on undefined -> null transition
        (0, rxjs_1.distinctUntilChanged)((oldUserId, newUserId) => oldUserId == newUserId));
        this.environment$ = account$.pipe((0, rxjs_1.switchMap)((userId) => {
            const t = userId
                ? this.stateProvider.getUser(userId, exports.USER_ENVIRONMENT_KEY).state$
                : this.stateProvider.getGlobal(exports.GLOBAL_ENVIRONMENT_KEY).state$;
            return t;
        }), (0, rxjs_1.map)((state) => {
            return this.buildEnvironment(state === null || state === void 0 ? void 0 : state.region, state === null || state === void 0 ? void 0 : state.urls);
        }));
        this.cloudWebVaultUrl$ = account$.pipe((0, rxjs_1.switchMap)((userId) => {
            const t = userId
                ? this.stateProvider.getUser(userId, exports.USER_CLOUD_REGION_KEY).state$
                : this.stateProvider.getGlobal(exports.GLOBAL_CLOUD_REGION_KEY).state$;
            return t;
        }), (0, rxjs_1.map)((region) => {
            if (region != null) {
                const config = this.getRegionConfig(region);
                if (config != null) {
                    return config.urls.webVault;
                }
            }
            return DEFAULT_REGION_CONFIG.urls.webVault;
        }));
    }
    availableRegions() {
        var _a;
        const additionalRegions = (_a = process.env.ADDITIONAL_REGIONS) !== null && _a !== void 0 ? _a : [];
        return exports.PRODUCTION_REGIONS.concat(additionalRegions);
    }
    /**
     * Get the region configuration for the given region.
     */
    getRegionConfig(region) {
        return this.availableRegions().find((r) => r.key === region);
    }
    setEnvironment(region, urls) {
        return __awaiter(this, void 0, void 0, function* () {
            // Unknown regions are treated as self-hosted
            if (this.getRegionConfig(region) == null) {
                region = environment_service_1.Region.SelfHosted;
            }
            // If self-hosted ensure urls are valid else fallback to default region
            if (region == environment_service_1.Region.SelfHosted && isEmpty(urls)) {
                region = DEFAULT_REGION;
            }
            if (region != environment_service_1.Region.SelfHosted) {
                yield this.globalState.update(() => ({
                    region: region,
                    urls: null,
                }));
                return null;
            }
            else {
                // Clean the urls
                urls.base = formatUrl(urls.base);
                urls.webVault = formatUrl(urls.webVault);
                urls.api = formatUrl(urls.api);
                urls.identity = formatUrl(urls.identity);
                urls.icons = formatUrl(urls.icons);
                urls.notifications = formatUrl(urls.notifications);
                urls.events = formatUrl(urls.events);
                urls.keyConnector = formatUrl(urls.keyConnector);
                urls.scim = null;
                yield this.globalState.update(() => ({
                    region: region,
                    urls: {
                        base: urls.base,
                        api: urls.api,
                        identity: urls.identity,
                        webVault: urls.webVault,
                        icons: urls.icons,
                        notifications: urls.notifications,
                        events: urls.events,
                        keyConnector: urls.keyConnector,
                    },
                }));
                return urls;
            }
        });
    }
    /**
     * Helper for building the environment from state. Performs some general sanitization to avoid invalid regions and urls.
     */
    buildEnvironment(region, urls) {
        // Unknown regions are treated as self-hosted
        if (this.getRegionConfig(region) == null) {
            region = environment_service_1.Region.SelfHosted;
        }
        // If self-hosted ensure urls are valid else fallback to default region
        if (region == environment_service_1.Region.SelfHosted && isEmpty(urls)) {
            region = DEFAULT_REGION;
        }
        // Load urls from region config
        if (region != environment_service_1.Region.SelfHosted) {
            const regionConfig = this.getRegionConfig(region);
            if (regionConfig != null) {
                return new CloudEnvironment(regionConfig);
            }
        }
        return new SelfHostedEnvironment(urls);
    }
    setCloudRegion(userId, region) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                yield this.globalCloudRegionState.update(() => region);
            }
            else {
                yield this.stateProvider.getUser(userId, exports.USER_CLOUD_REGION_KEY).update(() => region);
            }
        });
    }
    getEnvironment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                return yield (0, rxjs_1.firstValueFrom)(this.environment$);
            }
            const state = yield this.getEnvironmentState(userId);
            return this.buildEnvironment(state.region, state.urls);
        });
    }
    getEnvironmentState(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Previous rules dictated that we only get from user scoped state if there is an active user.
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.activeAccountId$);
            return activeUserId == null
                ? yield (0, rxjs_1.firstValueFrom)(this.globalState.state$)
                : yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUser(userId !== null && userId !== void 0 ? userId : activeUserId, exports.USER_ENVIRONMENT_KEY).state$);
        });
    }
    seedUserEnvironment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = yield (0, rxjs_1.firstValueFrom)(this.globalState.state$);
            yield this.stateProvider.getUser(userId, exports.USER_ENVIRONMENT_KEY).update(() => global);
        });
    }
}
exports.DefaultEnvironmentService = DefaultEnvironmentService;
function formatUrl(url) {
    if (url == null || url === "") {
        return null;
    }
    url = url.replace(/\/+$/g, "");
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }
    return url.trim();
}
function isEmpty(u) {
    if (u == null) {
        return true;
    }
    return (u.base == null &&
        u.webVault == null &&
        u.api == null &&
        u.identity == null &&
        u.icons == null &&
        u.notifications == null &&
        u.events == null);
}
class UrlEnvironment {
    constructor(region, urls) {
        this.region = region;
        this.urls = urls;
        // Scim is always null for self-hosted
        if (region == environment_service_1.Region.SelfHosted) {
            this.urls.scim = null;
        }
    }
    getRegion() {
        return this.region;
    }
    getUrls() {
        return {
            base: this.urls.base,
            webVault: this.urls.webVault,
            api: this.urls.api,
            identity: this.urls.identity,
            icons: this.urls.icons,
            notifications: this.urls.notifications,
            events: this.urls.events,
            keyConnector: this.urls.keyConnector,
            scim: this.urls.scim,
        };
    }
    hasBaseUrl() {
        return this.urls.base != null;
    }
    getWebVaultUrl() {
        return this.getUrl("webVault", "");
    }
    getApiUrl() {
        return this.getUrl("api", "/api");
    }
    getEventsUrl() {
        return this.getUrl("events", "/events");
    }
    getIconsUrl() {
        return this.getUrl("icons", "/icons");
    }
    getIdentityUrl() {
        return this.getUrl("identity", "/identity");
    }
    getKeyConnectorUrl() {
        return this.urls.keyConnector;
    }
    getNotificationsUrl() {
        return this.getUrl("notifications", "/notifications");
    }
    getScimUrl() {
        if (this.urls.scim != null) {
            return this.urls.scim + "/v2";
        }
        return this.getWebVaultUrl() === "https://vault.bitwarden.com"
            ? "https://scim.bitwarden.com/v2"
            : this.getWebVaultUrl() + "/scim/v2";
    }
    getSendUrl() {
        return this.getWebVaultUrl() === "https://vault.bitwarden.com"
            ? "https://send.bitwarden.com/#"
            : this.getWebVaultUrl() + "/#/send/";
    }
    /**
     * Presume that if the region is not self-hosted, it is cloud.
     */
    isCloud() {
        return this.region !== environment_service_1.Region.SelfHosted;
    }
    /**
     * Helper for getting an URL.
     *
     * @param key Key of the URL to get from URLs
     * @param baseSuffix Suffix to append to the base URL if the url is not set
     * @returns
     */
    getUrl(key, baseSuffix) {
        if (this.urls[key] != null) {
            return this.urls[key];
        }
        if (this.urls.base) {
            return this.urls.base + baseSuffix;
        }
        return DEFAULT_REGION_CONFIG.urls[key];
    }
}
/**
 * Denote a cloud environment.
 */
class CloudEnvironment extends UrlEnvironment {
    constructor(config) {
        super(config.key, config.urls);
        this.config = config;
    }
    /**
     * Cloud always returns nice urls, i.e. bitwarden.com instead of vault.bitwarden.com.
     */
    getHostname() {
        return this.config.domain;
    }
}
exports.CloudEnvironment = CloudEnvironment;
class SelfHostedEnvironment extends UrlEnvironment {
    constructor(urls) {
        super(environment_service_1.Region.SelfHosted, urls);
    }
    getHostname() {
        return utils_1.Utils.getHost(this.getWebVaultUrl());
    }
}
exports.SelfHostedEnvironment = SelfHostedEnvironment;
//# sourceMappingURL=default-environment.service.js.map