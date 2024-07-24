"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const folder_view_1 = require("../view/folder.view");
class Folder extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            name: null,
        }, ["id"]);
        this.revisionDate = obj.revisionDate != null ? new Date(obj.revisionDate) : null;
    }
    decrypt() {
        return this.decryptObj(new folder_view_1.FolderView(this), {
            name: null,
        }, null);
    }
    static fromJSON(obj) {
        const revisionDate = obj.revisionDate == null ? null : new Date(obj.revisionDate);
        return Object.assign(new Folder(), obj, { name: enc_string_1.EncString.fromJSON(obj.name), revisionDate });
    }
}
exports.Folder = Folder;
//# sourceMappingURL=folder.js.map