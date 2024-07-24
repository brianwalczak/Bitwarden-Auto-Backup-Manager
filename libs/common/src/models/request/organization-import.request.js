"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationImportRequest = void 0;
const import_directory_request_1 = require("./import-directory.request");
const organization_import_group_request_1 = require("./organization-import-group.request");
const organization_import_member_request_1 = require("./organization-import-member.request");
class OrganizationImportRequest {
    constructor(model) {
        this.groups = [];
        this.members = [];
        this.overwriteExisting = false;
        this.largeImport = false;
        if (model instanceof import_directory_request_1.ImportDirectoryRequest) {
            this.groups = model.groups.map((g) => new organization_import_group_request_1.OrganizationImportGroupRequest(g));
            this.members = model.users.map((u) => new organization_import_member_request_1.OrganizationImportMemberRequest(u));
        }
        else {
            this.groups = model.groups.map((g) => new organization_import_group_request_1.OrganizationImportGroupRequest(g));
            this.members = model.users.map((u) => new organization_import_member_request_1.OrganizationImportMemberRequest(u));
        }
        this.overwriteExisting = model.overwriteExisting;
        this.largeImport = model.largeImport;
    }
}
exports.OrganizationImportRequest = OrganizationImportRequest;
//# sourceMappingURL=organization-import.request.js.map