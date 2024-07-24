"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionView = exports.NestingDelimiter = void 0;
const collection_1 = require("../domain/collection");
const collection_response_1 = require("../response/collection.response");
exports.NestingDelimiter = "/";
class CollectionView {
    constructor(c) {
        this.id = null;
        this.organizationId = null;
        this.name = null;
        this.externalId = null;
        // readOnly applies to the items within a collection
        this.readOnly = null;
        this.hidePasswords = null;
        this.manage = null;
        this.assigned = null;
        if (!c) {
            return;
        }
        this.id = c.id;
        this.organizationId = c.organizationId;
        this.externalId = c.externalId;
        if (c instanceof collection_1.Collection) {
            this.readOnly = c.readOnly;
            this.hidePasswords = c.hidePasswords;
            this.manage = c.manage;
            this.assigned = true;
        }
        if (c instanceof collection_response_1.CollectionAccessDetailsResponse) {
            this.assigned = c.assigned;
        }
    }
    canEditItems(org, v1FlexibleCollections, restrictProviderAccess) {
        if (org != null && org.id !== this.organizationId) {
            throw new Error("Id of the organization provided does not match the org id of the collection.");
        }
        return ((org === null || org === void 0 ? void 0 : org.canEditAllCiphers(v1FlexibleCollections, restrictProviderAccess)) ||
            this.manage ||
            (this.assigned && !this.readOnly));
    }
    /**
     * Returns true if the user can edit a collection (including user and group access) from the individual vault.
     * After FCv1, does not include admin permissions - see {@link CollectionAdminView.canEdit}.
     */
    canEdit(org, flexibleCollectionsV1Enabled) {
        if (org != null && org.id !== this.organizationId) {
            throw new Error("Id of the organization provided does not match the org id of the collection.");
        }
        if (flexibleCollectionsV1Enabled) {
            // Only use individual permissions, not admin permissions
            return this.manage;
        }
        return (org === null || org === void 0 ? void 0 : org.canEditAnyCollection(flexibleCollectionsV1Enabled)) || this.manage;
    }
    /**
     * Returns true if the user can delete a collection from the individual vault.
     * After FCv1, does not include admin permissions - see {@link CollectionAdminView.canDelete}.
     */
    canDelete(org, flexibleCollectionsV1Enabled) {
        if (org != null && org.id !== this.organizationId) {
            throw new Error("Id of the organization provided does not match the org id of the collection.");
        }
        const canDeleteManagedCollections = !(org === null || org === void 0 ? void 0 : org.limitCollectionCreationDeletion) || org.isAdmin;
        if (flexibleCollectionsV1Enabled) {
            // Only use individual permissions, not admin permissions
            return canDeleteManagedCollections && this.manage;
        }
        return ((org === null || org === void 0 ? void 0 : org.canDeleteAnyCollection(flexibleCollectionsV1Enabled)) ||
            (canDeleteManagedCollections && this.manage));
    }
    /**
     * Returns true if the user can view collection info and access in a read-only state from the individual vault
     */
    canViewCollectionInfo(org, flexibleCollectionsV1Enabled) {
        return false;
    }
    static fromJSON(obj) {
        return Object.assign(new CollectionView(new collection_1.Collection()), obj);
    }
}
exports.CollectionView = CollectionView;
//# sourceMappingURL=collection.view.js.map