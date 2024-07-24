"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderView = void 0;
class FolderView {
    constructor(f) {
        this.id = null;
        this.name = null;
        this.revisionDate = null;
        if (!f) {
            return;
        }
        this.id = f.id;
        this.revisionDate = f.revisionDate;
    }
    static fromJSON(obj) {
        const revisionDate = obj.revisionDate == null ? null : new Date(obj.revisionDate);
        return Object.assign(new FolderView(), obj, { revisionDate });
    }
}
exports.FolderView = FolderView;
//# sourceMappingURL=folder.view.js.map