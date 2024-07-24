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
exports.DefaultDomainSettingsService = exports.DomainSettingsService = void 0;
const rxjs_1 = require("rxjs");
const domain_service_1 = require("../../models/domain/domain-service");
const utils_1 = require("../../platform/misc/utils");
const state_1 = require("../../platform/state");
const SHOW_FAVICONS = new state_1.KeyDefinition(state_1.DOMAIN_SETTINGS_DISK, "showFavicons", {
    deserializer: (value) => value !== null && value !== void 0 ? value : true,
});
const NEVER_DOMAINS = new state_1.KeyDefinition(state_1.DOMAIN_SETTINGS_DISK, "neverDomains", {
    deserializer: (value) => value !== null && value !== void 0 ? value : null,
});
const EQUIVALENT_DOMAINS = new state_1.UserKeyDefinition(state_1.DOMAIN_SETTINGS_DISK, "equivalentDomains", {
    deserializer: (value) => value !== null && value !== void 0 ? value : null,
    clearOn: ["logout"],
});
const DEFAULT_URI_MATCH_STRATEGY = new state_1.UserKeyDefinition(state_1.DOMAIN_SETTINGS_DISK, "defaultUriMatchStrategy", {
    deserializer: (value) => value !== null && value !== void 0 ? value : domain_service_1.UriMatchStrategy.Domain,
    clearOn: [],
});
class DomainSettingsService {
}
exports.DomainSettingsService = DomainSettingsService;
class DefaultDomainSettingsService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.showFaviconsState = this.stateProvider.getGlobal(SHOW_FAVICONS);
        this.showFavicons$ = this.showFaviconsState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.neverDomainsState = this.stateProvider.getGlobal(NEVER_DOMAINS);
        this.neverDomains$ = this.neverDomainsState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : null));
        this.equivalentDomainsState = this.stateProvider.getActive(EQUIVALENT_DOMAINS);
        this.equivalentDomains$ = this.equivalentDomainsState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : null));
        this.defaultUriMatchStrategyState = this.stateProvider.getActive(DEFAULT_URI_MATCH_STRATEGY);
        this.defaultUriMatchStrategy$ = this.defaultUriMatchStrategyState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : domain_service_1.UriMatchStrategy.Domain));
    }
    setShowFavicons(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.showFaviconsState.update(() => newValue);
        });
    }
    setNeverDomains(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.neverDomainsState.update(() => newValue);
        });
    }
    setEquivalentDomains(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.equivalentDomainsState.update(() => newValue);
        });
    }
    setDefaultUriMatchStrategy(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.defaultUriMatchStrategyState.update(() => newValue);
        });
    }
    getUrlEquivalentDomains(url) {
        const domains$ = this.equivalentDomains$.pipe((0, rxjs_1.map)((equivalentDomains) => {
            const domain = utils_1.Utils.getDomain(url);
            if (domain == null || equivalentDomains == null) {
                return new Set();
            }
            const equivalents = equivalentDomains.filter((ed) => ed.includes(domain)).flat();
            return new Set(equivalents);
        }));
        return domains$;
    }
}
exports.DefaultDomainSettingsService = DefaultDomainSettingsService;
//# sourceMappingURL=domain-settings.service.js.map