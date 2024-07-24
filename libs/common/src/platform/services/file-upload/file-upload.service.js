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
exports.FileUploadService = void 0;
const enums_1 = require("../../enums");
const azure_file_upload_service_1 = require("./azure-file-upload.service");
const bitwarden_file_upload_service_1 = require("./bitwarden-file-upload.service");
class FileUploadService {
    constructor(logService) {
        this.logService = logService;
        this.azureFileUploadService = new azure_file_upload_service_1.AzureFileUploadService(logService);
        this.bitwardenFileUploadService = new bitwarden_file_upload_service_1.BitwardenFileUploadService();
    }
    upload(uploadData, fileName, encryptedFileData, fileUploadMethods) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (uploadData.fileUploadType) {
                    case enums_1.FileUploadType.Direct:
                        yield this.bitwardenFileUploadService.upload(fileName.encryptedString, encryptedFileData, (fd) => fileUploadMethods.postDirect(fd));
                        break;
                    case enums_1.FileUploadType.Azure: {
                        yield this.azureFileUploadService.upload(uploadData.url, encryptedFileData, fileUploadMethods.renewFileUploadUrl);
                        break;
                    }
                    default:
                        throw new Error("Unknown file upload type");
                }
            }
            catch (e) {
                yield fileUploadMethods.rollback();
                throw e;
            }
        });
    }
}
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=file-upload.service.js.map