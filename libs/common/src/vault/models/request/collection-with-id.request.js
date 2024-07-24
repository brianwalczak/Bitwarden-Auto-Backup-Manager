"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionWithIdRequest = void 0;
const collection_request_1 = require("./collection.request");
class CollectionWithIdRequest extends collection_request_1.CollectionRequest {
    constructor(collection) {
        if (collection == null) {
            return;
        }
        super(collection);
        this.id = collection.id;
    }
}
exports.CollectionWithIdRequest = CollectionWithIdRequest;
//# sourceMappingURL=collection-with-id.request.js.map