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
exports.TwoFactorService = exports.SELECTED_PROVIDER = exports.PROVIDERS = exports.TwoFactorProviders = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../platform/misc/utils");
const state_1 = require("../../platform/state");
const two_factor_provider_type_1 = require("../enums/two-factor-provider-type");
exports.TwoFactorProviders = {
    [two_factor_provider_type_1.TwoFactorProviderType.Authenticator]: {
        type: two_factor_provider_type_1.TwoFactorProviderType.Authenticator,
        name: null,
        description: null,
        priority: 1,
        sort: 2,
        premium: false,
    },
    [two_factor_provider_type_1.TwoFactorProviderType.Yubikey]: {
        type: two_factor_provider_type_1.TwoFactorProviderType.Yubikey,
        name: null,
        description: null,
        priority: 3,
        sort: 4,
        premium: true,
    },
    [two_factor_provider_type_1.TwoFactorProviderType.Duo]: {
        type: two_factor_provider_type_1.TwoFactorProviderType.Duo,
        name: "Duo",
        description: null,
        priority: 2,
        sort: 5,
        premium: true,
    },
    [two_factor_provider_type_1.TwoFactorProviderType.OrganizationDuo]: {
        type: two_factor_provider_type_1.TwoFactorProviderType.OrganizationDuo,
        name: "Duo (Organization)",
        description: null,
        priority: 10,
        sort: 6,
        premium: false,
    },
    [two_factor_provider_type_1.TwoFactorProviderType.Email]: {
        type: two_factor_provider_type_1.TwoFactorProviderType.Email,
        name: null,
        description: null,
        priority: 0,
        sort: 1,
        premium: false,
    },
    [two_factor_provider_type_1.TwoFactorProviderType.WebAuthn]: {
        type: two_factor_provider_type_1.TwoFactorProviderType.WebAuthn,
        name: null,
        description: null,
        priority: 4,
        sort: 3,
        premium: false,
    },
};
// Memory storage as only required during authentication process
exports.PROVIDERS = state_1.KeyDefinition.record(state_1.TWO_FACTOR_MEMORY, "providers", {
    deserializer: (obj) => obj,
});
// Memory storage as only required during authentication process
exports.SELECTED_PROVIDER = new state_1.KeyDefinition(state_1.TWO_FACTOR_MEMORY, "selected", {
    deserializer: (obj) => obj,
});
class TwoFactorService {
    constructor(i18nService, platformUtilsService, globalStateProvider) {
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.globalStateProvider = globalStateProvider;
        this.providersState = this.globalStateProvider.get(exports.PROVIDERS);
        this.selectedState = this.globalStateProvider.get(exports.SELECTED_PROVIDER);
        this.providers$ = this.providersState.state$.pipe((0, rxjs_1.map)((providers) => utils_1.Utils.recordToMap(providers)));
        this.selected$ = this.selectedState.state$;
    }
    init() {
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Email].name = this.i18nService.t("emailTitle");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Email].description = this.i18nService.t("emailDescV2");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Authenticator].name =
            this.i18nService.t("authenticatorAppTitle");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Authenticator].description =
            this.i18nService.t("authenticatorAppDescV2");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Duo].description = this.i18nService.t("duoDescV2");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.OrganizationDuo].name =
            "Duo (" + this.i18nService.t("organization") + ")";
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.OrganizationDuo].description =
            this.i18nService.t("duoOrganizationDesc");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.WebAuthn].name = this.i18nService.t("webAuthnTitle");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.WebAuthn].description =
            this.i18nService.t("webAuthnDesc");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Yubikey].name = this.i18nService.t("yubiKeyTitleV2");
        exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Yubikey].description =
            this.i18nService.t("yubiKeyDesc");
    }
    getSupportedProviders(win) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, rxjs_1.firstValueFrom)(this.providers$);
            const providers = [];
            if (data == null) {
                return providers;
            }
            if (data.has(two_factor_provider_type_1.TwoFactorProviderType.OrganizationDuo) &&
                this.platformUtilsService.supportsDuo()) {
                providers.push(exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.OrganizationDuo]);
            }
            if (data.has(two_factor_provider_type_1.TwoFactorProviderType.Authenticator)) {
                providers.push(exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Authenticator]);
            }
            if (data.has(two_factor_provider_type_1.TwoFactorProviderType.Yubikey)) {
                providers.push(exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Yubikey]);
            }
            if (data.has(two_factor_provider_type_1.TwoFactorProviderType.Duo) && this.platformUtilsService.supportsDuo()) {
                providers.push(exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Duo]);
            }
            if (data.has(two_factor_provider_type_1.TwoFactorProviderType.WebAuthn) &&
                this.platformUtilsService.supportsWebAuthn(win)) {
                providers.push(exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.WebAuthn]);
            }
            if (data.has(two_factor_provider_type_1.TwoFactorProviderType.Email)) {
                providers.push(exports.TwoFactorProviders[two_factor_provider_type_1.TwoFactorProviderType.Email]);
            }
            return providers;
        });
    }
    getDefaultProvider(webAuthnSupported) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, rxjs_1.firstValueFrom)(this.providers$);
            const selected = yield (0, rxjs_1.firstValueFrom)(this.selected$);
            if (data == null) {
                return null;
            }
            if (selected != null && data.has(selected)) {
                return selected;
            }
            let providerType = null;
            let providerPriority = -1;
            data.forEach((_value, type) => {
                const provider = exports.TwoFactorProviders[type];
                if (provider != null && provider.priority > providerPriority) {
                    if (type === two_factor_provider_type_1.TwoFactorProviderType.WebAuthn && !webAuthnSupported) {
                        return;
                    }
                    providerType = type;
                    providerPriority = provider.priority;
                }
            });
            return providerType;
        });
    }
    setSelectedProvider(type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.selectedState.update(() => type);
        });
    }
    clearSelectedProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.selectedState.update(() => null);
        });
    }
    setProviders(response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.providersState.update(() => response.twoFactorProviders2);
        });
    }
    clearProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.providersState.update(() => null);
        });
    }
    getProviders() {
        return (0, rxjs_1.firstValueFrom)(this.providers$);
    }
}
exports.TwoFactorService = TwoFactorService;
//# sourceMappingURL=two-factor.service.js.map