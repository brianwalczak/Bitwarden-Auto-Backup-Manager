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
exports.FOLDER_DECRYPTED_FOLDERS = exports.FOLDER_ENCRYPTED_FOLDERS = void 0;
const state_1 = require("../../../platform/state");
const folder_data_1 = require("../../models/data/folder.data");
const folder_1 = require("../../models/domain/folder");
const folder_view_1 = require("../../models/view/folder.view");
exports.FOLDER_ENCRYPTED_FOLDERS = state_1.UserKeyDefinition.record(state_1.FOLDER_DISK, "folders", {
    deserializer: (obj) => folder_data_1.FolderData.fromJSON(obj),
    clearOn: ["logout"],
});
exports.FOLDER_DECRYPTED_FOLDERS = state_1.DeriveDefinition.from(exports.FOLDER_ENCRYPTED_FOLDERS, {
    deserializer: (obj) => obj.map((f) => folder_view_1.FolderView.fromJSON(f)),
    derive: (from_1, _a) => __awaiter(void 0, [from_1, _a], void 0, function* (from, { folderService, cryptoService }) {
        const folders = Object.values(from || {}).map((f) => new folder_1.Folder(f));
        if (yield cryptoService.hasUserKey()) {
            return yield folderService.decryptFolders(folders);
        }
        else {
            return [];
        }
    }),
});
//# sourceMappingURL=folder.state.js.map