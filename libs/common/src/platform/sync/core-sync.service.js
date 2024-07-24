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
exports.CoreSyncService = void 0;
const rxjs_1 = require("rxjs");
const authentication_status_1 = require("../../auth/enums/authentication-status");
const send_data_1 = require("../../tools/send/models/data/send.data");
const cipher_data_1 = require("../../vault/models/data/cipher.data");
const folder_data_1 = require("../../vault/models/data/folder.data");
/**
 * Core SyncService Logic EXCEPT for fullSync so that implementations can differ.
 */
class CoreSyncService {
    constructor(stateService, folderService, folderApiService, messageSender, logService, cipherService, collectionService, apiService, accountService, authService, sendService, sendApiService) {
        this.stateService = stateService;
        this.folderService = folderService;
        this.folderApiService = folderApiService;
        this.messageSender = messageSender;
        this.logService = logService;
        this.cipherService = cipherService;
        this.collectionService = collectionService;
        this.apiService = apiService;
        this.accountService = accountService;
        this.authService = authService;
        this.sendService = sendService;
        this.sendApiService = sendApiService;
        this.syncInProgress = false;
    }
    getLastSync() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.stateService.getUserId()) == null) {
                return null;
            }
            const lastSync = yield this.stateService.getLastSync();
            if (lastSync) {
                return new Date(lastSync);
            }
            return null;
        });
    }
    setLastSync(date, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateService.setLastSync(date.toJSON(), { userId: userId });
        });
    }
    syncUpsertFolder(notification, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.stateService.getIsAuthenticated()) {
                try {
                    const localFolder = yield this.folderService.get(notification.id);
                    if ((!isEdit && localFolder == null) ||
                        (isEdit && localFolder != null && localFolder.revisionDate < notification.revisionDate)) {
                        const remoteFolder = yield this.folderApiService.get(notification.id);
                        if (remoteFolder != null) {
                            yield this.folderService.upsert(new folder_data_1.FolderData(remoteFolder));
                            this.messageSender.send("syncedUpsertedFolder", { folderId: notification.id });
                            return this.syncCompleted(true);
                        }
                    }
                }
                catch (e) {
                    this.logService.error(e);
                }
            }
            return this.syncCompleted(false);
        });
    }
    syncDeleteFolder(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.stateService.getIsAuthenticated()) {
                yield this.folderService.delete(notification.id);
                this.messageSender.send("syncedDeletedFolder", { folderId: notification.id });
                this.syncCompleted(true);
                return true;
            }
            return this.syncCompleted(false);
        });
    }
    syncUpsertCipher(notification, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.stateService.getIsAuthenticated()) {
                try {
                    let shouldUpdate = true;
                    const localCipher = yield this.cipherService.get(notification.id);
                    if (localCipher != null && localCipher.revisionDate >= notification.revisionDate) {
                        shouldUpdate = false;
                    }
                    let checkCollections = false;
                    if (shouldUpdate) {
                        if (isEdit) {
                            shouldUpdate = localCipher != null;
                            checkCollections = true;
                        }
                        else {
                            if (notification.collectionIds == null || notification.organizationId == null) {
                                shouldUpdate = localCipher == null;
                            }
                            else {
                                shouldUpdate = false;
                                checkCollections = true;
                            }
                        }
                    }
                    if (!shouldUpdate &&
                        checkCollections &&
                        notification.organizationId != null &&
                        notification.collectionIds != null &&
                        notification.collectionIds.length > 0) {
                        const collections = yield this.collectionService.getAll();
                        if (collections != null) {
                            for (let i = 0; i < collections.length; i++) {
                                if (notification.collectionIds.indexOf(collections[i].id) > -1) {
                                    shouldUpdate = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (shouldUpdate) {
                        const remoteCipher = yield this.apiService.getFullCipherDetails(notification.id);
                        if (remoteCipher != null) {
                            yield this.cipherService.upsert(new cipher_data_1.CipherData(remoteCipher));
                            this.messageSender.send("syncedUpsertedCipher", { cipherId: notification.id });
                            return this.syncCompleted(true);
                        }
                    }
                }
                catch (e) {
                    if (e != null && e.statusCode === 404 && isEdit) {
                        yield this.cipherService.delete(notification.id);
                        this.messageSender.send("syncedDeletedCipher", { cipherId: notification.id });
                        return this.syncCompleted(true);
                    }
                }
            }
            return this.syncCompleted(false);
        });
    }
    syncDeleteCipher(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.stateService.getIsAuthenticated()) {
                yield this.cipherService.delete(notification.id);
                this.messageSender.send("syncedDeletedCipher", { cipherId: notification.id });
                return this.syncCompleted(true);
            }
            return this.syncCompleted(false);
        });
    }
    syncUpsertSend(notification, isEdit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            const [activeUserId, status] = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.switchMap)((a) => {
                if (a == null) {
                    (0, rxjs_1.of)([null, authentication_status_1.AuthenticationStatus.LoggedOut]);
                }
                return this.authService.authStatusFor$(a.id).pipe((0, rxjs_1.map)((s) => [a.id, s]));
            })));
            // Process only notifications for currently active user when user is not logged out
            // TODO: once send service allows data manipulation of non-active users, this should process any received notification
            if (activeUserId === notification.userId && status !== authentication_status_1.AuthenticationStatus.LoggedOut) {
                try {
                    const localSend = yield (0, rxjs_1.firstValueFrom)(this.sendService.get$(notification.id));
                    if ((!isEdit && localSend == null) ||
                        (isEdit && localSend != null && localSend.revisionDate < notification.revisionDate)) {
                        const remoteSend = yield this.sendApiService.getSend(notification.id);
                        if (remoteSend != null) {
                            yield this.sendService.upsert(new send_data_1.SendData(remoteSend));
                            this.messageSender.send("syncedUpsertedSend", { sendId: notification.id });
                            return this.syncCompleted(true);
                        }
                    }
                }
                catch (e) {
                    this.logService.error(e);
                }
            }
            return this.syncCompleted(false);
        });
    }
    syncDeleteSend(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            if (yield this.stateService.getIsAuthenticated()) {
                yield this.sendService.delete(notification.id);
                this.messageSender.send("syncedDeletedSend", { sendId: notification.id });
                this.syncCompleted(true);
                return true;
            }
            return this.syncCompleted(false);
        });
    }
    // Helpers
    syncStarted() {
        this.syncInProgress = true;
        this.messageSender.send("syncStarted");
    }
    syncCompleted(successfully) {
        this.syncInProgress = false;
        this.messageSender.send("syncCompleted", { successfully: successfully });
        return successfully;
    }
}
exports.CoreSyncService = CoreSyncService;
//# sourceMappingURL=core-sync.service.js.map