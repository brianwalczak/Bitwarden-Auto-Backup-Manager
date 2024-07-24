"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderRequest = void 0;
class FolderRequest {
    constructor(folder) {
        this.name = folder.name ? folder.name.encryptedString : null;
    }
}
exports.FolderRequest = FolderRequest;
//# sourceMappingURL=folder.request.js.map