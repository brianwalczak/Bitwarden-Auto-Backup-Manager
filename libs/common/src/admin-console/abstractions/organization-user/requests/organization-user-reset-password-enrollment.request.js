"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUserResetPasswordWithIdRequest = exports.OrganizationUserResetPasswordEnrollmentRequest = void 0;
const secret_verification_request_1 = require("../../../../auth/models/request/secret-verification.request");
class OrganizationUserResetPasswordEnrollmentRequest extends secret_verification_request_1.SecretVerificationRequest {
}
exports.OrganizationUserResetPasswordEnrollmentRequest = OrganizationUserResetPasswordEnrollmentRequest;
class OrganizationUserResetPasswordWithIdRequest extends OrganizationUserResetPasswordEnrollmentRequest {
}
exports.OrganizationUserResetPasswordWithIdRequest = OrganizationUserResetPasswordWithIdRequest;
//# sourceMappingURL=organization-user-reset-password-enrollment.request.js.map