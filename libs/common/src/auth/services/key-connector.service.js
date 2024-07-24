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
exports.KeyConnectorService = exports.CONVERT_ACCOUNT_TO_KEY_CONNECTOR = exports.USES_KEY_CONNECTOR = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../admin-console/enums");
const keys_request_1 = require("../../models/request/keys.request");
const kdf_type_enum_1 = require("../../platform/enums/kdf-type.enum");
const utils_1 = require("../../platform/misc/utils");
const symmetric_crypto_key_1 = require("../../platform/models/domain/symmetric-crypto-key");
const state_1 = require("../../platform/state");
const kdf_config_1 = require("../models/domain/kdf-config");
const key_connector_user_key_request_1 = require("../models/request/key-connector-user-key.request");
const set_key_connector_key_request_1 = require("../models/request/set-key-connector-key.request");
exports.USES_KEY_CONNECTOR = new state_1.UserKeyDefinition(state_1.KEY_CONNECTOR_DISK, "usesKeyConnector", {
    deserializer: (usesKeyConnector) => usesKeyConnector,
    clearOn: ["logout"],
});
exports.CONVERT_ACCOUNT_TO_KEY_CONNECTOR = new state_1.UserKeyDefinition(state_1.KEY_CONNECTOR_DISK, "convertAccountToKeyConnector", {
    deserializer: (convertAccountToKeyConnector) => convertAccountToKeyConnector,
    clearOn: ["logout"],
});
class KeyConnectorService {
    constructor(accountService, masterPasswordService, cryptoService, apiService, tokenService, logService, organizationService, keyGenerationService, logoutCallback, stateProvider) {
        this.accountService = accountService;
        this.masterPasswordService = masterPasswordService;
        this.cryptoService = cryptoService;
        this.apiService = apiService;
        this.tokenService = tokenService;
        this.logService = logService;
        this.organizationService = organizationService;
        this.keyGenerationService = keyGenerationService;
        this.logoutCallback = logoutCallback;
        this.stateProvider = stateProvider;
        this.usesKeyConnectorState = this.stateProvider.getActive(exports.USES_KEY_CONNECTOR);
        this.convertAccountToKeyConnectorState = this.stateProvider.getActive(exports.CONVERT_ACCOUNT_TO_KEY_CONNECTOR);
    }
    setUsesKeyConnector(usesKeyConnector) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usesKeyConnectorState.update(() => usesKeyConnector);
        });
    }
    getUsesKeyConnector() {
        return (0, rxjs_1.firstValueFrom)(this.usesKeyConnectorState.state$);
    }
    userNeedsMigration() {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedInUsingSso = yield this.tokenService.getIsExternal();
            const requiredByOrganization = (yield this.getManagingOrganization()) != null;
            const userIsNotUsingKeyConnector = !(yield this.getUsesKeyConnector());
            return loggedInUsingSso && requiredByOrganization && userIsNotUsingKeyConnector;
        });
    }
    migrateUser() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const organization = yield this.getManagingOrganization();
            const userId = (_a = (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$))) === null || _a === void 0 ? void 0 : _a.id;
            const masterKey = yield (0, rxjs_1.firstValueFrom)(this.masterPasswordService.masterKey$(userId));
            const keyConnectorRequest = new key_connector_user_key_request_1.KeyConnectorUserKeyRequest(masterKey.encKeyB64);
            try {
                yield this.apiService.postUserKeyToKeyConnector(organization.keyConnectorUrl, keyConnectorRequest);
            }
            catch (e) {
                this.handleKeyConnectorError(e);
            }
            yield this.apiService.postConvertToKeyConnector();
        });
    }
    // TODO: UserKey should be renamed to MasterKey and typed accordingly
    setMasterKeyFromUrl(url, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const masterKeyResponse = yield this.apiService.getMasterKeyFromKeyConnector(url);
                const keyArr = utils_1.Utils.fromB64ToArray(masterKeyResponse.key);
                const masterKey = new symmetric_crypto_key_1.SymmetricCryptoKey(keyArr);
                yield this.masterPasswordService.setMasterKey(masterKey, userId);
            }
            catch (e) {
                this.handleKeyConnectorError(e);
            }
        });
    }
    getManagingOrganization() {
        return __awaiter(this, void 0, void 0, function* () {
            const orgs = yield this.organizationService.getAll();
            return orgs.find((o) => o.keyConnectorEnabled &&
                o.type !== enums_1.OrganizationUserType.Admin &&
                o.type !== enums_1.OrganizationUserType.Owner &&
                !o.isProviderUser);
        });
    }
    convertNewSsoUserToKeyConnector(tokenResponse, orgId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // TODO: Remove after tokenResponse.keyConnectorUrl is deprecated in 2023.10 release (https://bitwarden.atlassian.net/browse/PM-3537)
            const { kdf, kdfIterations, kdfMemory, kdfParallelism, keyConnectorUrl: legacyKeyConnectorUrl, userDecryptionOptions, } = tokenResponse;
            const password = yield this.keyGenerationService.createKey(512);
            const kdfConfig = kdf === kdf_type_enum_1.KdfType.PBKDF2_SHA256
                ? new kdf_config_1.PBKDF2KdfConfig(kdfIterations)
                : new kdf_config_1.Argon2KdfConfig(kdfIterations, kdfMemory, kdfParallelism);
            const masterKey = yield this.cryptoService.makeMasterKey(password.keyB64, yield this.tokenService.getEmail(), kdfConfig);
            const keyConnectorRequest = new key_connector_user_key_request_1.KeyConnectorUserKeyRequest(masterKey.encKeyB64);
            yield this.masterPasswordService.setMasterKey(masterKey, userId);
            const userKey = yield this.cryptoService.makeUserKey(masterKey);
            yield this.cryptoService.setUserKey(userKey[0], userId);
            yield this.cryptoService.setMasterKeyEncryptedUserKey(userKey[1].encryptedString, userId);
            const [pubKey, privKey] = yield this.cryptoService.makeKeyPair(userKey[0]);
            try {
                const keyConnectorUrl = legacyKeyConnectorUrl !== null && legacyKeyConnectorUrl !== void 0 ? legacyKeyConnectorUrl : (_a = userDecryptionOptions === null || userDecryptionOptions === void 0 ? void 0 : userDecryptionOptions.keyConnectorOption) === null || _a === void 0 ? void 0 : _a.keyConnectorUrl;
                yield this.apiService.postUserKeyToKeyConnector(keyConnectorUrl, keyConnectorRequest);
            }
            catch (e) {
                this.handleKeyConnectorError(e);
            }
            const keys = new keys_request_1.KeysRequest(pubKey, privKey.encryptedString);
            const setPasswordRequest = new set_key_connector_key_request_1.SetKeyConnectorKeyRequest(userKey[1].encryptedString, kdfConfig, orgId, keys);
            yield this.apiService.postSetKeyConnectorKey(setPasswordRequest);
        });
    }
    setConvertAccountRequired(status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.convertAccountToKeyConnectorState.update(() => status);
        });
    }
    getConvertAccountRequired() {
        return (0, rxjs_1.firstValueFrom)(this.convertAccountToKeyConnectorState.state$);
    }
    removeConvertAccountRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setConvertAccountRequired(null);
        });
    }
    handleKeyConnectorError(e) {
        this.logService.error(e);
        if (this.logoutCallback != null) {
            // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.logoutCallback("keyConnectorError");
        }
        throw new Error("Key Connector error");
    }
}
exports.KeyConnectorService = KeyConnectorService;
//# sourceMappingURL=key-connector.service.js.map