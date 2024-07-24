"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionData = void 0;
const collection_response_1 = require("../response/collection.response");
class CollectionData {
    constructor(response) {
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.name = response.name;
        this.externalId = response.externalId;
        this.readOnly = response.readOnly;
        this.manage = response.manage;
        this.hidePasswords = response.hidePasswords;
    }
    static fromJSON(obj) {
        return Object.assign(new CollectionData(new collection_response_1.CollectionDetailsResponse({})), obj);
    }
}
exports.CollectionData = CollectionData;
//# sourceMappingURL=collection.data.js.map