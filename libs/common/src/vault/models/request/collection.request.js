"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionRequest = void 0;
class CollectionRequest {
    constructor(collection) {
        this.groups = [];
        this.users = [];
        if (collection == null) {
            return;
        }
        this.name = collection.name ? collection.name.encryptedString : null;
        this.externalId = collection.externalId;
    }
}
exports.CollectionRequest = CollectionRequest;
//# sourceMappingURL=collection.request.js.map