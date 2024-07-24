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
exports.DeviceTrustService = exports.SHOULD_TRUST_DEVICE = exports.DEVICE_KEY = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../platform/enums");
const symmetric_crypto_key_1 = require("../../platform/models/domain/symmetric-crypto-key");
const state_1 = require("../../platform/state");
const secret_verification_request_1 = require("../models/request/secret-verification.request");
const update_devices_trust_request_1 = require("../models/request/update-devices-trust.request");
/** Uses disk storage so that the device key can persist after log out and tab removal. */
exports.DEVICE_KEY = new state_1.UserKeyDefinition(state_1.DEVICE_TRUST_DISK_LOCAL, "deviceKey", {
    deserializer: (deviceKey) => deviceKey ? symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(deviceKey) : null,
    clearOn: [], // Device key is needed to log back into device, so we can't clear it automatically during lock or logout
});
/** Uses disk storage so that the shouldTrustDevice bool can persist across login. */
exports.SHOULD_TRUST_DEVICE = new state_1.UserKeyDefinition(state_1.DEVICE_TRUST_DISK_LOCAL, "shouldTrustDevice", {
    deserializer: (shouldTrustDevice) => shouldTrustDevice,
    clearOn: [], // Need to preserve the user setting, so we can't clear it automatically during lock or logout
});
class DeviceTrustService {
    constructor(keyGenerationService, cryptoFunctionService, cryptoService, encryptService, appIdService, devicesApiService, i18nService, platformUtilsService, stateProvider, secureStorageService, userDecryptionOptionsService, logService) {
        this.keyGenerationService = keyGenerationService;
        this.cryptoFunctionService = cryptoFunctionService;
        this.cryptoService = cryptoService;
        this.encryptService = encryptService;
        this.appIdService = appIdService;
        this.devicesApiService = devicesApiService;
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
        this.stateProvider = stateProvider;
        this.secureStorageService = secureStorageService;
        this.userDecryptionOptionsService = userDecryptionOptionsService;
        this.logService = logService;
        this.platformSupportsSecureStorage = this.platformUtilsService.supportsSecureStorage();
        this.deviceKeySecureStorageKey = "_deviceKey";
        this.supportsDeviceTrust$ = this.userDecryptionOptionsService.userDecryptionOptions$.pipe((0, rxjs_1.map)((options) => { var _a; return (_a = (options === null || options === void 0 ? void 0 : options.trustedDeviceOption) != null) !== null && _a !== void 0 ? _a : false; }));
    }
    /**
     * @description Retrieves the users choice to trust the device which can only happen after decryption
     * Note: this value should only be used once and then reset
     */
    getShouldTrustDevice(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot get should trust device.");
            }
            const shouldTrustDevice = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUserState$(exports.SHOULD_TRUST_DEVICE, userId));
            return shouldTrustDevice;
        });
    }
    setShouldTrustDevice(userId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot set should trust device.");
            }
            yield this.stateProvider.setUserState(exports.SHOULD_TRUST_DEVICE, value, userId);
        });
    }
    trustDeviceIfRequired(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot trust device if required.");
            }
            const shouldTrustDevice = yield this.getShouldTrustDevice(userId);
            if (shouldTrustDevice) {
                yield this.trustDevice(userId);
                // reset the trust choice
                yield this.setShouldTrustDevice(userId, null);
            }
        });
    }
    trustDevice(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot trust device.");
            }
            // Attempt to get user key
            const userKey = yield this.cryptoService.getUserKey(userId);
            // If user key is not found, throw error
            if (!userKey) {
                throw new Error("User symmetric key not found");
            }
            // Generate deviceKey
            const deviceKey = yield this.makeDeviceKey();
            // Generate asymmetric RSA key pair: devicePrivateKey, devicePublicKey
            const [devicePublicKey, devicePrivateKey] = yield this.cryptoFunctionService.rsaGenerateKeyPair(2048);
            const [devicePublicKeyEncryptedUserKey, userKeyEncryptedDevicePublicKey, deviceKeyEncryptedDevicePrivateKey,] = yield Promise.all([
                // Encrypt user key with the DevicePublicKey
                this.cryptoService.rsaEncrypt(userKey.key, devicePublicKey),
                // Encrypt devicePublicKey with user key
                this.encryptService.encrypt(devicePublicKey, userKey),
                // Encrypt devicePrivateKey with deviceKey
                this.encryptService.encrypt(devicePrivateKey, deviceKey),
            ]);
            // Send encrypted keys to server
            const deviceIdentifier = yield this.appIdService.getAppId();
            const deviceResponse = yield this.devicesApiService.updateTrustedDeviceKeys(deviceIdentifier, devicePublicKeyEncryptedUserKey.encryptedString, userKeyEncryptedDevicePublicKey.encryptedString, deviceKeyEncryptedDevicePrivateKey.encryptedString);
            // store device key in local/secure storage if enc keys posted to server successfully
            yield this.setDeviceKey(userId, deviceKey);
            this.platformUtilsService.showToast("success", null, this.i18nService.t("deviceTrusted"));
            return deviceResponse;
        });
    }
    rotateDevicesTrust(userId, newUserKey, masterPasswordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot rotate device's trust.");
            }
            const currentDeviceKey = yield this.getDeviceKey(userId);
            if (currentDeviceKey == null) {
                // If the current device doesn't have a device key available to it, then we can't
                // rotate any trust at all, so early return.
                return;
            }
            // At this point of rotating their keys, they should still have their old user key in state
            const oldUserKey = yield (0, rxjs_1.firstValueFrom)(this.cryptoService.userKey$(userId));
            const deviceIdentifier = yield this.appIdService.getAppId();
            const secretVerificationRequest = new secret_verification_request_1.SecretVerificationRequest();
            secretVerificationRequest.masterPasswordHash = masterPasswordHash;
            // Get the keys that are used in rotating a devices keys from the server
            const currentDeviceKeys = yield this.devicesApiService.getDeviceKeys(deviceIdentifier, secretVerificationRequest);
            // Decrypt the existing device public key with the old user key
            const decryptedDevicePublicKey = yield this.encryptService.decryptToBytes(currentDeviceKeys.encryptedPublicKey, oldUserKey);
            // Encrypt the brand new user key with the now-decrypted public key for the device
            const encryptedNewUserKey = yield this.cryptoService.rsaEncrypt(newUserKey.key, decryptedDevicePublicKey);
            // Re-encrypt the device public key with the new user key
            const encryptedDevicePublicKey = yield this.encryptService.encrypt(decryptedDevicePublicKey, newUserKey);
            const currentDeviceUpdateRequest = new update_devices_trust_request_1.DeviceKeysUpdateRequest();
            currentDeviceUpdateRequest.encryptedUserKey = encryptedNewUserKey.encryptedString;
            currentDeviceUpdateRequest.encryptedPublicKey = encryptedDevicePublicKey.encryptedString;
            // TODO: For device management, allow this method to take an array of device ids that can be looped over and individually rotated
            // then it can be added to trustRequest.otherDevices.
            const trustRequest = new update_devices_trust_request_1.UpdateDevicesTrustRequest();
            trustRequest.masterPasswordHash = masterPasswordHash;
            trustRequest.currentDevice = currentDeviceUpdateRequest;
            trustRequest.otherDevices = [];
            yield this.devicesApiService.updateTrust(trustRequest, deviceIdentifier);
        });
    }
    getDeviceKey(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot get device key.");
            }
            try {
                if (this.platformSupportsSecureStorage) {
                    const deviceKeyB64 = yield this.secureStorageService.get(`${userId}${this.deviceKeySecureStorageKey}`, this.getSecureStorageOptions(userId));
                    const deviceKey = symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(deviceKeyB64);
                    return deviceKey;
                }
                const deviceKey = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUserState$(exports.DEVICE_KEY, userId));
                return deviceKey;
            }
            catch (e) {
                this.logService.error("Failed to get device key", e);
            }
        });
    }
    setDeviceKey(userId, deviceKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot set device key.");
            }
            try {
                if (this.platformSupportsSecureStorage) {
                    yield this.secureStorageService.save(`${userId}${this.deviceKeySecureStorageKey}`, deviceKey, this.getSecureStorageOptions(userId));
                    return;
                }
                yield this.stateProvider.setUserState(exports.DEVICE_KEY, deviceKey === null || deviceKey === void 0 ? void 0 : deviceKey.toJSON(), userId);
            }
            catch (e) {
                this.logService.error("Failed to set device key", e);
            }
        });
    }
    makeDeviceKey() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create 512-bit device key
            const deviceKey = (yield this.keyGenerationService.createKey(512));
            return deviceKey;
        });
    }
    decryptUserKeyWithDeviceKey(userId, encryptedDevicePrivateKey, encryptedUserKey, deviceKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("UserId is required. Cannot decrypt user key with device key.");
            }
            if (!deviceKey) {
                // User doesn't have a device key anymore so device is untrusted
                return null;
            }
            try {
                // attempt to decrypt encryptedDevicePrivateKey with device key
                const devicePrivateKey = yield this.encryptService.decryptToBytes(encryptedDevicePrivateKey, deviceKey);
                // Attempt to decrypt encryptedUserDataKey with devicePrivateKey
                const userKey = yield this.cryptoService.rsaDecrypt(encryptedUserKey.encryptedString, devicePrivateKey);
                return new symmetric_crypto_key_1.SymmetricCryptoKey(userKey);
            }
            catch (e) {
                // If either decryption effort fails, we want to remove the device key
                this.logService.error("Failed to decrypt using device key. Removing device key.");
                yield this.setDeviceKey(userId, null);
                return null;
            }
        });
    }
    getSecureStorageOptions(userId) {
        return {
            storageLocation: enums_1.StorageLocation.Disk,
            useSecureStorage: true,
            userId: userId,
        };
    }
}
exports.DeviceTrustService = DeviceTrustService;
//# sourceMappingURL=device-trust.service.implementation.js.map