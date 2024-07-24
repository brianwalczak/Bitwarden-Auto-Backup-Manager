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
exports.MoveBrowserSettingsToGlobal = void 0;
const migrator_1 = require("../migrator");
class MoveBrowserSettingsToGlobal extends migrator_1.Migrator {
    // Will first check if any of the accounts have a value from the given accountSelector
    // if they do have a value it will set that value into global state but if multiple
    // users have differing values it will prefer the false setting,
    // if all users have true then it will take true.
    tryAddSetting(accounts, accountSelector, globalSetter) {
        const hasValue = accounts.some(({ account }) => {
            return accountSelector(account) !== undefined;
        });
        if (hasValue) {
            const value = !accounts.some(({ account }) => {
                var _a;
                return ((_a = accountSelector(account)) !== null && _a !== void 0 ? _a : false) === false;
            });
            globalSetter(value);
        }
    }
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = yield helper.get("global");
            const accounts = yield helper.getAccounts();
            const globalNeverDomainsValue = accounts.reduce((accumulator, { account }) => {
                var _a, _b;
                const normalizedNeverDomains = (_b = (_a = account.settings) === null || _a === void 0 ? void 0 : _a.neverDomains) !== null && _b !== void 0 ? _b : {};
                for (const [id, value] of Object.entries(normalizedNeverDomains)) {
                    accumulator !== null && accumulator !== void 0 ? accumulator : (accumulator = {});
                    accumulator[id] = value;
                }
                return accumulator;
            }, undefined);
            const targetGlobalState = {};
            if (globalNeverDomainsValue != null) {
                targetGlobalState.neverDomains = globalNeverDomainsValue;
            }
            this.tryAddSetting(accounts, (a) => { var _a; return (_a = a.settings) === null || _a === void 0 ? void 0 : _a.disableAddLoginNotification; }, (v) => (targetGlobalState.disableAddLoginNotification = v));
            this.tryAddSetting(accounts, (a) => { var _a; return (_a = a.settings) === null || _a === void 0 ? void 0 : _a.disableChangedPasswordNotification; }, (v) => (targetGlobalState.disableChangedPasswordNotification = v));
            this.tryAddSetting(accounts, (a) => { var _a; return (_a = a.settings) === null || _a === void 0 ? void 0 : _a.disableContextMenuItem; }, (v) => (targetGlobalState.disableContextMenuItem = v));
            yield helper.set("global", Object.assign(Object.assign({}, global), targetGlobalState));
            yield Promise.all(accounts.map((_a) => __awaiter(this, [_a], void 0, function* ({ userId, account }) {
                var _b, _c, _d, _e;
                (_b = account.settings) === null || _b === void 0 ? true : delete _b.disableAddLoginNotification;
                (_c = account.settings) === null || _c === void 0 ? true : delete _c.disableChangedPasswordNotification;
                (_d = account.settings) === null || _d === void 0 ? true : delete _d.disableContextMenuItem;
                (_e = account.settings) === null || _e === void 0 ? true : delete _e.neverDomains;
                yield helper.set(userId, account);
            })));
        });
    }
    rollback(helper) {
        throw new Error("Method not implemented.");
    }
}
exports.MoveBrowserSettingsToGlobal = MoveBrowserSettingsToGlobal;
//# sourceMappingURL=9-move-browser-settings-to-global.js.map