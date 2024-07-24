"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.CipherService = void 0;
const rxjs_1 = require("rxjs");
const semver_1 = require("semver");
const feature_flag_enum_1 = require("@bitwarden/common/enums/feature-flag.enum");
const flags_1 = require("../../platform/misc/flags");
const sequentialize_1 = require("../../platform/misc/sequentialize");
const utils_1 = require("../../platform/misc/utils");
const enc_array_buffer_1 = require("../../platform/models/domain/enc-array-buffer");
const symmetric_crypto_key_1 = require("../../platform/models/domain/symmetric-crypto-key");
const state_1 = require("../../platform/state");
const enums_1 = require("../enums");
const cipher_type_1 = require("../enums/cipher-type");
const cipher_data_1 = require("../models/data/cipher.data");
const attachment_1 = require("../models/domain/attachment");
const card_1 = require("../models/domain/card");
const cipher_1 = require("../models/domain/cipher");
const fido2_credential_1 = require("../models/domain/fido2-credential");
const field_1 = require("../models/domain/field");
const identity_1 = require("../models/domain/identity");
const login_1 = require("../models/domain/login");
const login_uri_1 = require("../models/domain/login-uri");
const password_1 = require("../models/domain/password");
const secure_note_1 = require("../models/domain/secure-note");
const sorted_ciphers_cache_1 = require("../models/domain/sorted-ciphers-cache");
const cipher_bulk_delete_request_1 = require("../models/request/cipher-bulk-delete.request");
const cipher_bulk_move_request_1 = require("../models/request/cipher-bulk-move.request");
const cipher_bulk_restore_request_1 = require("../models/request/cipher-bulk-restore.request");
const cipher_bulk_share_request_1 = require("../models/request/cipher-bulk-share.request");
const cipher_bulk_update_collections_request_1 = require("../models/request/cipher-bulk-update-collections.request");
const cipher_collections_request_1 = require("../models/request/cipher-collections.request");
const cipher_create_request_1 = require("../models/request/cipher-create.request");
const cipher_partial_request_1 = require("../models/request/cipher-partial.request");
const cipher_share_request_1 = require("../models/request/cipher-share.request");
const cipher_with_id_request_1 = require("../models/request/cipher-with-id.request");
const cipher_request_1 = require("../models/request/cipher.request");
const password_history_view_1 = require("../models/view/password-history.view");
const ciphers_state_1 = require("./key-state/ciphers.state");
const CIPHER_KEY_ENC_MIN_SERVER_VER = new semver_1.SemVer("2024.2.0");
class CipherService {
    viewFor$(id) {
        return this.cipherViews$.pipe((0, rxjs_1.map)((views) => views[id]));
    }
    constructor(cryptoService, domainSettingsService, apiService, i18nService, searchService, stateService, autofillSettingsService, encryptService, bulkEncryptService, cipherFileUploadService, configService, stateProvider) {
        this.cryptoService = cryptoService;
        this.domainSettingsService = domainSettingsService;
        this.apiService = apiService;
        this.i18nService = i18nService;
        this.searchService = searchService;
        this.stateService = stateService;
        this.autofillSettingsService = autofillSettingsService;
        this.encryptService = encryptService;
        this.bulkEncryptService = bulkEncryptService;
        this.cipherFileUploadService = cipherFileUploadService;
        this.configService = configService;
        this.stateProvider = stateProvider;
        this.sortedCiphersCache = new sorted_ciphers_cache_1.SortedCiphersCache(this.sortCiphersByLastUsed);
        this.localDataState = this.stateProvider.getActive(ciphers_state_1.LOCAL_DATA_KEY);
        this.encryptedCiphersState = this.stateProvider.getActive(ciphers_state_1.ENCRYPTED_CIPHERS);
        this.decryptedCiphersState = this.stateProvider.getActive(ciphers_state_1.DECRYPTED_CIPHERS);
        this.addEditCipherInfoState = this.stateProvider.getActive(ciphers_state_1.ADD_EDIT_CIPHER_INFO_KEY);
        this.ciphersExpectingUpdate = this.stateProvider.getDerived(this.encryptedCiphersState.state$, new state_1.DeriveDefinition(state_1.CIPHERS_MEMORY, "ciphersExpectingUpdate", {
            derive: (_) => false,
            deserializer: (value) => value,
        }), {});
        this.localData$ = this.localDataState.state$.pipe((0, rxjs_1.map)((data) => data !== null && data !== void 0 ? data : {}));
        // First wait for ciphersExpectingUpdate to be false before emitting ciphers
        this.ciphers$ = this.ciphersExpectingUpdate.state$.pipe((0, rxjs_1.skipWhile)((expectingUpdate) => expectingUpdate), (0, rxjs_1.switchMap)(() => this.encryptedCiphersState.state$), (0, rxjs_1.map)((ciphers) => ciphers !== null && ciphers !== void 0 ? ciphers : {}));
        this.cipherViews$ = this.decryptedCiphersState.state$.pipe((0, rxjs_1.map)((views) => views !== null && views !== void 0 ? views : {}));
        this.addEditCipherInfo$ = this.addEditCipherInfoState.state$;
    }
    setDecryptedCipherCache(value, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sometimes we might prematurely decrypt the vault and that will result in no ciphers
            // if we cache it then we may accidentally return it when it's not right, we'd rather try decryption again.
            // We still want to set null though, that is the indicator that the cache isn't valid and we should do decryption.
            if (value == null || value.length !== 0) {
                yield this.setDecryptedCiphers(value, userId);
            }
            if (this.searchService != null) {
                if (value == null) {
                    yield this.searchService.clearIndex();
                }
                else {
                    yield this.searchService.indexCiphers(value);
                }
            }
        });
    }
    setDecryptedCiphers(value, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cipherViews = {};
            value === null || value === void 0 ? void 0 : value.forEach((c) => {
                cipherViews[c.id] = c;
            });
            yield this.stateProvider.setUserState(ciphers_state_1.DECRYPTED_CIPHERS, cipherViews, userId);
        });
    }
    clearCache(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            yield this.clearDecryptedCiphersState(userId);
        });
    }
    encrypt(model_1, keyForEncryption_1, keyForCipherKeyDecryption_1) {
        return __awaiter(this, arguments, void 0, function* (model, keyForEncryption, keyForCipherKeyDecryption, originalCipher = null) {
            var _a;
            if (model.id != null) {
                if (originalCipher == null) {
                    originalCipher = yield this.get(model.id);
                }
                if (originalCipher != null) {
                    yield this.updateModelfromExistingCipher(model, originalCipher);
                }
                this.adjustPasswordHistoryLength(model);
            }
            const cipher = new cipher_1.Cipher();
            cipher.id = model.id;
            cipher.folderId = model.folderId;
            cipher.favorite = model.favorite;
            cipher.organizationId = model.organizationId;
            cipher.type = model.type;
            cipher.collectionIds = model.collectionIds;
            cipher.revisionDate = model.revisionDate;
            cipher.reprompt = model.reprompt;
            cipher.edit = model.edit;
            if (yield this.getCipherKeyEncryptionEnabled()) {
                cipher.key = (_a = originalCipher === null || originalCipher === void 0 ? void 0 : originalCipher.key) !== null && _a !== void 0 ? _a : null;
                const userOrOrgKey = yield this.getKeyForCipherKeyDecryption(cipher);
                // The keyForEncryption is only used for encrypting the cipher key, not the cipher itself, since cipher key encryption is enabled.
                // If the caller has provided a key for cipher key encryption, use it. Otherwise, use the user or org key.
                keyForEncryption || (keyForEncryption = userOrOrgKey);
                // If the caller has provided a key for cipher key decryption, use it. Otherwise, use the user or org key.
                keyForCipherKeyDecryption || (keyForCipherKeyDecryption = userOrOrgKey);
                return this.encryptCipherWithCipherKey(model, cipher, keyForEncryption, keyForCipherKeyDecryption);
            }
            else {
                if (keyForEncryption == null && cipher.organizationId != null) {
                    keyForEncryption = yield this.cryptoService.getOrgKey(cipher.organizationId);
                    if (keyForEncryption == null) {
                        throw new Error("Cannot encrypt cipher for organization. No key.");
                    }
                }
                // We want to ensure that the cipher key is null if cipher key encryption is disabled
                // so that decryption uses the proper key.
                cipher.key = null;
                return this.encryptCipher(model, cipher, keyForEncryption);
            }
        });
    }
    encryptAttachments(attachmentsModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (attachmentsModel == null || attachmentsModel.length === 0) {
                return null;
            }
            const promises = [];
            const encAttachments = [];
            attachmentsModel.forEach((model) => __awaiter(this, void 0, void 0, function* () {
                const attachment = new attachment_1.Attachment();
                attachment.id = model.id;
                attachment.size = model.size;
                attachment.sizeName = model.sizeName;
                attachment.url = model.url;
                const promise = this.encryptObjProperty(model, attachment, {
                    fileName: null,
                }, key).then(() => __awaiter(this, void 0, void 0, function* () {
                    if (model.key != null) {
                        attachment.key = yield this.cryptoService.encrypt(model.key.key, key);
                    }
                    encAttachments.push(attachment);
                }));
                promises.push(promise);
            }));
            yield Promise.all(promises);
            return encAttachments;
        });
    }
    encryptFields(fieldsModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fieldsModel || !fieldsModel.length) {
                return null;
            }
            const self = this;
            const encFields = [];
            yield fieldsModel.reduce((promise, field) => __awaiter(this, void 0, void 0, function* () {
                yield promise;
                const encField = yield self.encryptField(field, key);
                encFields.push(encField);
            }), Promise.resolve());
            return encFields;
        });
    }
    encryptField(fieldModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = new field_1.Field();
            field.type = fieldModel.type;
            field.linkedId = fieldModel.linkedId;
            // normalize boolean type field values
            if (fieldModel.type === enums_1.FieldType.Boolean && fieldModel.value !== "true") {
                fieldModel.value = "false";
            }
            yield this.encryptObjProperty(fieldModel, field, {
                name: null,
                value: null,
            }, key);
            return field;
        });
    }
    encryptPasswordHistories(phModels, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!phModels || !phModels.length) {
                return null;
            }
            const self = this;
            const encPhs = [];
            yield phModels.reduce((promise, ph) => __awaiter(this, void 0, void 0, function* () {
                yield promise;
                const encPh = yield self.encryptPasswordHistory(ph, key);
                encPhs.push(encPh);
            }), Promise.resolve());
            return encPhs;
        });
    }
    encryptPasswordHistory(phModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const ph = new password_1.Password();
            ph.lastUsedDate = phModel.lastUsedDate;
            yield this.encryptObjProperty(phModel, ph, {
                password: null,
            }, key);
            return ph;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            // eslint-disable-next-line
            if (ciphers == null || !ciphers.hasOwnProperty(id)) {
                return null;
            }
            const localData = yield (0, rxjs_1.firstValueFrom)(this.localData$);
            const cipherId = id;
            return new cipher_1.Cipher(ciphers[cipherId], localData ? localData[cipherId] : null);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const localData = yield (0, rxjs_1.firstValueFrom)(this.localData$);
            const ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            const response = [];
            for (const id in ciphers) {
                // eslint-disable-next-line
                if (ciphers.hasOwnProperty(id)) {
                    const cipherId = id;
                    response.push(new cipher_1.Cipher(ciphers[cipherId], localData ? localData[cipherId] : null));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            let decCiphers = yield this.getDecryptedCiphers();
            if (decCiphers != null && decCiphers.length !== 0) {
                yield this.reindexCiphers();
                return yield this.getDecryptedCiphers();
            }
            const activeUserId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            if (activeUserId == null) {
                return [];
            }
            decCiphers = yield this.decryptCiphers(yield this.getAll(), activeUserId);
            yield this.setDecryptedCipherCache(decCiphers, activeUserId);
            return decCiphers;
        });
    }
    getDecryptedCiphers() {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.values(yield (0, rxjs_1.firstValueFrom)(this.cipherViews$));
        });
    }
    decryptCiphers(ciphers, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield (0, rxjs_1.firstValueFrom)(this.cryptoService.cipherDecryptionKeys$(userId, true));
            if (keys == null || (keys.userKey == null && Object.keys(keys.orgKeys).length === 0)) {
                // return early if there are no keys to decrypt with
                return;
            }
            // Group ciphers by orgId or under 'null' for the user's ciphers
            const grouped = ciphers.reduce((agg, c) => {
                var _a;
                var _b;
                (_a = agg[_b = c.organizationId]) !== null && _a !== void 0 ? _a : (agg[_b] = []);
                agg[c.organizationId].push(c);
                return agg;
            }, {});
            const decCiphers = (yield Promise.all(Object.entries(grouped).map((_a) => __awaiter(this, [_a], void 0, function* ([orgId, groupedCiphers]) {
                var _b, _c;
                if (yield this.configService.getFeatureFlag(feature_flag_enum_1.FeatureFlag.PM4154_BulkEncryptionService)) {
                    return yield this.bulkEncryptService.decryptItems(groupedCiphers, (_b = keys.orgKeys[orgId]) !== null && _b !== void 0 ? _b : keys.userKey);
                }
                else {
                    return yield this.encryptService.decryptItems(groupedCiphers, (_c = keys.orgKeys[orgId]) !== null && _c !== void 0 ? _c : keys.userKey);
                }
            }))))
                .flat()
                .sort(this.getLocaleSortingFunction());
            return decCiphers;
        });
    }
    reindexCiphers() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = yield this.stateService.getUserId();
            const reindexRequired = this.searchService != null &&
                ((_a = (yield (0, rxjs_1.firstValueFrom)(this.searchService.indexedEntityId$))) !== null && _a !== void 0 ? _a : userId) !== userId;
            if (reindexRequired) {
                yield this.searchService.indexCiphers(yield this.getDecryptedCiphers(), userId);
            }
        });
    }
    getAllDecryptedForGrouping(groupingId_1) {
        return __awaiter(this, arguments, void 0, function* (groupingId, folder = true) {
            const ciphers = yield this.getAllDecrypted();
            return ciphers.filter((cipher) => {
                if (cipher.isDeleted) {
                    return false;
                }
                if (folder && cipher.folderId === groupingId) {
                    return true;
                }
                else if (!folder &&
                    cipher.collectionIds != null &&
                    cipher.collectionIds.indexOf(groupingId) > -1) {
                    return true;
                }
                return false;
            });
        });
    }
    getAllDecryptedForUrl(url_1, includeOtherTypes_1) {
        return __awaiter(this, arguments, void 0, function* (url, includeOtherTypes, defaultMatch = null) {
            const ciphers = yield this.getAllDecrypted();
            return yield this.filterCiphersForUrl(ciphers, url, includeOtherTypes, defaultMatch);
        });
    }
    filterCiphersForUrl(ciphers_1, url_1, includeOtherTypes_1) {
        return __awaiter(this, arguments, void 0, function* (ciphers, url, includeOtherTypes, defaultMatch = null) {
            if (url == null && includeOtherTypes == null) {
                return [];
            }
            const equivalentDomains = yield (0, rxjs_1.firstValueFrom)(this.domainSettingsService.getUrlEquivalentDomains(url));
            defaultMatch !== null && defaultMatch !== void 0 ? defaultMatch : (defaultMatch = yield (0, rxjs_1.firstValueFrom)(this.domainSettingsService.defaultUriMatchStrategy$));
            return ciphers.filter((cipher) => {
                const cipherIsLogin = cipher.type === cipher_type_1.CipherType.Login && cipher.login !== null;
                if (cipher.deletedDate !== null) {
                    return false;
                }
                if (Array.isArray(includeOtherTypes) &&
                    includeOtherTypes.includes(cipher.type) &&
                    !cipherIsLogin) {
                    return true;
                }
                if (cipherIsLogin) {
                    return cipher.login.matchesUri(url, equivalentDomains, defaultMatch);
                }
                return false;
            });
        });
    }
    getAllFromApiForOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiService.getCiphersOrganization(organizationId);
            return yield this.decryptOrganizationCiphersResponse(response, organizationId);
        });
    }
    getManyFromApiForOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiService.send("GET", "/ciphers/organization-details/assigned?organizationId=" + organizationId, null, true, true);
            return this.decryptOrganizationCiphersResponse(response, organizationId);
        });
    }
    decryptOrganizationCiphersResponse(response, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((response === null || response === void 0 ? void 0 : response.data) == null || response.data.length < 1) {
                return [];
            }
            const ciphers = response.data.map((cr) => new cipher_1.Cipher(new cipher_data_1.CipherData(cr)));
            const key = yield this.cryptoService.getOrgKey(organizationId);
            let decCiphers = [];
            if (yield this.configService.getFeatureFlag(feature_flag_enum_1.FeatureFlag.PM4154_BulkEncryptionService)) {
                decCiphers = yield this.bulkEncryptService.decryptItems(ciphers, key);
            }
            else {
                decCiphers = yield this.encryptService.decryptItems(ciphers, key);
            }
            decCiphers.sort(this.getLocaleSortingFunction());
            return decCiphers;
        });
    }
    getLastUsedForUrl(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, autofillOnPageLoad = false) {
            return this.getCipherForUrl(url, true, false, autofillOnPageLoad);
        });
    }
    getLastLaunchedForUrl(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, autofillOnPageLoad = false) {
            return this.getCipherForUrl(url, false, true, autofillOnPageLoad);
        });
    }
    getNextCipherForUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getCipherForUrl(url, false, false, false);
        });
    }
    updateLastUsedIndexForUrl(url) {
        this.sortedCiphersCache.updateLastUsedIndex(url);
    }
    updateLastUsedDate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            let ciphersLocalData = yield (0, rxjs_1.firstValueFrom)(this.localData$);
            if (!ciphersLocalData) {
                ciphersLocalData = {};
            }
            const cipherId = id;
            if (ciphersLocalData[cipherId]) {
                ciphersLocalData[cipherId].lastUsedDate = new Date().getTime();
            }
            else {
                ciphersLocalData[cipherId] = {
                    lastUsedDate: new Date().getTime(),
                };
            }
            yield this.localDataState.update(() => ciphersLocalData);
            const decryptedCipherCache = yield this.getDecryptedCiphers();
            if (!decryptedCipherCache) {
                return;
            }
            for (let i = 0; i < decryptedCipherCache.length; i++) {
                const cached = decryptedCipherCache[i];
                if (cached.id === id) {
                    cached.localData = ciphersLocalData[id];
                    break;
                }
            }
            yield this.setDecryptedCiphers(decryptedCipherCache, userId);
        });
    }
    updateLastLaunchedDate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            let ciphersLocalData = yield (0, rxjs_1.firstValueFrom)(this.localData$);
            if (!ciphersLocalData) {
                ciphersLocalData = {};
            }
            const cipherId = id;
            if (ciphersLocalData[cipherId]) {
                ciphersLocalData[cipherId].lastLaunched = new Date().getTime();
            }
            else {
                ciphersLocalData[cipherId] = {
                    lastUsedDate: new Date().getTime(),
                };
            }
            yield this.localDataState.update(() => ciphersLocalData);
            const decryptedCipherCache = yield this.getDecryptedCiphers();
            if (!decryptedCipherCache) {
                return;
            }
            for (let i = 0; i < decryptedCipherCache.length; i++) {
                const cached = decryptedCipherCache[i];
                if (cached.id === id) {
                    cached.localData = ciphersLocalData[id];
                    break;
                }
            }
            yield this.setDecryptedCiphers(decryptedCipherCache, userId);
        });
    }
    saveNeverDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (domain == null) {
                return;
            }
            let domains = yield (0, rxjs_1.firstValueFrom)(this.domainSettingsService.neverDomains$);
            if (!domains) {
                domains = {};
            }
            domains[domain] = null;
            yield this.domainSettingsService.setNeverDomains(domains);
        });
    }
    createWithServer(cipher, orgAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (orgAdmin && cipher.organizationId != null) {
                const request = new cipher_create_request_1.CipherCreateRequest(cipher);
                response = yield this.apiService.postCipherAdmin(request);
            }
            else if (cipher.collectionIds != null) {
                const request = new cipher_create_request_1.CipherCreateRequest(cipher);
                response = yield this.apiService.postCipherCreate(request);
            }
            else {
                const request = new cipher_request_1.CipherRequest(cipher);
                response = yield this.apiService.postCipher(request);
            }
            cipher.id = response.id;
            const data = new cipher_data_1.CipherData(response, cipher.collectionIds);
            const updated = yield this.upsert(data);
            // No local data for new ciphers
            return new cipher_1.Cipher(updated[cipher.id]);
        });
    }
    updateWithServer(cipher, orgAdmin, isNotClone) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (orgAdmin && isNotClone) {
                const request = new cipher_request_1.CipherRequest(cipher);
                response = yield this.apiService.putCipherAdmin(cipher.id, request);
            }
            else if (cipher.edit) {
                const request = new cipher_request_1.CipherRequest(cipher);
                response = yield this.apiService.putCipher(cipher.id, request);
            }
            else {
                const request = new cipher_partial_request_1.CipherPartialRequest(cipher);
                response = yield this.apiService.putPartialCipher(cipher.id, request);
            }
            const data = new cipher_data_1.CipherData(response, cipher.collectionIds);
            const updated = yield this.upsert(data);
            // updating with server does not change local data
            return new cipher_1.Cipher(updated[cipher.id], cipher.localData);
        });
    }
    shareWithServer(cipher, organizationId, collectionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentPromises = [];
            if (cipher.attachments != null) {
                cipher.attachments.forEach((attachment) => {
                    if (attachment.key == null) {
                        attachmentPromises.push(this.shareAttachmentWithServer(attachment, cipher.id, organizationId));
                    }
                });
            }
            yield Promise.all(attachmentPromises);
            cipher.organizationId = organizationId;
            cipher.collectionIds = collectionIds;
            const encCipher = yield this.encryptSharedCipher(cipher);
            const request = new cipher_share_request_1.CipherShareRequest(encCipher);
            const response = yield this.apiService.putShareCipher(cipher.id, request);
            const data = new cipher_data_1.CipherData(response, collectionIds);
            yield this.upsert(data);
        });
    }
    shareManyWithServer(ciphers, organizationId, collectionIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const encCiphers = [];
            for (const cipher of ciphers) {
                cipher.organizationId = organizationId;
                cipher.collectionIds = collectionIds;
                promises.push(this.encryptSharedCipher(cipher).then((c) => {
                    encCiphers.push(c);
                }));
            }
            yield Promise.all(promises);
            const request = new cipher_bulk_share_request_1.CipherBulkShareRequest(encCiphers, collectionIds);
            try {
                yield this.apiService.putShareCiphers(request);
            }
            catch (e) {
                for (const cipher of ciphers) {
                    cipher.organizationId = null;
                    cipher.collectionIds = null;
                }
                throw e;
            }
            yield this.upsert(encCiphers.map((c) => c.toCipherData()));
        });
    }
    saveAttachmentWithServer(cipher, unencryptedFile, admin = false) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(unencryptedFile);
            reader.onload = (evt) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const cData = yield this.saveAttachmentRawWithServer(cipher, unencryptedFile.name, evt.target.result, admin);
                    resolve(cData);
                }
                catch (e) {
                    reject(e);
                }
            });
            reader.onerror = () => {
                reject("Error reading file.");
            };
        });
    }
    saveAttachmentRawWithServer(cipher_2, filename_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (cipher, filename, data, admin = false) {
            const encKey = yield this.getKeyForCipherKeyDecryption(cipher);
            const cipherKeyEncryptionEnabled = yield this.getCipherKeyEncryptionEnabled();
            const cipherEncKey = cipherKeyEncryptionEnabled && cipher.key != null
                ? new symmetric_crypto_key_1.SymmetricCryptoKey(yield this.encryptService.decryptToBytes(cipher.key, encKey))
                : encKey;
            //if cipher key encryption is disabled but the item has an individual key,
            //then we rollback to using the user key as the main key of encryption of the item
            //in order to keep item and it's attachments with the same encryption level
            if (cipher.key != null && !cipherKeyEncryptionEnabled) {
                const model = yield cipher.decrypt(yield this.getKeyForCipherKeyDecryption(cipher));
                cipher = yield this.encrypt(model);
                yield this.updateWithServer(cipher);
            }
            const encFileName = yield this.encryptService.encrypt(filename, cipherEncKey);
            const dataEncKey = yield this.cryptoService.makeDataEncKey(cipherEncKey);
            const encData = yield this.encryptService.encryptToBytes(new Uint8Array(data), dataEncKey[0]);
            const response = yield this.cipherFileUploadService.upload(cipher, encFileName, encData, admin, dataEncKey);
            const cData = new cipher_data_1.CipherData(response, cipher.collectionIds);
            if (!admin) {
                yield this.upsert(cData);
            }
            return new cipher_1.Cipher(cData);
        });
    }
    saveCollectionsWithServer(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new cipher_collections_request_1.CipherCollectionsRequest(cipher.collectionIds);
            const response = yield this.apiService.putCipherCollections(cipher.id, request);
            // The response will now check for an unavailable value. This value determines whether
            // the user still has Can Manage access to the item after updating.
            if (response.unavailable) {
                yield this.delete(cipher.id);
                return;
            }
            const data = new cipher_data_1.CipherData(response.cipher);
            const updated = yield this.upsert(data);
            return new cipher_1.Cipher(updated[cipher.id], cipher.localData);
        });
    }
    /**
     * Bulk update collections for many ciphers with the server
     * @param orgId
     * @param cipherIds
     * @param collectionIds
     * @param removeCollections - If true, the collectionIds will be removed from the ciphers, otherwise they will be added
     */
    bulkUpdateCollectionsWithServer(orgId_1, cipherIds_1, collectionIds_1) {
        return __awaiter(this, arguments, void 0, function* (orgId, cipherIds, collectionIds, removeCollections = false) {
            var _a, _b;
            const request = new cipher_bulk_update_collections_request_1.CipherBulkUpdateCollectionsRequest(orgId, cipherIds, collectionIds, removeCollections);
            yield this.apiService.send("POST", "/ciphers/bulk-collections", request, true, false);
            // Update the local state
            const ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            for (const id of cipherIds) {
                const cipher = ciphers[id];
                if (cipher) {
                    if (removeCollections) {
                        cipher.collectionIds = (_a = cipher.collectionIds) === null || _a === void 0 ? void 0 : _a.filter((cid) => !collectionIds.includes(cid));
                    }
                    else {
                        // Append to the collectionIds if it's not already there
                        cipher.collectionIds = [...new Set([...((_b = cipher.collectionIds) !== null && _b !== void 0 ? _b : []), ...collectionIds])];
                    }
                }
            }
            yield this.clearCache();
            yield this.encryptedCiphersState.update(() => ciphers);
        });
    }
    upsert(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = cipher instanceof cipher_data_1.CipherData ? [cipher] : cipher;
            return yield this.updateEncryptedCipherState((current) => {
                ciphers.forEach((c) => (current[c.id] = c));
                return current;
            });
        });
    }
    replace(ciphers) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateEncryptedCipherState(() => ciphers);
        });
    }
    /**
     * Updates ciphers for the currently active user. Inactive users can only clear all ciphers, for now.
     * @param update update callback for encrypted cipher data
     * @returns
     */
    updateEncryptedCipherState(update) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            // Store that we should wait for an update to return any ciphers
            yield this.ciphersExpectingUpdate.forceValue(true);
            yield this.clearDecryptedCiphersState(userId);
            const [, updatedCiphers] = yield this.encryptedCiphersState.update((current) => {
                const result = update(current !== null && current !== void 0 ? current : {});
                return result;
            });
            return updatedCiphers;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId !== null && userId !== void 0 ? userId : (userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$));
            yield this.clearEncryptedCiphersState(userId);
            yield this.clearCache(userId);
        });
    }
    moveManyWithServer(ids, folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.putMoveCiphers(new cipher_bulk_move_request_1.CipherBulkMoveRequest(ids, folderId));
            let ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            if (ciphers == null) {
                ciphers = {};
            }
            ids.forEach((id) => {
                // eslint-disable-next-line
                if (ciphers.hasOwnProperty(id)) {
                    ciphers[id].folderId = folderId;
                }
            });
            yield this.clearCache();
            yield this.encryptedCiphersState.update(() => ciphers);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            if (ciphers == null) {
                return;
            }
            if (typeof id === "string") {
                const cipherId = id;
                if (ciphers[cipherId] == null) {
                    return;
                }
                delete ciphers[cipherId];
            }
            else {
                id.forEach((i) => {
                    delete ciphers[i];
                });
            }
            yield this.clearCache();
            yield this.encryptedCiphersState.update(() => ciphers);
        });
    }
    deleteWithServer(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, asAdmin = false) {
            if (asAdmin) {
                yield this.apiService.deleteCipherAdmin(id);
            }
            else {
                yield this.apiService.deleteCipher(id);
            }
            yield this.delete(id);
        });
    }
    deleteManyWithServer(ids_1) {
        return __awaiter(this, arguments, void 0, function* (ids, asAdmin = false) {
            const request = new cipher_bulk_delete_request_1.CipherBulkDeleteRequest(ids);
            if (asAdmin) {
                yield this.apiService.deleteManyCiphersAdmin(request);
            }
            else {
                yield this.apiService.deleteManyCiphers(request);
            }
            yield this.delete(ids);
        });
    }
    deleteAttachment(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            const cipherId = id;
            // eslint-disable-next-line
            if (ciphers == null || !ciphers.hasOwnProperty(id) || ciphers[cipherId].attachments == null) {
                return;
            }
            for (let i = 0; i < ciphers[cipherId].attachments.length; i++) {
                if (ciphers[cipherId].attachments[i].id === attachmentId) {
                    ciphers[cipherId].attachments.splice(i, 1);
                }
            }
            yield this.clearCache();
            yield this.encryptedCiphersState.update(() => {
                if (ciphers == null) {
                    ciphers = {};
                }
                return ciphers;
            });
        });
    }
    deleteAttachmentWithServer(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.apiService.deleteCipherAttachment(id, attachmentId);
            }
            catch (e) {
                return Promise.reject(e.getSingleMessage());
            }
            yield this.deleteAttachment(id, attachmentId);
        });
    }
    sortCiphersByLastUsed(a, b) {
        const aLastUsed = a.localData && a.localData.lastUsedDate ? a.localData.lastUsedDate : null;
        const bLastUsed = b.localData && b.localData.lastUsedDate ? b.localData.lastUsedDate : null;
        const bothNotNull = aLastUsed != null && bLastUsed != null;
        if (bothNotNull && aLastUsed < bLastUsed) {
            return 1;
        }
        if (aLastUsed != null && bLastUsed == null) {
            return -1;
        }
        if (bothNotNull && aLastUsed > bLastUsed) {
            return -1;
        }
        if (bLastUsed != null && aLastUsed == null) {
            return 1;
        }
        return 0;
    }
    sortCiphersByLastUsedThenName(a, b) {
        const result = this.sortCiphersByLastUsed(a, b);
        if (result !== 0) {
            return result;
        }
        return this.getLocaleSortingFunction()(a, b);
    }
    getLocaleSortingFunction() {
        return (a, b) => {
            let aName = a.name;
            let bName = b.name;
            if (aName == null && bName != null) {
                return -1;
            }
            if (aName != null && bName == null) {
                return 1;
            }
            if (aName == null && bName == null) {
                return 0;
            }
            const result = this.i18nService.collator
                ? this.i18nService.collator.compare(aName, bName)
                : aName.localeCompare(bName);
            if (result !== 0 || a.type !== cipher_type_1.CipherType.Login || b.type !== cipher_type_1.CipherType.Login) {
                return result;
            }
            if (a.login.username != null) {
                aName += a.login.username;
            }
            if (b.login.username != null) {
                bName += b.login.username;
            }
            return this.i18nService.collator
                ? this.i18nService.collator.compare(aName, bName)
                : aName.localeCompare(bName);
        };
    }
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            if (ciphers == null) {
                return;
            }
            const setDeletedDate = (cipherId) => {
                if (ciphers[cipherId] == null) {
                    return;
                }
                ciphers[cipherId].deletedDate = new Date().toISOString();
            };
            if (typeof id === "string") {
                setDeletedDate(id);
            }
            else {
                id.forEach(setDeletedDate);
            }
            yield this.clearCache();
            yield this.encryptedCiphersState.update(() => {
                if (ciphers == null) {
                    ciphers = {};
                }
                return ciphers;
            });
        });
    }
    softDeleteWithServer(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, asAdmin = false) {
            if (asAdmin) {
                yield this.apiService.putDeleteCipherAdmin(id);
            }
            else {
                yield this.apiService.putDeleteCipher(id);
            }
            yield this.softDelete(id);
        });
    }
    softDeleteManyWithServer(ids_1) {
        return __awaiter(this, arguments, void 0, function* (ids, asAdmin = false) {
            const request = new cipher_bulk_delete_request_1.CipherBulkDeleteRequest(ids);
            if (asAdmin) {
                yield this.apiService.putDeleteManyCiphersAdmin(request);
            }
            else {
                yield this.apiService.putDeleteManyCiphers(request);
            }
            yield this.softDelete(ids);
        });
    }
    restore(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            let ciphers = yield (0, rxjs_1.firstValueFrom)(this.ciphers$);
            if (ciphers == null) {
                return;
            }
            const clearDeletedDate = (c) => {
                const cipherId = c.id;
                if (ciphers[cipherId] == null) {
                    return;
                }
                ciphers[cipherId].deletedDate = null;
                ciphers[cipherId].revisionDate = c.revisionDate;
            };
            if (cipher.constructor.name === Array.name) {
                cipher.forEach(clearDeletedDate);
            }
            else {
                clearDeletedDate(cipher);
            }
            yield this.clearCache();
            yield this.encryptedCiphersState.update(() => {
                if (ciphers == null) {
                    ciphers = {};
                }
                return ciphers;
            });
        });
    }
    restoreWithServer(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, asAdmin = false) {
            let response;
            if (asAdmin) {
                response = yield this.apiService.putRestoreCipherAdmin(id);
            }
            else {
                response = yield this.apiService.putRestoreCipher(id);
            }
            yield this.restore({ id: id, revisionDate: response.revisionDate });
        });
    }
    /**
     * No longer using an asAdmin Param. Org Vault bulkRestore will assess if an item is unassigned or editable
     * The Org Vault will pass those ids an array as well as the orgId when calling bulkRestore
     */
    restoreManyWithServer(ids_1) {
        return __awaiter(this, arguments, void 0, function* (ids, orgId = null) {
            let response;
            if (orgId) {
                const request = new cipher_bulk_restore_request_1.CipherBulkRestoreRequest(ids, orgId);
                response = yield this.apiService.putRestoreManyCiphersAdmin(request);
            }
            else {
                const request = new cipher_bulk_restore_request_1.CipherBulkRestoreRequest(ids);
                response = yield this.apiService.putRestoreManyCiphers(request);
            }
            const restores = [];
            for (const cipher of response.data) {
                restores.push({ id: cipher.id, revisionDate: cipher.revisionDate });
            }
            yield this.restore(restores);
        });
    }
    getKeyForCipherKeyDecryption(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.cryptoService.getOrgKey(cipher.organizationId)) ||
                (yield this.cryptoService.getUserKeyWithLegacySupport()));
        });
    }
    setAddEditCipherInfo(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addEditCipherInfoState.update(() => value, {
                shouldUpdate: (current) => !(current == null && value == null),
            });
        });
    }
    getRotatedData(originalUserKey, newUserKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (originalUserKey == null) {
                throw new Error("Original user key is required to rotate ciphers");
            }
            if (newUserKey == null) {
                throw new Error("New user key is required to rotate ciphers");
            }
            let encryptedCiphers = [];
            const ciphers = yield this.getAllDecrypted();
            if (!ciphers) {
                return encryptedCiphers;
            }
            const userCiphers = ciphers.filter((c) => c.organizationId == null);
            if (userCiphers.length === 0) {
                return encryptedCiphers;
            }
            encryptedCiphers = yield Promise.all(userCiphers.map((cipher) => __awaiter(this, void 0, void 0, function* () {
                const encryptedCipher = yield this.encrypt(cipher, newUserKey, originalUserKey);
                return new cipher_with_id_request_1.CipherWithIdRequest(encryptedCipher);
            })));
            return encryptedCiphers;
        });
    }
    // Helpers
    // In the case of a cipher that is being shared with an organization, we want to decrypt the
    // cipher key with the user's key and then re-encrypt it with the organization's key.
    encryptSharedCipher(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyForCipherKeyDecryption = yield this.cryptoService.getUserKeyWithLegacySupport();
            return yield this.encrypt(model, null, keyForCipherKeyDecryption);
        });
    }
    updateModelfromExistingCipher(model, originalCipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCipher = yield originalCipher.decrypt(yield this.getKeyForCipherKeyDecryption(originalCipher));
            model.passwordHistory = existingCipher.passwordHistory || [];
            if (model.type === cipher_type_1.CipherType.Login && existingCipher.type === cipher_type_1.CipherType.Login) {
                if (existingCipher.login.password != null &&
                    existingCipher.login.password !== "" &&
                    existingCipher.login.password !== model.login.password) {
                    const ph = new password_history_view_1.PasswordHistoryView();
                    ph.password = existingCipher.login.password;
                    ph.lastUsedDate = model.login.passwordRevisionDate = new Date();
                    model.passwordHistory.splice(0, 0, ph);
                }
                else {
                    model.login.passwordRevisionDate = existingCipher.login.passwordRevisionDate;
                }
            }
            if (existingCipher.hasFields) {
                const existingHiddenFields = existingCipher.fields.filter((f) => f.type === enums_1.FieldType.Hidden &&
                    f.name != null &&
                    f.name !== "" &&
                    f.value != null &&
                    f.value !== "");
                const hiddenFields = model.fields == null
                    ? []
                    : model.fields.filter((f) => f.type === enums_1.FieldType.Hidden && f.name != null && f.name !== "");
                existingHiddenFields.forEach((ef) => {
                    const matchedField = hiddenFields.find((f) => f.name === ef.name);
                    if (matchedField == null || matchedField.value !== ef.value) {
                        const ph = new password_history_view_1.PasswordHistoryView();
                        ph.password = ef.name + ": " + ef.value;
                        ph.lastUsedDate = new Date();
                        model.passwordHistory.splice(0, 0, ph);
                    }
                });
            }
        });
    }
    adjustPasswordHistoryLength(model) {
        if (model.passwordHistory != null && model.passwordHistory.length === 0) {
            model.passwordHistory = null;
        }
        else if (model.passwordHistory != null && model.passwordHistory.length > 5) {
            // only save last 5 history
            model.passwordHistory = model.passwordHistory.slice(0, 5);
        }
    }
    shareAttachmentWithServer(attachmentView, cipherId, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentResponse = yield this.apiService.nativeFetch(new Request(attachmentView.url, { cache: "no-store" }));
            if (attachmentResponse.status !== 200) {
                throw Error("Failed to download attachment: " + attachmentResponse.status.toString());
            }
            const encBuf = yield enc_array_buffer_1.EncArrayBuffer.fromResponse(attachmentResponse);
            const decBuf = yield this.cryptoService.decryptFromBytes(encBuf, null);
            let encKey;
            encKey = yield this.cryptoService.getOrgKey(organizationId);
            encKey || (encKey = (yield this.cryptoService.getUserKeyWithLegacySupport()));
            const dataEncKey = yield this.cryptoService.makeDataEncKey(encKey);
            const encFileName = yield this.encryptService.encrypt(attachmentView.fileName, encKey);
            const encData = yield this.encryptService.encryptToBytes(new Uint8Array(decBuf), dataEncKey[0]);
            const fd = new FormData();
            try {
                const blob = new Blob([encData.buffer], { type: "application/octet-stream" });
                fd.append("key", dataEncKey[1].encryptedString);
                fd.append("data", blob, encFileName.encryptedString);
            }
            catch (e) {
                if (utils_1.Utils.isNode && !utils_1.Utils.isBrowser) {
                    fd.append("key", dataEncKey[1].encryptedString);
                    fd.append("data", Buffer.from(encData.buffer), {
                        filepath: encFileName.encryptedString,
                        contentType: "application/octet-stream",
                    });
                }
                else {
                    throw e;
                }
            }
            try {
                yield this.apiService.postShareCipherAttachment(cipherId, attachmentView.id, fd, organizationId);
            }
            catch (e) {
                throw new Error(e.getSingleMessage());
            }
        });
    }
    encryptObjProperty(model, obj, map, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            const self = this;
            for (const prop in map) {
                // eslint-disable-next-line
                if (!map.hasOwnProperty(prop)) {
                    continue;
                }
                (function (theProp, theObj) {
                    const p = Promise.resolve()
                        .then(() => {
                        const modelProp = model[map[theProp] || theProp];
                        if (modelProp && modelProp !== "") {
                            return self.cryptoService.encrypt(modelProp, key);
                        }
                        return null;
                    })
                        .then((val) => {
                        theObj[theProp] = val;
                    });
                    promises.push(p);
                })(prop, obj);
            }
            yield Promise.all(promises);
        });
    }
    encryptCipherData(cipher, model, key) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (cipher.type) {
                case cipher_type_1.CipherType.Login:
                    cipher.login = new login_1.Login();
                    cipher.login.passwordRevisionDate = model.login.passwordRevisionDate;
                    cipher.login.autofillOnPageLoad = model.login.autofillOnPageLoad;
                    yield this.encryptObjProperty(model.login, cipher.login, {
                        username: null,
                        password: null,
                        totp: null,
                    }, key);
                    if (model.login.uris != null) {
                        cipher.login.uris = [];
                        model.login.uris = model.login.uris.filter((u) => u.uri != null && u.uri !== "");
                        for (let i = 0; i < model.login.uris.length; i++) {
                            const loginUri = new login_uri_1.LoginUri();
                            loginUri.match = model.login.uris[i].match;
                            yield this.encryptObjProperty(model.login.uris[i], loginUri, {
                                uri: null,
                            }, key);
                            const uriHash = yield this.encryptService.hash(model.login.uris[i].uri, "sha256");
                            loginUri.uriChecksum = yield this.cryptoService.encrypt(uriHash, key);
                            cipher.login.uris.push(loginUri);
                        }
                    }
                    if (model.login.fido2Credentials != null) {
                        cipher.login.fido2Credentials = yield Promise.all(model.login.fido2Credentials.map((viewKey) => __awaiter(this, void 0, void 0, function* () {
                            const domainKey = new fido2_credential_1.Fido2Credential();
                            yield this.encryptObjProperty(viewKey, domainKey, {
                                credentialId: null,
                                keyType: null,
                                keyAlgorithm: null,
                                keyCurve: null,
                                keyValue: null,
                                rpId: null,
                                rpName: null,
                                userHandle: null,
                                userName: null,
                                userDisplayName: null,
                                origin: null,
                            }, key);
                            domainKey.counter = yield this.cryptoService.encrypt(String(viewKey.counter), key);
                            domainKey.discoverable = yield this.cryptoService.encrypt(String(viewKey.discoverable), key);
                            domainKey.creationDate = viewKey.creationDate;
                            return domainKey;
                        })));
                    }
                    return;
                case cipher_type_1.CipherType.SecureNote:
                    cipher.secureNote = new secure_note_1.SecureNote();
                    cipher.secureNote.type = model.secureNote.type;
                    return;
                case cipher_type_1.CipherType.Card:
                    cipher.card = new card_1.Card();
                    yield this.encryptObjProperty(model.card, cipher.card, {
                        cardholderName: null,
                        brand: null,
                        number: null,
                        expMonth: null,
                        expYear: null,
                        code: null,
                    }, key);
                    return;
                case cipher_type_1.CipherType.Identity:
                    cipher.identity = new identity_1.Identity();
                    yield this.encryptObjProperty(model.identity, cipher.identity, {
                        title: null,
                        firstName: null,
                        middleName: null,
                        lastName: null,
                        address1: null,
                        address2: null,
                        address3: null,
                        city: null,
                        state: null,
                        postalCode: null,
                        country: null,
                        company: null,
                        email: null,
                        phone: null,
                        ssn: null,
                        username: null,
                        passportNumber: null,
                        licenseNumber: null,
                    }, key);
                    return;
                default:
                    throw new Error("Unknown cipher type.");
            }
        });
    }
    getAutofillOnPageLoadDefault() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.autofillSettingsService.autofillOnPageLoadDefault$);
        });
    }
    getCipherForUrl(url, lastUsed, lastLaunched, autofillOnPageLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = autofillOnPageLoad ? "autofillOnPageLoad-" + url : url;
            if (!this.sortedCiphersCache.isCached(cacheKey)) {
                let ciphers = yield this.getAllDecryptedForUrl(url);
                if (!ciphers) {
                    return null;
                }
                if (autofillOnPageLoad) {
                    const autofillOnPageLoadDefault = yield this.getAutofillOnPageLoadDefault();
                    ciphers = ciphers.filter((cipher) => cipher.login.autofillOnPageLoad ||
                        (cipher.login.autofillOnPageLoad == null && autofillOnPageLoadDefault !== false));
                    if (ciphers.length === 0) {
                        return null;
                    }
                }
                this.sortedCiphersCache.addCiphers(cacheKey, ciphers);
            }
            if (lastLaunched) {
                return this.sortedCiphersCache.getLastLaunched(cacheKey);
            }
            else if (lastUsed) {
                return this.sortedCiphersCache.getLastUsed(cacheKey);
            }
            else {
                return this.sortedCiphersCache.getNext(cacheKey);
            }
        });
    }
    clearEncryptedCiphersState(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.setUserState(ciphers_state_1.ENCRYPTED_CIPHERS, {}, userId);
        });
    }
    clearDecryptedCiphersState(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setDecryptedCiphers(null, userId);
            this.clearSortedCiphers();
        });
    }
    clearSortedCiphers() {
        this.sortedCiphersCache.clear();
    }
    encryptCipher(model, cipher, key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.encryptObjProperty(model, cipher, {
                    name: null,
                    notes: null,
                }, key),
                this.encryptCipherData(cipher, model, key),
                this.encryptFields(model.fields, key).then((fields) => {
                    cipher.fields = fields;
                }),
                this.encryptPasswordHistories(model.passwordHistory, key).then((ph) => {
                    cipher.passwordHistory = ph;
                }),
                this.encryptAttachments(model.attachments, key).then((attachments) => {
                    cipher.attachments = attachments;
                }),
            ]);
            return cipher;
        });
    }
    encryptCipherWithCipherKey(model, cipher, keyForCipherKeyEncryption, keyForCipherKeyDecryption) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, we get the key for cipher key encryption, in its decrypted form
            let decryptedCipherKey;
            if (cipher.key == null) {
                decryptedCipherKey = yield this.cryptoService.makeCipherKey();
            }
            else {
                decryptedCipherKey = new symmetric_crypto_key_1.SymmetricCryptoKey(yield this.encryptService.decryptToBytes(cipher.key, keyForCipherKeyDecryption));
            }
            // Then, we have to encrypt the cipher key with the proper key.
            cipher.key = yield this.encryptService.encrypt(decryptedCipherKey.key, keyForCipherKeyEncryption);
            // Finally, we can encrypt the cipher with the decrypted cipher key.
            return this.encryptCipher(model, cipher, decryptedCipherKey);
        });
    }
    getCipherKeyEncryptionEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return ((0, flags_1.flagEnabled)("enableCipherKeyEncryption") &&
                (yield (0, rxjs_1.firstValueFrom)(this.configService.checkServerMeetsVersionRequirement$(CIPHER_KEY_ENC_MIN_SERVER_VER))));
        });
    }
}
exports.CipherService = CipherService;
__decorate([
    (0, sequentialize_1.sequentialize)(() => "getAllDecrypted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CipherService.prototype, "getAllDecrypted", null);
//# sourceMappingURL=cipher.service.js.map