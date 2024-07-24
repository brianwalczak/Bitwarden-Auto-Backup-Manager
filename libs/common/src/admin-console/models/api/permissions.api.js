"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsApi = void 0;
const base_response_1 = require("../../../models/response/base.response");
class PermissionsApi extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return this;
        }
        this.accessEventLogs = this.getResponseProperty("AccessEventLogs");
        this.accessImportExport = this.getResponseProperty("AccessImportExport");
        this.accessReports = this.getResponseProperty("AccessReports");
        this.createNewCollections = this.getResponseProperty("CreateNewCollections");
        this.editAnyCollection = this.getResponseProperty("EditAnyCollection");
        this.deleteAnyCollection = this.getResponseProperty("DeleteAnyCollection");
        this.editAssignedCollections = this.getResponseProperty("EditAssignedCollections");
        this.deleteAssignedCollections = this.getResponseProperty("DeleteAssignedCollections");
        this.manageCiphers = this.getResponseProperty("ManageCiphers");
        this.manageGroups = this.getResponseProperty("ManageGroups");
        this.manageSso = this.getResponseProperty("ManageSso");
        this.managePolicies = this.getResponseProperty("ManagePolicies");
        this.manageUsers = this.getResponseProperty("ManageUsers");
        this.manageResetPassword = this.getResponseProperty("ManageResetPassword");
        this.manageScim = this.getResponseProperty("ManageScim");
    }
}
exports.PermissionsApi = PermissionsApi;
//# sourceMappingURL=permissions.api.js.map