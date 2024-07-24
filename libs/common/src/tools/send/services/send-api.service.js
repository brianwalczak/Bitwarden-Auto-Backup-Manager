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
exports.SendApiService = void 0;
const error_response_1 = require("../../../models/response/error.response");
const list_response_1 = require("../../../models/response/list.response");
const utils_1 = require("../../../platform/misc/utils");
const send_type_1 = require("../enums/send-type");
const send_data_1 = require("../models/data/send.data");
const send_request_1 = require("../models/request/send.request");
const send_access_response_1 = require("../models/response/send-access.response");
const send_file_download_data_response_1 = require("../models/response/send-file-download-data.response");
const send_file_upload_data_response_1 = require("../models/response/send-file-upload-data.response");
const send_response_1 = require("../models/response/send.response");
class SendApiService {
    constructor(apiService, fileUploadService, sendService) {
        this.apiService = apiService;
        this.fileUploadService = fileUploadService;
        this.sendService = sendService;
    }
    getSend(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/sends/" + id, null, true, true);
            return new send_response_1.SendResponse(r);
        });
    }
    postSendAccess(id, request, apiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const addSendIdHeader = (headers) => {
                headers.set("Send-Id", id);
            };
            const r = yield this.apiService.send("POST", "/sends/access/" + id, request, false, true, apiUrl, addSendIdHeader);
            return new send_access_response_1.SendAccessResponse(r);
        });
    }
    getSendFileDownloadData(send, request, apiUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const addSendIdHeader = (headers) => {
                headers.set("Send-Id", send.id);
            };
            const r = yield this.apiService.send("POST", "/sends/" + send.id + "/access/file/" + send.file.id, request, false, true, apiUrl, addSendIdHeader);
            return new send_file_download_data_response_1.SendFileDownloadDataResponse(r);
        });
    }
    getSends() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/sends", null, true, true);
            return new list_response_1.ListResponse(r, send_response_1.SendResponse);
        });
    }
    postSend(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/sends", request, true, true);
            return new send_response_1.SendResponse(r);
        });
    }
    postFileTypeSend(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/sends/file/v2", request, true, true);
            return new send_file_upload_data_response_1.SendFileUploadDataResponse(r);
        });
    }
    renewSendFileUploadUrl(sendId, fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("GET", "/sends/" + sendId + "/file/" + fileId, null, true, true);
            return new send_file_upload_data_response_1.SendFileUploadDataResponse(r);
        });
    }
    postSendFile(sendId, fileId, data) {
        return this.apiService.send("POST", "/sends/" + sendId + "/file/" + fileId, data, true, false);
    }
    /**
     * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
     * This method still exists for backward compatibility with old server versions.
     */
    postSendFileLegacy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("POST", "/sends/file", data, true, true);
            return new send_response_1.SendResponse(r);
        });
    }
    putSend(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/sends/" + id, request, true, true);
            return new send_response_1.SendResponse(r);
        });
    }
    putSendRemovePassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.apiService.send("PUT", "/sends/" + id + "/remove-password", null, true, true);
            return new send_response_1.SendResponse(r);
        });
    }
    deleteSend(id) {
        return this.apiService.send("DELETE", "/sends/" + id, null, true, false);
    }
    save(sendData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.upload(sendData);
            const data = new send_data_1.SendData(response);
            yield this.sendService.upsert(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteSend(id);
            yield this.sendService.delete(id);
        });
    }
    removePassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.putSendRemovePassword(id);
            const data = new send_data_1.SendData(response);
            yield this.sendService.upsert(data);
        });
    }
    // Send File Upload methods
    upload(sendData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const request = new send_request_1.SendRequest(sendData[0], (_a = sendData[1]) === null || _a === void 0 ? void 0 : _a.buffer.byteLength);
            let response;
            if (sendData[0].id == null) {
                if (sendData[0].type === send_type_1.SendType.Text) {
                    response = yield this.postSend(request);
                }
                else {
                    try {
                        const uploadDataResponse = yield this.postFileTypeSend(request);
                        response = uploadDataResponse.sendResponse;
                        yield this.fileUploadService.upload(uploadDataResponse, sendData[0].file.fileName, sendData[1], this.generateMethods(uploadDataResponse, response));
                    }
                    catch (e) {
                        if (e instanceof error_response_1.ErrorResponse && e.statusCode === 404) {
                            response = yield this.legacyServerSendFileUpload(sendData, request);
                        }
                        else if (e instanceof error_response_1.ErrorResponse) {
                            throw new Error(e.getSingleMessage());
                        }
                        else {
                            throw e;
                        }
                    }
                }
                sendData[0].id = response.id;
                sendData[0].accessId = response.accessId;
            }
            else {
                response = yield this.putSend(sendData[0].id, request);
            }
            return response;
        });
    }
    generateMethods(uploadData, response) {
        return {
            postDirect: this.generatePostDirectCallback(response),
            renewFileUploadUrl: this.generateRenewFileUploadUrlCallback(response.id, response.file.id),
            rollback: this.generateRollbackCallback(response.id),
        };
    }
    generatePostDirectCallback(sendResponse) {
        return (data) => {
            return this.postSendFile(sendResponse.id, sendResponse.file.id, data);
        };
    }
    generateRenewFileUploadUrlCallback(sendId, fileId) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const renewResponse = yield this.renewSendFileUploadUrl(sendId, fileId);
            return renewResponse === null || renewResponse === void 0 ? void 0 : renewResponse.url;
        });
    }
    generateRollbackCallback(sendId) {
        return () => {
            return this.deleteSend(sendId);
        };
    }
    /**
     * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
     * This method still exists for backward compatibility with old server versions.
     */
    legacyServerSendFileUpload(sendData, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const fd = new FormData();
            try {
                const blob = new Blob([sendData[1].buffer], { type: "application/octet-stream" });
                fd.append("model", JSON.stringify(request));
                fd.append("data", blob, sendData[0].file.fileName.encryptedString);
            }
            catch (e) {
                if (utils_1.Utils.isNode && !utils_1.Utils.isBrowser) {
                    fd.append("model", JSON.stringify(request));
                    fd.append("data", Buffer.from(sendData[1].buffer), {
                        filepath: sendData[0].file.fileName.encryptedString,
                        contentType: "application/octet-stream",
                    });
                }
                else {
                    throw e;
                }
            }
            return yield this.postSendFileLegacy(fd);
        });
    }
}
exports.SendApiService = SendApiService;
//# sourceMappingURL=send-api.service.js.map