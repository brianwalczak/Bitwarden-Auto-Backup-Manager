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
exports.BadgeSettingsService = exports.BadgeSettingsServiceAbstraction = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../platform/state");
const ENABLE_BADGE_COUNTER = new state_1.UserKeyDefinition(state_1.BADGE_SETTINGS_DISK, "enableBadgeCounter", {
    deserializer: (value) => value !== null && value !== void 0 ? value : true,
    clearOn: [],
});
class BadgeSettingsServiceAbstraction {
}
exports.BadgeSettingsServiceAbstraction = BadgeSettingsServiceAbstraction;
class BadgeSettingsService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.enableBadgeCounterState = this.stateProvider.getActive(ENABLE_BADGE_COUNTER);
        this.enableBadgeCounter$ = this.enableBadgeCounterState.state$.pipe((0, rxjs_1.map)((x) => x !== null && x !== void 0 ? x : true));
    }
    setEnableBadgeCounter(newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enableBadgeCounterState.update(() => newValue);
        });
    }
}
exports.BadgeSettingsService = BadgeSettingsService;
//# sourceMappingURL=badge-settings.service.js.map