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
exports.AutofillSettingsService = exports.AutofillSettingsServiceAbstraction = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../admin-console/enums");
const state_1 = require("../../platform/state");
const constants_1 = require("../constants");
const AUTOFILL_ON_PAGE_LOAD = new state_1.UserKeyDefinition(state_1.AUTOFILL_SETTINGS_DISK, "autofillOnPageLoad", {
    deserializer: (value) => value !== null && value !== void 0 ? value : false,
    clearOn: [],
});
const AUTOFILL_ON_PAGE_LOAD_DEFAULT = new state_1.UserKeyDefinition(state_1.AUTOFILL_SETTINGS_DISK, "autofillOnPageLoadDefault", {
    deserializer: (value) => value !== null && value !== void 0 ? value : false,
    clearOn: [],
});
const AUTOFILL_ON_PAGE_LOAD_CALLOUT_DISMISSED = new state_1.UserKeyDefinition(state_1.AUTOFILL_SETTINGS_DISK, "autofillOnPageLoadCalloutIsDismissed", {
    deserializer: (value) => value !== null && value !== void 0 ? value : false,
    clearOn: [],
});
const AUTOFILL_ON_PAGE_LOAD_POLICY_TOAST_HAS_DISPLAYED = new state_1.UserKeyDefinition(state_1.AUTOFILL_SETTINGS_DISK, "autofillOnPageLoadPolicyToastHasDisplayed", {
    deserializer: (value) => value !== null && value !== void 0 ? value : false,
    clearOn: [],
});
const AUTO_COPY_TOTP = new state_1.UserKeyDefinition(state_1.AUTOFILL_SETTINGS_DISK, "autoCopyTotp", {
    deserializer: (value) => value !== null && value !== void 0 ? value : true,
    clearOn: [],
});
const INLINE_MENU_VISIBILITY = new state_1.KeyDefinition(state_1.AUTOFILL_SETTINGS_DISK_LOCAL, "inlineMenuVisibility", {
    deserializer: (value) => value !== null && value !== void 0 ? value : constants_1.AutofillOverlayVisibility.Off,
});
const ENABLE_CONTEXT_MENU = new state_1.KeyDefinition(state_1.AUTOFILL_SETTINGS_DISK, "enableContextMenu", {
    deserializer: (value) => value !== null && value !== void 0 ? value : true,
});
const CLEAR_CLIPBOARD_DELAY = new state_1.UserKeyDefinition(state_1.AUTOFILL_SETTINGS_DISK_LOCAL, "clearClipboardDelay", {
    deserializer: (value) => value !== null && value !== void 0 ? value : constants_1.ClearClipboardDelay.Never,
    clearOn: [],
});
class AutofillSettingsServiceAbstraction {
}
exports.AutofillSettingsServiceAbstraction = AutofillSettingsServiceAbstraction;
class AutofillSettingsService {
    constructor(stateProvider, policyService) {
        this.stateProvider = stateProvider;
        this.policyService = policyService;
        this.autofillOnPageLoadState = this.stateProvider.getActive(AUTOFILL_ON_PAGE_LOAD);
        this.autofillOnPageLoad$ = this.autofillOnPageLoadState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : false));
        this.autofillOnPageLoadDefaultState = this.stateProvider.getActive(AUTOFILL_ON_PAGE_LOAD_DEFAULT);
        this.autofillOnPageLoadDefault$ = this.autofillOnPageLoadDefaultState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.autofillOnPageLoadCalloutIsDismissedState = this.stateProvider.getActive(AUTOFILL_ON_PAGE_LOAD_CALLOUT_DISMISSED);
        this.autofillOnPageLoadCalloutIsDismissed$ =
            this.autofillOnPageLoadCalloutIsDismissedState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : false));
        this.activateAutofillOnPageLoadFromPolicy$ = this.policyService.policyAppliesToActiveUser$(enums_1.PolicyType.ActivateAutofill);
        this.autofillOnPageLoadPolicyToastHasDisplayedState = this.stateProvider.getActive(AUTOFILL_ON_PAGE_LOAD_POLICY_TOAST_HAS_DISPLAYED);
        this.autofillOnPageLoadPolicyToastHasDisplayed$ = this.autofillOnPageLoadState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : false));
        this.autoCopyTotpState = this.stateProvider.getActive(AUTO_COPY_TOTP);
        this.autoCopyTotp$ = this.autoCopyTotpState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.inlineMenuVisibilityState = this.stateProvider.getGlobal(INLINE_MENU_VISIBILITY);
        this.inlineMenuVisibility$ = this.inlineMenuVisibilityState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : constants_1.AutofillOverlayVisibility.Off));
        this.enableContextMenuState = this.stateProvider.getGlobal(ENABLE_CONTEXT_MENU);
        this.enableContextMenu$ = this.enableContextMenuState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
        this.clearClipboardDelayState = this.stateProvider.getActive(CLEAR_CLIPBOARD_DELAY);
        this.clearClipboardDelay$ = this.clearClipboardDelayState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : constants_1.ClearClipboardDelay.Never));
    }
    setAutofillOnPageLoad(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autofillOnPageLoadState.update(() => newValue);
        });
    }
    setAutofillOnPageLoadDefault(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autofillOnPageLoadDefaultState.update(() => newValue);
        });
    }
    setAutofillOnPageLoadCalloutIsDismissed(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autofillOnPageLoadCalloutIsDismissedState.update(() => newValue);
        });
    }
    setAutofillOnPageLoadPolicyToastHasDisplayed(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autofillOnPageLoadPolicyToastHasDisplayedState.update(() => newValue);
        });
    }
    setAutoCopyTotp(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autoCopyTotpState.update(() => newValue);
        });
    }
    setInlineMenuVisibility(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inlineMenuVisibilityState.update(() => newValue);
        });
    }
    setEnableContextMenu(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enableContextMenuState.update(() => newValue);
        });
    }
    setClearClipboardDelay(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clearClipboardDelayState.update(() => newValue);
        });
    }
}
exports.AutofillSettingsService = AutofillSettingsService;
//# sourceMappingURL=autofill-settings.service.js.map