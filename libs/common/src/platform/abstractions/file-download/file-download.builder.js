"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDownloadBuilder = void 0;
class FileDownloadBuilder {
    get blobOptions() {
        var _a;
        const options = (_a = this._request.blobOptions) !== null && _a !== void 0 ? _a : {};
        if (options.type == null) {
            options.type = this.fileType;
        }
        return options;
    }
    get blob() {
        if (this.blobOptions != null) {
            return new Blob([this._request.blobData], this.blobOptions);
        }
        else {
            return new Blob([this._request.blobData]);
        }
    }
    get downloadMethod() {
        if (this._request.downloadMethod != null) {
            return this._request.downloadMethod;
        }
        return this.fileType != "application/pdf" ? "save" : "open";
    }
    get fileType() {
        const fileNameLower = this._request.fileName.toLowerCase();
        if (fileNameLower.endsWith(".pdf")) {
            return "application/pdf";
        }
        else if (fileNameLower.endsWith(".xlsx")) {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
        else if (fileNameLower.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }
        else if (fileNameLower.endsWith(".pptx")) {
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        }
        else if (fileNameLower.endsWith(".csv")) {
            return "text/csv";
        }
        else if (fileNameLower.endsWith(".png")) {
            return "image/png";
        }
        else if (fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        else if (fileNameLower.endsWith(".gif")) {
            return "image/gif";
        }
        return null;
    }
    constructor(_request) {
        this._request = _request;
    }
}
exports.FileDownloadBuilder = FileDownloadBuilder;
//# sourceMappingURL=file-download.builder.js.map