"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderWithIdExport = void 0;
const folder_1 = require("../../vault/models/domain/folder");
const folder_view_1 = require("../../vault/models/view/folder.view");
const folder_export_1 = require("./folder.export");
class FolderWithIdExport extends folder_export_1.FolderExport {
    static toView(req, view = new folder_view_1.FolderView()) {
        view.id = req.id;
        return super.toView(req, view);
    }
    static toDomain(req, domain = new folder_1.Folder()) {
        domain.id = req.id;
        return super.toDomain(req, domain);
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.id = o.id;
        super.build(o);
    }
}
exports.FolderWithIdExport = FolderWithIdExport;
//# sourceMappingURL=folder-with-id.export.js.map