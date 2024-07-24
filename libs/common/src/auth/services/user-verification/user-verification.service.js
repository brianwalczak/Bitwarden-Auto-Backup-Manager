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
exports.UserVerificationService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../../platform/enums");
const key_suffix_options_enum_1 = require("../../../platform/enums/key-suffix-options.enum");
const verification_type_1 = require("../../enums/verification-type");
const secret_verification_request_1 = require("../../models/request/secret-verification.request");
const verify_otp_request_1 = require("../../models/request/verify-otp.request");
const verification_1 = require("../../types/verification");
/**
 * Used for general-purpose user verification throughout the app.
 * Use it to verify the input collected by UserVerificationComponent.
 */
class UserVerificationService {
    constructor(cryptoService, accountService, masterPasswordService, i18nService, userVerificationApiService, userDecryptionOptionsService, pinService, logService, vaultTimeoutSettingsService, platformUtilsService, kdfConfigService) {
        this.cryptoService = cryptoService;
        this.accountService = accountService;
        this.masterPasswordService = masterPasswordService;
        this.i18nService = i18nService;
        this.userVerificationApiService = userVerificationApiService;
        this.userDecryptionOptionsService = userDecryptionOptionsService;
        this.pinService = pinService;
        this.logService = logService;
        this.vaultTimeoutSettingsService = vaultTimeoutSettingsService;
        this.platformUtilsService = platformUtilsService;
        this.kdfConfigService = kdfConfigService;
    }
    getAvailableVerificationOptions(verificationType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$))) === null || _a === void 0 ? void 0 : _a.id;
            if (verificationType === "client") {
                const [userHasMasterPassword, pinLockType, biometricsLockSet, biometricsUserKeyStored] = yield Promise.all([
                    this.hasMasterPasswordAndMasterKeyHash(userId),
                    this.pinService.getPinLockType(userId),
                    this.vaultTimeoutSettingsService.isBiometricLockSet(userId),
                    this.cryptoService.hasUserKeyStored(key_suffix_options_enum_1.KeySuffixOptions.Biometric, userId),
                ]);
                // note: we do not need to check this.platformUtilsService.supportsBiometric() because
                // we can just use the logic below which works for both desktop & the browser extension.
                return {
                    client: {
                        masterPassword: userHasMasterPassword,
                        pin: pinLockType !== "DISABLED",
                        biometrics: biometricsLockSet &&
                            (biometricsUserKeyStored || !this.platformUtilsService.supportsSecureStorage()),
                    },
                    server: {
                        masterPassword: false,
                        otp: false,
                    },
                };
            }
            else {
                // server
                // Don't check if have MP hash locally, because we are going to send the secret to the server to be verified.
                const userHasMasterPassword = yield this.hasMasterPassword(userId);
                return {
                    client: {
                        masterPassword: false,
                        pin: false,
                        biometrics: false,
                    },
                    server: { masterPassword: userHasMasterPassword, otp: !userHasMasterPassword },
                };
            }
        });
    }
    buildRequest(verification, requestClass, alreadyHashed) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateSecretInput(verification);
            const request = requestClass != null ? new requestClass() : new secret_verification_request_1.SecretVerificationRequest();
            if (verification.type === verification_type_1.VerificationType.OTP) {
                request.otp = verification.secret;
            }
            else {
                const [userId, email] = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => [a === null || a === void 0 ? void 0 : a.id, a === null || a === void 0 ? void 0 : a.email])));
                let masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId));
                if (!masterKey && !alreadyHashed) {
                    masterKey = yield this.cryptoService.makeMasterKey(verification.secret, email, yield this.kdfConfigService.getKdfConfig());
                }
                request.masterPasswordHash = alreadyHashed
                    ? verification.secret
                    : yield this.cryptoService.hashMasterKey(verification.secret, masterKey);
            }
            return request;
        });
    }
    verifyUser(verification) {
        return __awaiter(this, void 0, void 0, function* () {
            if (verification == null) {
                throw new Error("Verification is required.");
            }
            const [userId, email] = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => [a === null || a === void 0 ? void 0 : a.id, a === null || a === void 0 ? void 0 : a.email])));
            if ((0, verification_1.verificationHasSecret)(verification)) {
                this.validateSecretInput(verification);
            }
            switch (verification.type) {
                case verification_type_1.VerificationType.OTP:
                    return this.verifyUserByOTP(verification);
                case verification_type_1.VerificationType.MasterPassword:
                    yield this.verifyUserByMasterPassword(verification, userId, email);
                    return true;
                case verification_type_1.VerificationType.PIN:
                    return this.verifyUserByPIN(verification, userId);
                case verification_type_1.VerificationType.Biometrics:
                    return this.verifyUserByBiometrics();
                default: {
                    // Compile-time check for exhaustive switch
                    const _exhaustiveCheck = verification;
                    return _exhaustiveCheck;
                }
            }
        });
    }
    verifyUserByOTP(verification) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new verify_otp_request_1.VerifyOTPRequest(verification.secret);
            try {
                yield this.userVerificationApiService.postAccountVerifyOTP(request);
            }
            catch (e) {
                throw new Error(this.i18nService.t("invalidVerificationCode"));
            }
            return true;
        });
    }
    verifyUserByMasterPassword(verification, userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!verification.secret) {
                throw new Error("Master Password is required. Cannot verify user without a master password.");
            }
            if (!userId) {
                throw new Error("User ID is required. Cannot verify user by master password.");
            }
            if (!email) {
                throw new Error("Email is required. Cannot verify user by master password.");
            }
            const kdfConfig = yield this.kdfConfigService.getKdfConfig();
            if (!kdfConfig) {
                throw new Error("KDF config is required. Cannot verify user by master password.");
            }
            let masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId));
            if (!masterKey) {
                masterKey = yield this.cryptoService.makeMasterKey(verification.secret, email, kdfConfig);
            }
            if (!masterKey) {
                throw new Error("Master key could not be created to verify the master password.");
            }
            let policyOptions;
            // Client-side verification
            if (yield this.hasMasterPasswordAndMasterKeyHash(userId)) {
                const passwordValid = yield this.cryptoService.compareAndUpdateKeyHash(verification.secret, masterKey);
                if (!passwordValid) {
                    throw new Error(this.i18nService.t("invalidMasterPassword"));
                }
                policyOptions = null;
            }
            else {
                // Server-side verification
                const request = new secret_verification_request_1.SecretVerificationRequest();
                const serverKeyHash = yield this.cryptoService.hashMasterKey(verification.secret, masterKey, enums_1.HashPurpose.ServerAuthorization);
                request.masterPasswordHash = serverKeyHash;
                try {
                    policyOptions = yield this.userVerificationApiService.postAccountVerifyPassword(request);
                }
                catch (e) {
                    throw new Error(this.i18nService.t("invalidMasterPassword"));
                }
            }
            const localKeyHash = yield this.cryptoService.hashMasterKey(verification.secret, masterKey, enums_1.HashPurpose.LocalAuthorization);
            yield this.masterPasswordService.setMasterKeyHash(localKeyHash, userId);
            yield this.masterPasswordService.setMasterKey(masterKey, userId);
            return { policyOptions, masterKey };
        });
    }
    verifyUserByPIN(verification, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User ID is required. Cannot verify user by PIN.");
            }
            const userKey = yield this.pinService.decryptUserKeyWithPin(verification.secret, userId);
            return userKey != null;
        });
    }
    verifyUserByBiometrics() {
        return __awaiter(this, void 0, void 0, function* () {
            let userKey;
            // Biometrics crashes and doesn't return a value if the user cancels the prompt
            try {
                userKey = yield this.cryptoService.getUserKeyFromStorage(key_suffix_options_enum_1.KeySuffixOptions.Biometric);
            }
            catch (e) {
                this.logService.error(`Biometrics User Verification failed: ${e.message}`);
                // So, any failures should be treated as a failed verification
                return false;
            }
            return userKey != null;
        });
    }
    requestOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userVerificationApiService.postAccountRequestOTP();
        });
    }
    hasMasterPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                const decryptionOptions = yield (0, rxjs_1.firstValueFrom)(this.userDecryptionOptionsService.userDecryptionOptionsById$(userId));
                if ((decryptionOptions === null || decryptionOptions === void 0 ? void 0 : decryptionOptions.hasMasterPassword) != undefined) {
                    return decryptionOptions.hasMasterPassword;
                }
            }
            return yield (0, rxjs_1.firstValueFrom)(this.userDecryptionOptionsService.hasMasterPassword$);
        });
    }
    hasMasterPasswordAndMasterKeyHash(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            userId !== null && userId !== void 0 ? userId : (userId = (_a = (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$))) === null || _a === void 0 ? void 0 : _a.id);
            return ((yield this.hasMasterPassword(userId)) &&
                (yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKeyHash$(userId))) != null);
        });
    }
    validateSecretInput(verification) {
        if ((verification === null || verification === void 0 ? void 0 : verification.secret) == null || verification.secret === "") {
            switch (verification.type) {
                case verification_type_1.VerificationType.OTP:
                    throw new Error(this.i18nService.t("verificationCodeRequired"));
                case verification_type_1.VerificationType.MasterPassword:
                    throw new Error(this.i18nService.t("masterPasswordRequired"));
                case verification_type_1.VerificationType.PIN:
                    throw new Error(this.i18nService.t("pinRequired"));
            }
        }
    }
}
exports.UserVerificationService = UserVerificationService;
//# sourceMappingURL=user-verification.service.js.map