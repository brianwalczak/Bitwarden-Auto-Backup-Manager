"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const folder_1 = require("../../vault/models/domain/folder");
const folder_view_1 = require("../../vault/models/view/folder.view");
const utils_1 = require("./utils");
class FolderExport {
    static template() {
        const req = new FolderExport();
        req.name = "Folder name";
        return req;
    }
    static toView(req, view = new folder_view_1.FolderView()) {
        view.name = req.name;
        return view;
    }
    static toDomain(req, domain = new folder_1.Folder()) {
        domain.name = req.name != null ? new enc_string_1.EncString(req.name) : null;
        return domain;
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.name = (0, utils_1.safeGetString)(o.name);
    }
}
exports.FolderExport = FolderExport;
//# sourceMappingURL=folder.export.js.map