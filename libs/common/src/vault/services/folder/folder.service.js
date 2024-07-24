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
exports.FolderService = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../../platform/misc/utils");
const folder_data_1 = require("../../../vault/models/data/folder.data");
const folder_1 = require("../../../vault/models/domain/folder");
const folder_view_1 = require("../../../vault/models/view/folder.view");
const folder_with_id_request_1 = require("../../models/request/folder-with-id.request");
const folder_state_1 = require("../key-state/folder.state");
class FolderService {
    constructor(cryptoService, i18nService, cipherService, stateProvider) {
        this.cryptoService = cryptoService;
        this.i18nService = i18nService;
        this.cipherService = cipherService;
        this.stateProvider = stateProvider;
        this.encryptedFoldersState = this.stateProvider.getActive(folder_state_1.FOLDER_ENCRYPTED_FOLDERS);
        this.decryptedFoldersState = this.stateProvider.getDerived(this.encryptedFoldersState.state$, folder_state_1.FOLDER_DECRYPTED_FOLDERS, { folderService: this, cryptoService: this.cryptoService });
        this.folders$ = this.encryptedFoldersState.state$.pipe((0, rxjs_1.map)((folderData) => Object.values(folderData).map((f) => new folder_1.Folder(f))));
        this.folderViews$ = this.decryptedFoldersState.state$;
    }
    clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.decryptedFoldersState.forceValue([]);
        });
    }
    // TODO: This should be moved to EncryptService or something
    encrypt(model, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = new folder_1.Folder();
            folder.id = model.id;
            folder.name = yield this.cryptoService.encrypt(model.name, key);
            return folder;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = yield (0, rxjs_1.firstValueFrom)(this.folders$);
            return folders.find((folder) => folder.id === id);
        });
    }
    getDecrypted$(id) {
        return this.folderViews$.pipe((0, rxjs_1.map)((folders) => folders.find((folder) => folder.id === id)), (0, rxjs_1.shareReplay)({ refCount: true, bufferSize: 1 }));
    }
    getAllFromState() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.folders$);
        });
    }
    /**
     * @deprecated For the CLI only
     * @param id id of the folder
     */
    getFromState(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = yield this.get(id);
            if (!folder) {
                return null;
            }
            return folder;
        });
    }
    /**
     * @deprecated Only use in CLI!
     */
    getAllDecryptedFromState() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.folderViews$);
        });
    }
    upsert(folderData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.encryptedFoldersState.update((folders) => {
                if (folders == null) {
                    folders = {};
                }
                if (folderData instanceof folder_data_1.FolderData) {
                    const f = folderData;
                    folders[f.id] = f;
                }
                else {
                    folderData.forEach((f) => {
                        folders[f.id] = f;
                    });
                }
                return folders;
            });
        });
    }
    replace(folders) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!folders) {
                return;
            }
            yield this.encryptedFoldersState.update(() => {
                const newFolders = Object.assign({}, folders);
                return newFolders;
            });
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                yield this.encryptedFoldersState.update(() => ({}));
                yield this.decryptedFoldersState.forceValue([]);
            }
            else {
                yield this.stateProvider.getUser(userId, folder_state_1.FOLDER_ENCRYPTED_FOLDERS).update(() => ({}));
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.encryptedFoldersState.update((folders) => {
                if (folders == null) {
                    return;
                }
                const folderIdsToDelete = Array.isArray(id) ? id : [id];
                folderIdsToDelete.forEach((id) => {
                    if (folders[id] != null) {
                        delete folders[id];
                    }
                });
                return folders;
            });
            // Items in a deleted folder are re-assigned to "No Folder"
            const ciphers = yield this.cipherService.getAll();
            if (ciphers != null) {
                const updates = [];
                for (const cId in ciphers) {
                    if (ciphers[cId].folderId === id) {
                        ciphers[cId].folderId = null;
                        updates.push(ciphers[cId]);
                    }
                }
                if (updates.length > 0) {
                    // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    this.cipherService.upsert(updates.map((c) => c.toCipherData()));
                }
            }
        });
    }
    decryptFolders(folders) {
        return __awaiter(this, void 0, void 0, function* () {
            const decryptFolderPromises = folders.map((f) => f.decrypt());
            const decryptedFolders = yield Promise.all(decryptFolderPromises);
            decryptedFolders.sort(utils_1.Utils.getSortFunction(this.i18nService, "name"));
            const noneFolder = new folder_view_1.FolderView();
            noneFolder.name = this.i18nService.t("noneFolder");
            decryptedFolders.push(noneFolder);
            return decryptedFolders;
        });
    }
    getRotatedData(originalUserKey, newUserKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newUserKey == null) {
                throw new Error("New user key is required for rotation.");
            }
            let encryptedFolders = [];
            const folders = yield (0, rxjs_1.firstValueFrom)(this.folderViews$);
            if (!folders) {
                return encryptedFolders;
            }
            encryptedFolders = yield Promise.all(folders.map((folder) => __awaiter(this, void 0, void 0, function* () {
                const encryptedFolder = yield this.encrypt(folder, newUserKey);
                return new folder_with_id_request_1.FolderWithIdRequest(encryptedFolder);
            })));
            return encryptedFolders;
        });
    }
}
exports.FolderService = FolderService;
//# sourceMappingURL=folder.service.js.map