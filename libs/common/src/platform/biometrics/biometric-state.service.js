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
exports.DefaultBiometricStateService = exports.BiometricStateService = void 0;
const rxjs_1 = require("rxjs");
const enc_string_1 = require("../models/domain/enc-string");
const biometric_state_1 = require("./biometric.state");
class BiometricStateService {
}
exports.BiometricStateService = BiometricStateService;
class DefaultBiometricStateService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.biometricUnlockEnabledState = this.stateProvider.getActive(biometric_state_1.BIOMETRIC_UNLOCK_ENABLED);
        this.biometricUnlockEnabled$ = this.biometricUnlockEnabledState.state$.pipe((0, rxjs_1.map)(Boolean));
        this.requirePasswordOnStartState = this.stateProvider.getActive(biometric_state_1.REQUIRE_PASSWORD_ON_START);
        this.requirePasswordOnStart$ = this.requirePasswordOnStartState.state$.pipe((0, rxjs_1.map)((value) => !!value));
        this.encryptedClientKeyHalfState = this.stateProvider.getActive(biometric_state_1.ENCRYPTED_CLIENT_KEY_HALF);
        this.encryptedClientKeyHalf$ = this.encryptedClientKeyHalfState.state$.pipe((0, rxjs_1.map)(encryptedClientKeyHalfToEncString));
        this.dismissedRequirePasswordOnStartCalloutState = this.stateProvider.getActive(biometric_state_1.DISMISSED_REQUIRE_PASSWORD_ON_START_CALLOUT);
        this.dismissedRequirePasswordOnStartCallout$ =
            this.dismissedRequirePasswordOnStartCalloutState.state$.pipe((0, rxjs_1.map)(Boolean));
        this.promptCancelledState = this.stateProvider.getGlobal(biometric_state_1.PROMPT_CANCELLED);
        this.promptCancelled$ = (0, rxjs_1.combineLatest)([
            this.stateProvider.activeUserId$,
            this.promptCancelledState.state$,
        ]).pipe((0, rxjs_1.map)(([userId, record]) => {
            var _a;
            return (_a = record === null || record === void 0 ? void 0 : record[userId]) !== null && _a !== void 0 ? _a : false;
        }));
        this.promptAutomaticallyState = this.stateProvider.getActive(biometric_state_1.PROMPT_AUTOMATICALLY);
        this.promptAutomatically$ = this.promptAutomaticallyState.state$.pipe((0, rxjs_1.map)(Boolean));
        this.fingerprintValidatedState = this.stateProvider.getGlobal(biometric_state_1.FINGERPRINT_VALIDATED);
        this.fingerprintValidated$ = this.fingerprintValidatedState.state$.pipe((0, rxjs_1.map)(Boolean));
    }
    setBiometricUnlockEnabled(enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.biometricUnlockEnabledState.update(() => enabled);
        });
    }
    getBiometricUnlockEnabled(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUser(userId, biometric_state_1.BIOMETRIC_UNLOCK_ENABLED).state$.pipe((0, rxjs_1.map)(Boolean)));
        });
    }
    setRequirePasswordOnStart(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentActiveId;
            yield this.requirePasswordOnStartState.update((_, [userId]) => {
                currentActiveId = userId;
                return value;
            }, {
                combineLatestWith: this.requirePasswordOnStartState.combinedState$,
            });
            if (!value) {
                yield this.removeEncryptedClientKeyHalf(currentActiveId);
            }
        });
    }
    setEncryptedClientKeyHalf(encryptedKeyHalf, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const value = (_a = encryptedKeyHalf === null || encryptedKeyHalf === void 0 ? void 0 : encryptedKeyHalf.encryptedString) !== null && _a !== void 0 ? _a : null;
            if (userId) {
                yield this.stateProvider.getUser(userId, biometric_state_1.ENCRYPTED_CLIENT_KEY_HALF).update(() => value);
            }
            else {
                yield this.encryptedClientKeyHalfState.update(() => value);
            }
        });
    }
    removeEncryptedClientKeyHalf(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.getUser(userId, biometric_state_1.ENCRYPTED_CLIENT_KEY_HALF).update(() => null);
        });
    }
    getRequirePasswordOnStart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUser(userId, biometric_state_1.REQUIRE_PASSWORD_ON_START).state$));
        });
    }
    getEncryptedClientKeyHalf(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.stateProvider
                .getUser(userId, biometric_state_1.ENCRYPTED_CLIENT_KEY_HALF)
                .state$.pipe((0, rxjs_1.map)(encryptedClientKeyHalfToEncString)));
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.getUser(userId, biometric_state_1.ENCRYPTED_CLIENT_KEY_HALF).update(() => null);
            yield this.resetUserPromptCancelled(userId);
            // Persist auto prompt setting through logout
            // Persist dismissed require password on start callout through logout
        });
    }
    setDismissedRequirePasswordOnStartCallout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dismissedRequirePasswordOnStartCalloutState.update(() => true);
        });
    }
    resetUserPromptCancelled(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.getGlobal(biometric_state_1.PROMPT_CANCELLED).update((data, activeUserId) => {
                delete data[userId !== null && userId !== void 0 ? userId : activeUserId];
                return data;
            }, {
                combineLatestWith: this.stateProvider.activeUserId$,
                shouldUpdate: (data, activeUserId) => (data === null || data === void 0 ? void 0 : data[userId !== null && userId !== void 0 ? userId : activeUserId]) != null,
            });
        });
    }
    setUserPromptCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.promptCancelledState.update((record, userId) => {
                record !== null && record !== void 0 ? record : (record = {});
                record[userId] = true;
                return record;
            }, {
                combineLatestWith: this.stateProvider.activeUserId$,
                shouldUpdate: (_, userId) => {
                    if (userId == null) {
                        throw new Error("Cannot update biometric prompt cancelled state without an active user");
                    }
                    return true;
                },
            });
        });
    }
    resetAllPromptCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.promptCancelledState.update(() => null);
        });
    }
    setPromptAutomatically(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.promptAutomaticallyState.update(() => prompt);
        });
    }
    setFingerprintValidated(validated) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fingerprintValidatedState.update(() => validated);
        });
    }
}
exports.DefaultBiometricStateService = DefaultBiometricStateService;
function encryptedClientKeyHalfToEncString(encryptedKeyHalf) {
    return encryptedKeyHalf == null ? null : new enc_string_1.EncString(encryptedKeyHalf);
}
//# sourceMappingURL=biometric-state.service.js.map