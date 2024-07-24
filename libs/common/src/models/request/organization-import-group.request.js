"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationImportGroupRequest = void 0;
const import_directory_request_group_1 = require("./import-directory-request-group");
class OrganizationImportGroupRequest {
    constructor(model) {
        this.name = model.name;
        this.externalId = model.externalId;
        if (model instanceof import_directory_request_group_1.ImportDirectoryRequestGroup) {
            this.memberExternalIds = model.users;
        }
        else {
            this.memberExternalIds = model.memberExternalIds;
        }
    }
}
exports.OrganizationImportGroupRequest = OrganizationImportGroupRequest;
//# sourceMappingURL=organization-import-group.request.js.map