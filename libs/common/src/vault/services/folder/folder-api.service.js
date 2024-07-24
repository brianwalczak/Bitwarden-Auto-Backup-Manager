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
exports.FolderApiService = void 0;
const folder_data_1 = require("../../../vault/models/data/folder.data");
const folder_request_1 = require("../../../vault/models/request/folder.request");
const folder_response_1 = require("../../../vault/models/response/folder.response");
class FolderApiService {
    constructor(folderService, apiService) {
        this.folderService = folderService;
        this.apiService = apiService;
    }
    save(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new folder_request_1.FolderRequest(folder);
            let response;
            if (folder.id == null) {
                response = yield this.postFolder(request);
                folder.id = response.id;
            }
            else {
                response = yield this.putFolder(folder.id, request);
            }
            const data = new folder_data_1.FolderData(response);
            yield this.folderService.upsert(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteFolder(id);
            yield this.folderService.delete(id);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/folders/" + id, null, true, true);
            return new folder_response_1.FolderResponse(r);
        });
    }
    postFolder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/folders", request, true, true);
            return new folder_response_1.FolderResponse(r);
        });
    }
    putFolder(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/folders/" + id, request, true, true);
            return new folder_response_1.FolderResponse(r);
        });
    }
    deleteFolder(id) {
        return this.apiService.send("DELETE", "/folders/" + id, null, true, false);
    }
}
exports.FolderApiService = FolderApiService;
//# sourceMappingURL=folder-api.service.js.map