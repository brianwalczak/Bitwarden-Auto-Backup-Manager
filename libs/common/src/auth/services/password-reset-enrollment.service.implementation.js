"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetEnrollmentServiceImplementation = void 0;
const rxjs_1 = require("rxjs");
const requests_1 = require("../../admin-console/abstractions/organization-user/requests");
const utils_1 = require("../../platform/misc/utils");
class PasswordResetEnrollmentServiceImplementation {
    constructor(organizationApiService, accountService, cryptoService, organizationUserService, i18nService) {
        this.organizationApiService = organizationApiService;
        this.accountService = accountService;
        this.cryptoService = cryptoService;
        this.organizationUserService = organizationUserService;
        this.i18nService = i18nService;
    }
    enrollIfRequired(organizationSsoIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const orgAutoEnrollStatusResponse = yield this.organizationApiService.getAutoEnrollStatus(organizationSsoIdentifier);
            if (!orgAutoEnrollStatusResponse.resetPasswordEnabled) {
                yield this.enroll(orgAutoEnrollStatusResponse.id, null, null);
            }
        });
    }
    enroll(organizationId, userId, userKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const orgKeyResponse = yield this.organizationApiService.getKeys(organizationId);
            if (orgKeyResponse == null) {
                throw new Error(this.i18nService.t("resetPasswordOrgKeysError"));
            }
            const orgPublicKey = utils_1.Utils.fromB64ToArray(orgKeyResponse.publicKey);
            userId =
                userId !== null && userId !== void 0 ? userId : (yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id))));
            userKey = userKey !== null && userKey !== void 0 ? userKey : (yield this.cryptoService.getUserKey(userId));
            // RSA Encrypt user's userKey.key with organization public key
            const encryptedKey = yield this.cryptoService.rsaEncrypt(userKey.key, orgPublicKey);
            const resetRequest = new requests_1.OrganizationUserResetPasswordEnrollmentRequest();
            resetRequest.resetPasswordKey = encryptedKey.encryptedString;
            yield this.organizationUserService.putOrganizationUserResetPasswordEnrollment(organizationId, userId, resetRequest);
        });
    }
}
exports.PasswordResetEnrollmentServiceImplementation = PasswordResetEnrollmentServiceImplementation;
//# sourceMappingURL=password-reset-enrollment.service.implementation.js.map