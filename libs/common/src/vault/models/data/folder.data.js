"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderData = void 0;
class FolderData {
    constructor(response) {
        this.name = response === null || response === void 0 ? void 0 : response.name;
        this.id = response === null || response === void 0 ? void 0 : response.id;
        this.revisionDate = response === null || response === void 0 ? void 0 : response.revisionDate;
    }
    static fromJSON(obj) {
        return Object.assign(new FolderData({}), obj);
    }
}
exports.FolderData = FolderData;
//# sourceMappingURL=folder.data.js.map