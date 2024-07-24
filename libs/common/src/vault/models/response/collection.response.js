"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionAccessDetailsResponse = exports.CollectionDetailsResponse = exports.CollectionResponse = void 0;
const selection_read_only_response_1 = require("../../../admin-console/models/response/selection-read-only.response");
const base_response_1 = require("../../../models/response/base.response");
class CollectionResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.name = this.getResponseProperty("Name");
        this.externalId = this.getResponseProperty("ExternalId");
    }
}
exports.CollectionResponse = CollectionResponse;
class CollectionDetailsResponse extends CollectionResponse {
    constructor(response) {
        super(response);
        this.readOnly = this.getResponseProperty("ReadOnly") || false;
        this.manage = this.getResponseProperty("Manage") || false;
        this.hidePasswords = this.getResponseProperty("HidePasswords") || false;
        // Temporary until the API is updated to return this property in AC-2084
        // For now, we can assume that if the object is 'collectionDetails' then the user is assigned
        this.assigned = this.getResponseProperty("object") == "collectionDetails";
    }
}
exports.CollectionDetailsResponse = CollectionDetailsResponse;
class CollectionAccessDetailsResponse extends CollectionDetailsResponse {
    constructor(response) {
        super(response);
        this.groups = [];
        this.users = [];
        this.assigned = this.getResponseProperty("Assigned") || false;
        this.unmanaged = this.getResponseProperty("Unmanaged") || false;
        const groups = this.getResponseProperty("Groups");
        if (groups != null) {
            this.groups = groups.map((g) => new selection_read_only_response_1.SelectionReadOnlyResponse(g));
        }
        const users = this.getResponseProperty("Users");
        if (users != null) {
            this.users = users.map((g) => new selection_read_only_response_1.SelectionReadOnlyResponse(g));
        }
    }
}
exports.CollectionAccessDetailsResponse = CollectionAccessDetailsResponse;
//# sourceMappingURL=collection.response.js.map