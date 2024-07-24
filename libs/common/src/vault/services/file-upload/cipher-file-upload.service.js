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
exports.CipherFileUploadService = void 0;
const error_response_1 = require("../../../models/response/error.response");
const utils_1 = require("../../../platform/misc/utils");
class CipherFileUploadService {
    constructor(apiService, fileUploadService) {
        this.apiService = apiService;
        this.fileUploadService = fileUploadService;
    }
    upload(cipher, encFileName, encData, admin, dataEncKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                key: dataEncKey[1].encryptedString,
                fileName: encFileName.encryptedString,
                fileSize: encData.buffer.byteLength,
                adminRequest: admin,
            };
            let response;
            try {
                const uploadDataResponse = yield this.apiService.postCipherAttachment(cipher.id, request);
                response = admin ? uploadDataResponse.cipherMiniResponse : uploadDataResponse.cipherResponse;
                yield this.fileUploadService.upload(uploadDataResponse, encFileName, encData, this.generateMethods(uploadDataResponse, response, request.adminRequest));
            }
            catch (e) {
                if ((e instanceof error_response_1.ErrorResponse && e.statusCode === 404) ||
                    e.statusCode === 405) {
                    response = yield this.legacyServerAttachmentFileUpload(request.adminRequest, cipher.id, encFileName, encData, dataEncKey[1]);
                }
                else if (e instanceof error_response_1.ErrorResponse) {
                    throw new Error(e.getSingleMessage());
                }
                else {
                    throw e;
                }
            }
            return response;
        });
    }
    generateMethods(uploadData, response, isAdmin) {
        return {
            postDirect: this.generatePostDirectCallback(uploadData, isAdmin),
            renewFileUploadUrl: this.generateRenewFileUploadUrlCallback(uploadData, response, isAdmin),
            rollback: this.generateRollbackCallback(response, uploadData, isAdmin),
        };
    }
    generatePostDirectCallback(uploadData, isAdmin) {
        return (data) => {
            const response = isAdmin ? uploadData.cipherMiniResponse : uploadData.cipherResponse;
            return this.apiService.postAttachmentFile(response.id, uploadData.attachmentId, data);
        };
    }
    generateRenewFileUploadUrlCallback(uploadData, response, isAdmin) {
        return () => __awaiter(this, void 0, void 0, function* () {
            const renewResponse = yield this.apiService.renewAttachmentUploadUrl(response.id, uploadData.attachmentId);
            return renewResponse === null || renewResponse === void 0 ? void 0 : renewResponse.url;
        });
    }
    generateRollbackCallback(response, uploadData, isAdmin) {
        return () => {
            if (isAdmin) {
                return this.apiService.deleteCipherAttachmentAdmin(response.id, uploadData.attachmentId);
            }
            else {
                return this.apiService.deleteCipherAttachment(response.id, uploadData.attachmentId);
            }
        };
    }
    /**
     * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
     * This method still exists for backward compatibility with old server versions.
     */
    legacyServerAttachmentFileUpload(admin, cipherId, encFileName, encData, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const fd = new FormData();
            try {
                const blob = new Blob([encData.buffer], { type: "application/octet-stream" });
                fd.append("key", key.encryptedString);
                fd.append("data", blob, encFileName.encryptedString);
            }
            catch (e) {
                if (utils_1.Utils.isNode && !utils_1.Utils.isBrowser) {
                    fd.append("key", key.encryptedString);
                    fd.append("data", Buffer.from(encData.buffer), {
                        filepath: encFileName.encryptedString,
                        contentType: "application/octet-stream",
                    });
                }
                else {
                    throw e;
                }
            }
            let response;
            try {
                if (admin) {
                    response = yield this.apiService.postCipherAttachmentAdminLegacy(cipherId, fd);
                }
                else {
                    response = yield this.apiService.postCipherAttachmentLegacy(cipherId, fd);
                }
            }
            catch (e) {
                throw new Error(e.getSingleMessage());
            }
            return response;
        });
    }
}
exports.CipherFileUploadService = CipherFileUploadService;
//# sourceMappingURL=cipher-file-upload.service.js.map