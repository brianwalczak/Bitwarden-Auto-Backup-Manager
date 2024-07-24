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
exports.VaultSettingsService = void 0;
const rxjs_1 = require("rxjs");
const vault_settings_state_1 = require("../key-state/vault-settings.state");
/**
 * {@link VaultSettingsServiceAbstraction}
 */
class VaultSettingsService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.enablePasskeysState = this.stateProvider.getGlobal(vault_settings_state_1.USER_ENABLE_PASSKEYS);
        /**
         * {@link VaultSettingsServiceAbstraction.enablePasskeys$}
         */
        this.enablePasskeys$ = this.enablePasskeysState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.showCardsCurrentTabState = this.stateProvider.getActive(vault_settings_state_1.SHOW_CARDS_CURRENT_TAB);
        /**
         * {@link VaultSettingsServiceAbstraction.showCardsCurrentTab$}
         */
        this.showCardsCurrentTab$ = this.showCardsCurrentTabState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.showIdentitiesCurrentTabState = this.stateProvider.getActive(vault_settings_state_1.SHOW_IDENTITIES_CURRENT_TAB);
        /**
         * {@link VaultSettingsServiceAbstraction.showIdentitiesCurrentTab$}
         */
        this.showIdentitiesCurrentTab$ = this.showIdentitiesCurrentTabState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
    }
    /**
     * {@link VaultSettingsServiceAbstraction.setShowCardsCurrentTab}
     */
    setShowCardsCurrentTab(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.showCardsCurrentTabState.update(() => value);
        });
    }
    /**
     * {@link VaultSettingsServiceAbstraction.setDontShowIdentitiesCurrentTab}
     */
    setShowIdentitiesCurrentTab(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.showIdentitiesCurrentTabState.update(() => value);
        });
    }
    /**
     * {@link VaultSettingsServiceAbstraction.setEnablePasskeys}
     */
    setEnablePasskeys(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enablePasskeysState.update(() => value);
        });
    }
}
exports.VaultSettingsService = VaultSettingsService;
//# sourceMappingURL=vault-settings.service.js.map