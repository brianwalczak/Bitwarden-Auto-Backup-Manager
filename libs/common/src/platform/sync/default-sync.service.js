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
exports.DefaultSyncService = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../admin-console/enums");
const organization_data_1 = require("../../admin-console/models/data/organization.data");
const policy_data_1 = require("../../admin-console/models/data/policy.data");
const provider_data_1 = require("../../admin-console/models/data/provider.data");
const force_set_password_reason_1 = require("../../auth/models/domain/force-set-password-reason");
const send_data_1 = require("../../tools/send/models/data/send.data");
const cipher_data_1 = require("../../vault/models/data/cipher.data");
const collection_data_1 = require("../../vault/models/data/collection.data");
const folder_data_1 = require("../../vault/models/data/folder.data");
const sequentialize_1 = require("../misc/sequentialize");
const core_sync_service_1 = require("./core-sync.service");
class DefaultSyncService extends core_sync_service_1.CoreSyncService {
    constructor(masterPasswordService, accountService, apiService, domainSettingsService, folderService, cipherService, cryptoService, collectionService, messageSender, policyService, sendService, logService, keyConnectorService, stateService, providerService, folderApiService, organizationService, sendApiService, userDecryptionOptionsService, avatarService, logoutCallback, billingAccountProfileStateService, tokenService, authService) {
        super(stateService, folderService, folderApiService, messageSender, logService, cipherService, collectionService, apiService, accountService, authService, sendService, sendApiService);
        this.masterPasswordService = masterPasswordService;
        this.domainSettingsService = domainSettingsService;
        this.cryptoService = cryptoService;
        this.policyService = policyService;
        this.keyConnectorService = keyConnectorService;
        this.providerService = providerService;
        this.organizationService = organizationService;
        this.userDecryptionOptionsService = userDecryptionOptionsService;
        this.avatarService = avatarService;
        this.logoutCallback = logoutCallback;
        this.billingAccountProfileStateService = billingAccountProfileStateService;
        this.tokenService = tokenService;
        this.syncInProgress = false;
    }
    fullSync(forceSync_1) {
        return __awaiter(this, arguments, void 0, function* (forceSync, allowThrowOnError = false) {
            this.syncStarted();
            const isAuthenticated = yield this.stateService.getIsAuthenticated();
            if (!isAuthenticated) {
                return this.syncCompleted(false);
            }
            const now = new Date();
            let needsSync = false;
            try {
                needsSync = yield this.needsSyncing(forceSync);
            }
            catch (e) {
                if (allowThrowOnError) {
                    this.syncCompleted(false);
                    throw e;
                }
            }
            if (!needsSync) {
                yield this.setLastSync(now);
                return this.syncCompleted(false);
            }
            try {
                yield this.apiService.refreshIdentityToken();
                const response = yield this.apiService.getSync();
                yield this.syncProfile(response.profile);
                yield this.syncFolders(response.folders);
                yield this.syncCollections(response.collections);
                yield this.syncCiphers(response.ciphers);
                yield this.syncSends(response.sends);
                yield this.syncSettings(response.domains);
                yield this.syncPolicies(response.policies);
                yield this.setLastSync(now);
                return this.syncCompleted(true);
            }
            catch (e) {
                if (allowThrowOnError) {
                    this.syncCompleted(false);
                    throw e;
                }
                else {
                    return this.syncCompleted(false);
                }
            }
        });
    }
    needsSyncing(forceSync) {
        return __awaiter(this, void 0, void 0, function* () {
            if (forceSync) {
                return true;
            }
            const lastSync = yield this.getLastSync();
            if (lastSync == null || lastSync.getTime() === 0) {
                return true;
            }
            const response = yield this.apiService.getAccountRevisionDate();
            if (response < 0 && this.logoutCallback) {
                // Account was deleted, log out now
                yield this.logoutCallback("accountDeleted");
            }
            if (new Date(response) <= lastSync) {
                return false;
            }
            return true;
        });
    }
    syncProfile(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const stamp = yield this.tokenService.getSecurityStamp(response.id);
            if (stamp != null && stamp !== response.securityStamp) {
                if (this.logoutCallback != null) {
                    yield this.logoutCallback("invalidSecurityStamp");
                }
                throw new Error("Stamp has changed");
            }
            yield this.cryptoService.setMasterKeyEncryptedUserKey(response.key);
            yield this.cryptoService.setPrivateKey(response.privateKey, response.id);
            yield this.cryptoService.setProviderKeys(response.providers, response.id);
            yield this.cryptoService.setOrgKeys(response.organizations, response.providerOrganizations, response.id);
            yield this.avatarService.setSyncAvatarColor(response.id, response.avatarColor);
            yield this.tokenService.setSecurityStamp(response.securityStamp, response.id);
            yield this.accountService.setAccountEmailVerified(response.id, response.emailVerified);
            yield this.billingAccountProfileStateService.setHasPremium(response.premiumPersonally, response.premiumFromOrganization);
            yield this.keyConnectorService.setUsesKeyConnector(response.usesKeyConnector);
            yield this.setForceSetPasswordReasonIfNeeded(response);
            const providers = {};
            response.providers.forEach((p) => {
                providers[p.id] = new provider_data_1.ProviderData(p);
            });
            yield this.providerService.save(providers);
            yield this.syncProfileOrganizations(response);
            if (yield this.keyConnectorService.userNeedsMigration()) {
                yield this.keyConnectorService.setConvertAccountRequired(true);
                this.messageSender.send("convertAccountToKeyConnector");
            }
            else {
                // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.keyConnectorService.removeConvertAccountRequired();
            }
        });
    }
    setForceSetPasswordReasonIfNeeded(profileResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // The `forcePasswordReset` flag indicates an admin has reset the user's password and must be updated
            if (profileResponse.forcePasswordReset) {
                yield this.masterPasswordService.setForceSetPasswordReason(force_set_password_reason_1.ForceSetPasswordReason.AdminForcePasswordReset, profileResponse.id);
            }
            const userDecryptionOptions = yield (0, rxjs_1.firstValueFrom)(this.userDecryptionOptionsService.userDecryptionOptionsById$(profileResponse.id));
            if (userDecryptionOptions === null || userDecryptionOptions === undefined) {
                this.logService.error("Sync: Account decryption options are null or undefined.");
            }
            // Even though TDE users should only be in a single org (per single org policy), check
            // through all orgs for the manageResetPassword permission. If they have it in any org,
            // they should be forced to set a password.
            let hasManageResetPasswordPermission = false;
            for (const org of profileResponse.organizations) {
                const isAdmin = org.type === enums_1.OrganizationUserType.Admin;
                const isOwner = org.type === enums_1.OrganizationUserType.Owner;
                // Note: apparently permissions only come down populated for custom roles.
                if (isAdmin || isOwner || (org.permissions && org.permissions.manageResetPassword)) {
                    hasManageResetPasswordPermission = true;
                    break;
                }
            }
            if (userDecryptionOptions.trustedDeviceOption !== undefined &&
                !userDecryptionOptions.hasMasterPassword &&
                hasManageResetPasswordPermission) {
                // TDE user w/out MP went from having no password reset permission to having it.
                // Must set the force password reset reason so the auth guard will redirect to the set password page.
                const userId = (_a = (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$))) === null || _a === void 0 ? void 0 : _a.id;
                yield this.masterPasswordService.setForceSetPasswordReason(force_set_password_reason_1.ForceSetPasswordReason.TdeUserWithoutPasswordHasPasswordResetPermission, userId);
            }
        });
    }
    syncProfileOrganizations(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const organizations = {};
            response.organizations.forEach((o) => {
                organizations[o.id] = new organization_data_1.OrganizationData(o, {
                    isMember: true,
                    isProviderUser: false,
                });
            });
            response.providerOrganizations.forEach((o) => {
                if (organizations[o.id] == null) {
                    organizations[o.id] = new organization_data_1.OrganizationData(o, {
                        isMember: false,
                        isProviderUser: true,
                    });
                }
                else {
                    organizations[o.id].isProviderUser = true;
                }
            });
            yield this.organizationService.replace(organizations);
        });
    }
    syncFolders(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = {};
            response.forEach((f) => {
                folders[f.id] = new folder_data_1.FolderData(f);
            });
            return yield this.folderService.replace(folders);
        });
    }
    syncCollections(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = {};
            response.forEach((c) => {
                collections[c.id] = new collection_data_1.CollectionData(c);
            });
            return yield this.collectionService.replace(collections);
        });
    }
    syncCiphers(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = {};
            response.forEach((c) => {
                ciphers[c.id] = new cipher_data_1.CipherData(c);
            });
            return yield this.cipherService.replace(ciphers);
        });
    }
    syncSends(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sends = {};
            response.forEach((s) => {
                sends[s.id] = new send_data_1.SendData(s);
            });
            return yield this.sendService.replace(sends);
        });
    }
    syncSettings(response) {
        return __awaiter(this, void 0, void 0, function* () {
            let eqDomains = [];
            if (response != null && response.equivalentDomains != null) {
                eqDomains = eqDomains.concat(response.equivalentDomains);
            }
            if (response != null && response.globalEquivalentDomains != null) {
                response.globalEquivalentDomains.forEach((global) => {
                    if (global.domains.length > 0) {
                        eqDomains.push(global.domains);
                    }
                });
            }
            return this.domainSettingsService.setEquivalentDomains(eqDomains);
        });
    }
    syncPolicies(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const policies = {};
            if (response != null) {
                response.forEach((p) => {
                    policies[p.id] = new policy_data_1.PolicyData(p);
                });
            }
            return yield this.policyService.replace(policies);
        });
    }
}
exports.DefaultSyncService = DefaultSyncService;
__decorate([
    (0, sequentialize_1.sequentialize)(() => "fullSync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Object]),
    __metadata("design:returntype", Promise)
], DefaultSyncService.prototype, "fullSync", null);
//# sourceMappingURL=default-sync.service.js.map