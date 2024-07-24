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
exports.BitwardenFileUploadService = void 0;
const utils_1 = require("../../misc/utils");
class BitwardenFileUploadService {
    upload(encryptedFileName, encryptedFileData, apiCall) {
        return __awaiter(this, void 0, void 0, function* () {
            const fd = new FormData();
            try {
                const blob = new Blob([encryptedFileData.buffer], { type: "application/octet-stream" });
                fd.append("data", blob, encryptedFileName);
            }
            catch (e) {
                if (utils_1.Utils.isNode && !utils_1.Utils.isBrowser) {
                    fd.append("data", Buffer.from(encryptedFileData.buffer), {
                        filepath: encryptedFileName,
                        contentType: "application/octet-stream",
                    });
                }
                else {
                    throw e;
                }
            }
            yield apiCall(fd);
        });
    }
}
exports.BitwardenFileUploadService = BitwardenFileUploadService;
//# sourceMappingURL=bitwarden-file-upload.service.js.map