"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionWithIdExport = void 0;
const collection_1 = require("../../vault/models/domain/collection");
const collection_view_1 = require("../../vault/models/view/collection.view");
const collection_export_1 = require("./collection.export");
class CollectionWithIdExport extends collection_export_1.CollectionExport {
    static toView(req, view = new collection_view_1.CollectionView()) {
        view.id = req.id;
        return super.toView(req, view);
    }
    static toDomain(req, domain = new collection_1.Collection()) {
        domain.id = req.id;
        return super.toDomain(req, domain);
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.id = o.id;
        super.build(o);
    }
}
exports.CollectionWithIdExport = CollectionWithIdExport;
//# sourceMappingURL=collection-with-id.export.js.map