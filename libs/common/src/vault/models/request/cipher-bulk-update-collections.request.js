"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherBulkUpdateCollectionsRequest = void 0;
class CipherBulkUpdateCollectionsRequest {
    constructor(organizationId, cipherIds, collectionIds, removeCollections = false) {
        this.organizationId = organizationId;
        this.cipherIds = cipherIds;
        this.collectionIds = collectionIds;
        this.removeCollections = removeCollections;
    }
}
exports.CipherBulkUpdateCollectionsRequest = CipherBulkUpdateCollectionsRequest;
//# sourceMappingURL=cipher-bulk-update-collections.request.js.map