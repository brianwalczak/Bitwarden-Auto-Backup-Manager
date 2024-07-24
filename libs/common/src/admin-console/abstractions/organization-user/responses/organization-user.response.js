"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUserResetPasswordDetailsResponse = exports.OrganizationUserDetailsResponse = exports.OrganizationUserUserDetailsResponse = exports.OrganizationUserResponse = void 0;
const base_response_1 = require("../../../../models/response/base.response");
const permissions_api_1 = require("../../../models/api/permissions.api");
const selection_read_only_response_1 = require("../../../models/response/selection-read-only.response");
class OrganizationUserResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.collections = [];
        this.groups = [];
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.type = this.getResponseProperty("Type");
        this.status = this.getResponseProperty("Status");
        this.permissions = new permissions_api_1.PermissionsApi(this.getResponseProperty("Permissions"));
        this.externalId = this.getResponseProperty("ExternalId");
        this.accessSecretsManager = this.getResponseProperty("AccessSecretsManager");
        this.resetPasswordEnrolled = this.getResponseProperty("ResetPasswordEnrolled");
        this.hasMasterPassword = this.getResponseProperty("HasMasterPassword");
        const collections = this.getResponseProperty("Collections");
        if (collections != null) {
            this.collections = collections.map((c) => new selection_read_only_response_1.SelectionReadOnlyResponse(c));
        }
        const groups = this.getResponseProperty("Groups");
        if (groups != null) {
            this.groups = groups;
        }
    }
}
exports.OrganizationUserResponse = OrganizationUserResponse;
class OrganizationUserUserDetailsResponse extends OrganizationUserResponse {
    constructor(response) {
        var _a;
        super(response);
        this.name = this.getResponseProperty("Name");
        this.email = this.getResponseProperty("Email");
        this.avatarColor = this.getResponseProperty("AvatarColor");
        this.twoFactorEnabled = this.getResponseProperty("TwoFactorEnabled");
        this.usesKeyConnector = (_a = this.getResponseProperty("UsesKeyConnector")) !== null && _a !== void 0 ? _a : false;
    }
}
exports.OrganizationUserUserDetailsResponse = OrganizationUserUserDetailsResponse;
class OrganizationUserDetailsResponse extends OrganizationUserResponse {
    constructor(response) {
        super(response);
    }
}
exports.OrganizationUserDetailsResponse = OrganizationUserDetailsResponse;
class OrganizationUserResetPasswordDetailsResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.organizationUserId = this.getResponseProperty("OrganizationUserId");
        this.kdf = this.getResponseProperty("Kdf");
        this.kdfIterations = this.getResponseProperty("KdfIterations");
        this.kdfMemory = this.getResponseProperty("KdfMemory");
        this.kdfParallelism = this.getResponseProperty("KdfParallelism");
        this.resetPasswordKey = this.getResponseProperty("ResetPasswordKey");
        this.encryptedPrivateKey = this.getResponseProperty("EncryptedPrivateKey");
    }
}
exports.OrganizationUserResetPasswordDetailsResponse = OrganizationUserResetPasswordDetailsResponse;
//# sourceMappingURL=organization-user.response.js.map