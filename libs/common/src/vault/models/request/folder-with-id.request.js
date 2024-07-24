"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderWithIdRequest = void 0;
const folder_request_1 = require("./folder.request");
class FolderWithIdRequest extends folder_request_1.FolderRequest {
    constructor(folder) {
        super(folder);
        this.id = folder.id;
    }
}
exports.FolderWithIdRequest = FolderWithIdRequest;
//# sourceMappingURL=folder-with-id.request.js.map