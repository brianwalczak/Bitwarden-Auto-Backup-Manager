"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const collection_1 = require("../../vault/models/domain/collection");
const collection_view_1 = require("../../vault/models/view/collection.view");
const utils_1 = require("./utils");
class CollectionExport {
    static template() {
        const req = new CollectionExport();
        req.organizationId = "00000000-0000-0000-0000-000000000000";
        req.name = "Collection name";
        req.externalId = null;
        return req;
    }
    static toView(req, view = new collection_view_1.CollectionView()) {
        view.name = req.name;
        view.externalId = req.externalId;
        if (view.organizationId == null) {
            view.organizationId = req.organizationId;
        }
        return view;
    }
    static toDomain(req, domain = new collection_1.Collection()) {
        domain.name = req.name != null ? new enc_string_1.EncString(req.name) : null;
        domain.externalId = req.externalId;
        if (domain.organizationId == null) {
            domain.organizationId = req.organizationId;
        }
        return domain;
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.organizationId = o.organizationId;
        this.name = (0, utils_1.safeGetString)(o.name);
        this.externalId = o.externalId;
    }
}
exports.CollectionExport = CollectionExport;
//# sourceMappingURL=collection.export.js.map