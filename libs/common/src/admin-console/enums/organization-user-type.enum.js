"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUserType = void 0;
var OrganizationUserType;
(function (OrganizationUserType) {
    OrganizationUserType[OrganizationUserType["Owner"] = 0] = "Owner";
    OrganizationUserType[OrganizationUserType["Admin"] = 1] = "Admin";
    OrganizationUserType[OrganizationUserType["User"] = 2] = "User";
    // Manager = 3 has been intentionally permanently deleted
    OrganizationUserType[OrganizationUserType["Custom"] = 4] = "Custom";
})(OrganizationUserType || (exports.OrganizationUserType = OrganizationUserType = {}));
//# sourceMappingURL=organization-user-type.enum.js.map