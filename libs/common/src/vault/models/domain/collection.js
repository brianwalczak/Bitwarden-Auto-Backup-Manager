"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const collection_view_1 = require("../view/collection.view");
class Collection extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            organizationId: null,
            name: null,
            externalId: null,
            readOnly: null,
            hidePasswords: null,
            manage: null,
        }, ["id", "organizationId", "externalId", "readOnly", "hidePasswords", "manage"]);
    }
    decrypt(orgKey) {
        return this.decryptObj(new collection_view_1.CollectionView(this), {
            name: null,
        }, this.organizationId, orgKey);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map