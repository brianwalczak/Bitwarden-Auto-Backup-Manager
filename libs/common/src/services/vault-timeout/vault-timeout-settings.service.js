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
exports.VaultTimeoutSettingsService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../admin-console/enums");
const vault_timeout_action_enum_1 = require("../../enums/vault-timeout-action.enum");
const vault_timeout_type_1 = require("../../types/vault-timeout.type");
const vault_timeout_settings_state_1 = require("./vault-timeout-settings.state");
class VaultTimeoutSettingsService {
    constructor(accountService, pinService, userDecryptionOptionsService, cryptoService, tokenService, policyService, biometricStateService, stateProvider, logService, defaultVaultTimeout) {
        this.accountService = accountService;
        this.pinService = pinService;
        this.userDecryptionOptionsService = userDecryptionOptionsService;
        this.cryptoService = cryptoService;
        this.tokenService = tokenService;
        this.policyService = policyService;
        this.biometricStateService = biometricStateService;
        this.stateProvider = stateProvider;
        this.logService = logService;
        this.defaultVaultTimeout = defaultVaultTimeout;
    }
    setVaultTimeoutOptions(userId, timeout, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User id required. Cannot set vault timeout settings.");
            }
            if (timeout == null) {
                throw new Error("Vault Timeout cannot be null.");
            }
            if (action == null) {
                throw new Error("Vault Timeout Action cannot be null.");
            }
            // We swap these tokens from being on disk for lock actions, and in memory for logout actions
            // Get them here to set them to their new location after changing the timeout action and clearing if needed
            const accessToken = yield this.tokenService.getAccessToken();
            const refreshToken = yield this.tokenService.getRefreshToken();
            const clientId = yield this.tokenService.getClientId();
            const clientSecret = yield this.tokenService.getClientSecret();
            yield this.setVaultTimeout(userId, timeout);
            if (timeout != vault_timeout_type_1.VaultTimeoutStringType.Never && action === vault_timeout_action_enum_1.VaultTimeoutAction.LogOut) {
                // if we have a vault timeout and the action is log out, reset tokens
                // as the tokens were stored on disk and now should be stored in memory
                yield this.tokenService.clearTokens();
            }
            yield this.setVaultTimeoutAction(userId, action);
            yield this.tokenService.setTokens(accessToken, action, timeout, refreshToken, [
                clientId,
                clientSecret,
            ]);
            yield this.cryptoService.refreshAdditionalKeys();
        });
    }
    availableVaultTimeoutActions$(userId) {
        return (0, rxjs_1.defer)(() => this.getAvailableVaultTimeoutActions(userId));
    }
    isBiometricLockSet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const biometricUnlockPromise = userId == null
                ? (0, rxjs_1.firstValueFrom)(this.biometricStateService.biometricUnlockEnabled$)
                : this.biometricStateService.getBiometricUnlockEnabled(userId);
            return yield biometricUnlockPromise;
        });
    }
    setVaultTimeout(userId, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User id required. Cannot set vault timeout.");
            }
            if (timeout == null) {
                throw new Error("Vault Timeout cannot be null.");
            }
            yield this.stateProvider.setUserState(vault_timeout_settings_state_1.VAULT_TIMEOUT, timeout, userId);
        });
    }
    getVaultTimeoutByUserId$(userId) {
        if (!userId) {
            throw new Error("User id required. Cannot get vault timeout.");
        }
        return (0, rxjs_1.combineLatest)([
            this.stateProvider.getUserState$(vault_timeout_settings_state_1.VAULT_TIMEOUT, userId),
            this.getMaxVaultTimeoutPolicyByUserId$(userId),
        ]).pipe((0, rxjs_1.switchMap)(([currentVaultTimeout, maxVaultTimeoutPolicy]) => {
            return (0, rxjs_1.from)(this.determineVaultTimeout(currentVaultTimeout, maxVaultTimeoutPolicy)).pipe((0, rxjs_1.tap)((vaultTimeout) => {
                // As a side effect, set the new value determined by determineVaultTimeout into state if it's different from the current
                if (vaultTimeout !== currentVaultTimeout) {
                    return this.stateProvider.setUserState(vault_timeout_settings_state_1.VAULT_TIMEOUT, vaultTimeout, userId);
                }
            }), (0, rxjs_1.catchError)((error) => {
                // Protect outer observable from canceling on error by catching and returning EMPTY
                this.logService.error(`Error getting vault timeout: ${error}`);
                return rxjs_1.EMPTY;
            }));
        }), (0, rxjs_1.distinctUntilChanged)(), // Avoid having the set side effect trigger a new emission of the same action
        (0, rxjs_1.shareReplay)({ refCount: true, bufferSize: 1 }));
    }
    determineVaultTimeout(currentVaultTimeout, maxVaultTimeoutPolicy) {
        return __awaiter(this, void 0, void 0, function* () {
            // if current vault timeout is null, apply the client specific default
            currentVaultTimeout = currentVaultTimeout !== null && currentVaultTimeout !== void 0 ? currentVaultTimeout : this.defaultVaultTimeout;
            // If no policy applies, return the current vault timeout
            if (!maxVaultTimeoutPolicy) {
                return currentVaultTimeout;
            }
            // User is subject to a max vault timeout policy
            const maxVaultTimeoutPolicyData = maxVaultTimeoutPolicy.data;
            // If the current vault timeout is not numeric, change it to the policy compliant value
            if (typeof currentVaultTimeout === "string") {
                return maxVaultTimeoutPolicyData.minutes;
            }
            // For numeric vault timeouts, ensure they are smaller than maximum allowed value according to policy
            const policyCompliantTimeout = Math.min(currentVaultTimeout, maxVaultTimeoutPolicyData.minutes);
            return policyCompliantTimeout;
        });
    }
    setVaultTimeoutAction(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User id required. Cannot set vault timeout action.");
            }
            if (!action) {
                throw new Error("Vault Timeout Action cannot be null");
            }
            yield this.stateProvider.setUserState(vault_timeout_settings_state_1.VAULT_TIMEOUT_ACTION, action, userId);
        });
    }
    getVaultTimeoutActionByUserId$(userId) {
        if (!userId) {
            throw new Error("User id required. Cannot get vault timeout action.");
        }
        return (0, rxjs_1.combineLatest)([
            this.stateProvider.getUserState$(vault_timeout_settings_state_1.VAULT_TIMEOUT_ACTION, userId),
            this.getMaxVaultTimeoutPolicyByUserId$(userId),
        ]).pipe((0, rxjs_1.switchMap)(([currentVaultTimeoutAction, maxVaultTimeoutPolicy]) => {
            return (0, rxjs_1.from)(this.determineVaultTimeoutAction(userId, currentVaultTimeoutAction, maxVaultTimeoutPolicy)).pipe((0, rxjs_1.tap)((vaultTimeoutAction) => {
                // As a side effect, set the new value determined by determineVaultTimeout into state if it's different from the current
                // We want to avoid having a null timeout action always so we set it to the default if it is null
                // and if the user becomes subject to a policy that requires a specific action, we set it to that
                if (vaultTimeoutAction !== currentVaultTimeoutAction) {
                    return this.stateProvider.setUserState(vault_timeout_settings_state_1.VAULT_TIMEOUT_ACTION, vaultTimeoutAction, userId);
                }
            }), (0, rxjs_1.catchError)((error) => {
                // Protect outer observable from canceling on error by catching and returning EMPTY
                this.logService.error(`Error getting vault timeout: ${error}`);
                return rxjs_1.EMPTY;
            }));
        }), (0, rxjs_1.distinctUntilChanged)(), // Avoid having the set side effect trigger a new emission of the same action
        (0, rxjs_1.shareReplay)({ refCount: true, bufferSize: 1 }));
    }
    determineVaultTimeoutAction(userId, currentVaultTimeoutAction, maxVaultTimeoutPolicy) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const availableVaultTimeoutActions = yield this.getAvailableVaultTimeoutActions(userId);
            if (availableVaultTimeoutActions.length === 1) {
                return availableVaultTimeoutActions[0];
            }
            if (((_a = maxVaultTimeoutPolicy === null || maxVaultTimeoutPolicy === void 0 ? void 0 : maxVaultTimeoutPolicy.data) === null || _a === void 0 ? void 0 : _a.action) &&
                availableVaultTimeoutActions.includes(maxVaultTimeoutPolicy.data.action)) {
                // return policy defined vault timeout action
                return maxVaultTimeoutPolicy.data.action;
            }
            // No policy applies from here on
            // If the current vault timeout is null and lock is an option, set it as the default
            if (currentVaultTimeoutAction == null &&
                availableVaultTimeoutActions.includes(vault_timeout_action_enum_1.VaultTimeoutAction.Lock)) {
                return vault_timeout_action_enum_1.VaultTimeoutAction.Lock;
            }
            return currentVaultTimeoutAction;
        });
    }
    getMaxVaultTimeoutPolicyByUserId$(userId) {
        if (!userId) {
            throw new Error("User id required. Cannot get max vault timeout policy.");
        }
        return this.policyService
            .getAll$(enums_1.PolicyType.MaximumVaultTimeout, userId)
            .pipe((0, rxjs_1.map)((policies) => { var _a; return (_a = policies[0]) !== null && _a !== void 0 ? _a : null; }));
    }
    getAvailableVaultTimeoutActions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            userId !== null && userId !== void 0 ? userId : (userId = (_a = (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$))) === null || _a === void 0 ? void 0 : _a.id);
            const availableActions = [vault_timeout_action_enum_1.VaultTimeoutAction.LogOut];
            const canLock = (yield this.userHasMasterPassword(userId)) ||
                (yield this.pinService.isPinSet(userId)) ||
                (yield this.isBiometricLockSet(userId));
            if (canLock) {
                availableActions.push(vault_timeout_action_enum_1.VaultTimeoutAction.Lock);
            }
            return availableActions;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cryptoService.clearPinKeys(userId);
        });
    }
    userHasMasterPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                const decryptionOptions = yield (0, rxjs_1.firstValueFrom)(this.userDecryptionOptionsService.userDecryptionOptionsById$(userId));
                return !!(decryptionOptions === null || decryptionOptions === void 0 ? void 0 : decryptionOptions.hasMasterPassword);
            }
            else {
                return yield (0, rxjs_1.firstValueFrom)(this.userDecryptionOptionsService.hasMasterPassword$);
            }
        });
    }
}
exports.VaultTimeoutSettingsService = VaultTimeoutSettingsService;
//# sourceMappingURL=vault-timeout-settings.service.js.map