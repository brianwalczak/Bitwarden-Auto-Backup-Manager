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
exports.ApiService = void 0;
const rxjs_1 = require("rxjs");
const organization_connection_response_1 = require("../admin-console/models/response/organization-connection.response");
const organization_export_response_1 = require("../admin-console/models/response/organization-export.response");
const organization_sponsorship_sync_status_response_1 = require("../admin-console/models/response/organization-sponsorship-sync-status.response");
const provider_organization_response_1 = require("../admin-console/models/response/provider/provider-organization.response");
const provider_user_bulk_public_key_response_1 = require("../admin-console/models/response/provider/provider-user-bulk-public-key.response");
const provider_user_bulk_response_1 = require("../admin-console/models/response/provider/provider-user-bulk.response");
const provider_user_response_1 = require("../admin-console/models/response/provider/provider-user.response");
const selection_read_only_response_1 = require("../admin-console/models/response/selection-read-only.response");
const device_request_1 = require("../auth/models/request/identity-token/device.request");
const token_two_factor_request_1 = require("../auth/models/request/identity-token/token-two-factor.request");
const user_api_token_request_1 = require("../auth/models/request/identity-token/user-api-token.request");
const api_key_response_1 = require("../auth/models/response/api-key.response");
const auth_request_response_1 = require("../auth/models/response/auth-request.response");
const device_verification_response_1 = require("../auth/models/response/device-verification.response");
const identity_captcha_response_1 = require("../auth/models/response/identity-captcha.response");
const identity_token_response_1 = require("../auth/models/response/identity-token.response");
const identity_two_factor_response_1 = require("../auth/models/response/identity-two-factor.response");
const key_connector_user_key_response_1 = require("../auth/models/response/key-connector-user-key.response");
const prelogin_response_1 = require("../auth/models/response/prelogin.response");
const register_response_1 = require("../auth/models/response/register.response");
const sso_pre_validate_response_1 = require("../auth/models/response/sso-pre-validate.response");
const two_factor_authenticator_response_1 = require("../auth/models/response/two-factor-authenticator.response");
const two_factor_duo_response_1 = require("../auth/models/response/two-factor-duo.response");
const two_factor_email_response_1 = require("../auth/models/response/two-factor-email.response");
const two_factor_provider_response_1 = require("../auth/models/response/two-factor-provider.response");
const two_factor_recover_response_1 = require("../auth/models/response/two-factor-recover.response");
const two_factor_web_authn_response_1 = require("../auth/models/response/two-factor-web-authn.response");
const two_factor_yubi_key_response_1 = require("../auth/models/response/two-factor-yubi-key.response");
const billing_history_response_1 = require("../billing/models/response/billing-history.response");
const billing_payment_response_1 = require("../billing/models/response/billing-payment.response");
const payment_response_1 = require("../billing/models/response/payment.response");
const plan_response_1 = require("../billing/models/response/plan.response");
const subscription_response_1 = require("../billing/models/response/subscription.response");
const tax_info_response_1 = require("../billing/models/response/tax-info.response");
const tax_rate_response_1 = require("../billing/models/response/tax-rate.response");
const enums_1 = require("../enums");
const collection_bulk_delete_request_1 = require("../models/request/collection-bulk-delete.request");
const breach_account_response_1 = require("../models/response/breach-account.response");
const domains_response_1 = require("../models/response/domains.response");
const error_response_1 = require("../models/response/error.response");
const event_response_1 = require("../models/response/event.response");
const list_response_1 = require("../models/response/list.response");
const profile_response_1 = require("../models/response/profile.response");
const user_key_response_1 = require("../models/response/user-key.response");
const utils_1 = require("../platform/misc/utils");
const sync_1 = require("../platform/sync");
const attachment_upload_data_response_1 = require("../vault/models/response/attachment-upload-data.response");
const attachment_response_1 = require("../vault/models/response/attachment.response");
const cipher_response_1 = require("../vault/models/response/cipher.response");
const collection_response_1 = require("../vault/models/response/collection.response");
const optional_cipher_response_1 = require("../vault/models/response/optional-cipher.response");
/**
 * @deprecated The `ApiService` class is deprecated and calls should be extracted into individual
 * api services. The `send` method is still allowed to be used within api services. For background
 * of this decision please read https://contributing.bitwarden.com/architecture/adr/refactor-api-service.
 */
class ApiService {
    constructor(tokenService, platformUtilsService, environmentService, appIdService, refreshAccessTokenErrorCallback, logService, logoutCallback, vaultTimeoutSettingsService, customUserAgent = null) {
        this.tokenService = tokenService;
        this.platformUtilsService = platformUtilsService;
        this.environmentService = environmentService;
        this.appIdService = appIdService;
        this.refreshAccessTokenErrorCallback = refreshAccessTokenErrorCallback;
        this.logService = logService;
        this.logoutCallback = logoutCallback;
        this.vaultTimeoutSettingsService = vaultTimeoutSettingsService;
        this.customUserAgent = customUserAgent;
        this.isWebClient = false;
        this.isDesktopClient = false;
        this.device = platformUtilsService.getDevice();
        this.deviceType = this.device.toString();
        this.isWebClient =
            this.device === enums_1.DeviceType.IEBrowser ||
                this.device === enums_1.DeviceType.ChromeBrowser ||
                this.device === enums_1.DeviceType.EdgeBrowser ||
                this.device === enums_1.DeviceType.FirefoxBrowser ||
                this.device === enums_1.DeviceType.OperaBrowser ||
                this.device === enums_1.DeviceType.SafariBrowser ||
                this.device === enums_1.DeviceType.UnknownBrowser ||
                this.device === enums_1.DeviceType.VivaldiBrowser;
        this.isDesktopClient =
            this.device === enums_1.DeviceType.WindowsDesktop ||
                this.device === enums_1.DeviceType.MacOsDesktop ||
                this.device === enums_1.DeviceType.LinuxDesktop ||
                this.device === enums_1.DeviceType.WindowsCLI ||
                this.device === enums_1.DeviceType.MacOsCLI ||
                this.device === enums_1.DeviceType.LinuxCLI;
    }
    // Auth APIs
    postIdentityToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = new Headers({
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                Accept: "application/json",
                "Device-Type": this.deviceType,
            });
            if (this.customUserAgent != null) {
                headers.set("User-Agent", this.customUserAgent);
            }
            request.alterIdentityTokenHeaders(headers);
            const identityToken = request instanceof user_api_token_request_1.UserApiTokenRequest
                ? request.toIdentityToken()
                : request.toIdentityToken(this.platformUtilsService.getClientType());
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const response = yield this.fetch(new Request(env.getIdentityUrl() + "/connect/token", {
                body: this.qsStringify(identityToken),
                credentials: yield this.getCredentials(),
                cache: "no-store",
                headers: headers,
                method: "POST",
            }));
            let responseJson = null;
            if (this.isJsonResponse(response)) {
                responseJson = yield response.json();
            }
            if (responseJson != null) {
                if (response.status === 200) {
                    return new identity_token_response_1.IdentityTokenResponse(responseJson);
                }
                else if (response.status === 400 &&
                    responseJson.TwoFactorProviders2 &&
                    Object.keys(responseJson.TwoFactorProviders2).length) {
                    return new identity_two_factor_response_1.IdentityTwoFactorResponse(responseJson);
                }
                else if (response.status === 400 &&
                    responseJson.HCaptcha_SiteKey &&
                    Object.keys(responseJson.HCaptcha_SiteKey).length) {
                    return new identity_captcha_response_1.IdentityCaptchaResponse(responseJson);
                }
            }
            return Promise.reject(new error_response_1.ErrorResponse(responseJson, response.status, true));
        });
    }
    refreshIdentityToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.refreshToken();
            }
            catch (e) {
                this.logService.error("Error refreshing access token: ", e);
                throw e;
            }
        });
    }
    // TODO: PM-3519: Create and move to AuthRequest Api service
    postAuthRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/auth-requests/", request, false, true);
            return new auth_request_response_1.AuthRequestResponse(r);
        });
    }
    postAdminAuthRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/auth-requests/admin-request", request, true, true);
            return new auth_request_response_1.AuthRequestResponse(r);
        });
    }
    getAuthResponse(id, accessCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/auth-requests/${id}/response?code=${accessCode}`;
            const r = yield this.send("GET", path, null, false, true);
            return new auth_request_response_1.AuthRequestResponse(r);
        });
    }
    getAuthRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/auth-requests/${id}`;
            const r = yield this.send("GET", path, null, true, true);
            return new auth_request_response_1.AuthRequestResponse(r);
        });
    }
    putAuthRequest(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/auth-requests/${id}`;
            const r = yield this.send("PUT", path, request, true, true);
            return new auth_request_response_1.AuthRequestResponse(r);
        });
    }
    getAuthRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/auth-requests/`;
            const r = yield this.send("GET", path, null, true, true);
            return new list_response_1.ListResponse(r, auth_request_response_1.AuthRequestResponse);
        });
    }
    getLastAuthRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield this.getAuthRequests();
            const activeRequests = requests.data.filter((m) => !m.isAnswered && !m.isExpired);
            const lastRequest = activeRequests.sort((a, b) => a.creationDate.localeCompare(b.creationDate))[activeRequests.length - 1];
            return lastRequest;
        });
    }
    // Account APIs
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/accounts/profile", null, true, true);
            return new profile_response_1.ProfileResponse(r);
        });
    }
    getUserSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/accounts/subscription", null, true, true);
            return new subscription_response_1.SubscriptionResponse(r);
        });
    }
    getTaxInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/accounts/tax", null, true, true);
            return new tax_info_response_1.TaxInfoResponse(r);
        });
    }
    putProfile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/accounts/profile", request, true, true);
            return new profile_response_1.ProfileResponse(r);
        });
    }
    putAvatar(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/accounts/avatar", request, true, true);
            return new profile_response_1.ProfileResponse(r);
        });
    }
    putTaxInfo(request) {
        return this.send("PUT", "/accounts/tax", request, true, false);
    }
    postPrelogin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const r = yield this.send("POST", "/accounts/prelogin", request, false, true, env.getIdentityUrl());
            return new prelogin_response_1.PreloginResponse(r);
        });
    }
    postEmailToken(request) {
        return this.send("POST", "/accounts/email-token", request, true, false);
    }
    postEmail(request) {
        return this.send("POST", "/accounts/email", request, true, false);
    }
    postPassword(request) {
        return this.send("POST", "/accounts/password", request, true, false);
    }
    setPassword(request) {
        return this.send("POST", "/accounts/set-password", request, true, false);
    }
    postSetKeyConnectorKey(request) {
        return this.send("POST", "/accounts/set-key-connector-key", request, true, false);
    }
    postSecurityStamp(request) {
        return this.send("POST", "/accounts/security-stamp", request, true, false);
    }
    getAccountRevisionDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/accounts/revision-date", null, true, true);
            return r;
        });
    }
    postPasswordHint(request) {
        return this.send("POST", "/accounts/password-hint", request, false, false);
    }
    postRegister(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const r = yield this.send("POST", "/accounts/register", request, false, true, env.getIdentityUrl());
            return new register_response_1.RegisterResponse(r);
        });
    }
    postPremium(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/accounts/premium", data, true, true);
            return new payment_response_1.PaymentResponse(r);
        });
    }
    postReinstatePremium() {
        return this.send("POST", "/accounts/reinstate-premium", null, true, false);
    }
    postAccountStorage(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/accounts/storage", request, true, true);
            return new payment_response_1.PaymentResponse(r);
        });
    }
    postAccountPayment(request) {
        return this.send("POST", "/accounts/payment", request, true, false);
    }
    postAccountLicense(data) {
        return this.send("POST", "/accounts/license", data, true, false);
    }
    postAccountKeys(request) {
        return this.send("POST", "/accounts/keys", request, true, false);
    }
    postAccountVerifyEmail() {
        return this.send("POST", "/accounts/verify-email", null, true, false);
    }
    postAccountVerifyEmailToken(request) {
        return this.send("POST", "/accounts/verify-email-token", request, false, false);
    }
    postAccountRecoverDelete(request) {
        return this.send("POST", "/accounts/delete-recover", request, false, false);
    }
    postAccountRecoverDeleteToken(request) {
        return this.send("POST", "/accounts/delete-recover-token", request, false, false);
    }
    postAccountKdf(request) {
        return this.send("POST", "/accounts/kdf", request, true, false);
    }
    deleteSsoUser(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send("DELETE", "/accounts/sso/" + organizationId, null, true, false);
        });
    }
    getSsoUserIdentifier() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send("GET", "/accounts/sso/user-identifier", null, true, true);
        });
    }
    postUserApiKey(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/accounts/api-key", request, true, true);
            return new api_key_response_1.ApiKeyResponse(r);
        });
    }
    postUserRotateApiKey(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/accounts/rotate-api-key", request, true, true);
            return new api_key_response_1.ApiKeyResponse(r);
        });
    }
    putUpdateTempPassword(request) {
        return this.send("PUT", "/accounts/update-temp-password", request, true, false);
    }
    postConvertToKeyConnector() {
        return this.send("POST", "/accounts/convert-to-key-connector", null, true, false);
    }
    // Account Billing APIs
    getUserBillingHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/accounts/billing/history", null, true, true);
            return new billing_history_response_1.BillingHistoryResponse(r);
        });
    }
    getUserBillingPayment() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/accounts/billing/payment-method", null, true, true);
            return new billing_payment_response_1.BillingPaymentResponse(r);
        });
    }
    // Cipher APIs
    getCipher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/ciphers/" + id, null, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    getFullCipherDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/ciphers/" + id + "/details", null, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    getCipherAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/ciphers/" + id + "/admin", null, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    getCiphersOrganization(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/ciphers/organization-details?organizationId=" + organizationId, null, true, true);
            return new list_response_1.ListResponse(r, cipher_response_1.CipherResponse);
        });
    }
    postCipher(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/ciphers", request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    postCipherCreate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/ciphers/create", request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    postCipherAdmin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/ciphers/admin", request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    putCipher(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/" + id, request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    putPartialCipher(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/" + id + "/partial", request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    putCipherAdmin(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/" + id + "/admin", request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    deleteCipher(id) {
        return this.send("DELETE", "/ciphers/" + id, null, true, false);
    }
    deleteCipherAdmin(id) {
        return this.send("DELETE", "/ciphers/" + id + "/admin", null, true, false);
    }
    deleteManyCiphers(request) {
        return this.send("DELETE", "/ciphers", request, true, false);
    }
    deleteManyCiphersAdmin(request) {
        return this.send("DELETE", "/ciphers/admin", request, true, false);
    }
    putMoveCiphers(request) {
        return this.send("PUT", "/ciphers/move", request, true, false);
    }
    putShareCipher(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/" + id + "/share", request, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    putShareCiphers(request) {
        return this.send("PUT", "/ciphers/share", request, true, false);
    }
    putCipherCollections(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.send("PUT", "/ciphers/" + id + "/collections_v2", request, true, true);
            return new optional_cipher_response_1.OptionalCipherResponse(response);
        });
    }
    putCipherCollectionsAdmin(id, request) {
        return this.send("PUT", "/ciphers/" + id + "/collections-admin", request, true, false);
    }
    postPurgeCiphers(request, organizationId = null) {
        let path = "/ciphers/purge";
        if (organizationId != null) {
            path += "?organizationId=" + organizationId;
        }
        return this.send("POST", path, request, true, false);
    }
    putDeleteCipher(id) {
        return this.send("PUT", "/ciphers/" + id + "/delete", null, true, false);
    }
    putDeleteCipherAdmin(id) {
        return this.send("PUT", "/ciphers/" + id + "/delete-admin", null, true, false);
    }
    putDeleteManyCiphers(request) {
        return this.send("PUT", "/ciphers/delete", request, true, false);
    }
    putDeleteManyCiphersAdmin(request) {
        return this.send("PUT", "/ciphers/delete-admin", request, true, false);
    }
    putRestoreCipher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/" + id + "/restore", null, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    putRestoreCipherAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/" + id + "/restore-admin", null, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    putRestoreManyCiphers(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/restore", request, true, true);
            return new list_response_1.ListResponse(r, cipher_response_1.CipherResponse);
        });
    }
    putRestoreManyCiphersAdmin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/ciphers/restore-admin", request, true, true);
            return new list_response_1.ListResponse(r, cipher_response_1.CipherResponse);
        });
    }
    // Attachments APIs
    getAttachmentData(cipherId, attachmentId, emergencyAccessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = (emergencyAccessId != null ? "/emergency-access/" + emergencyAccessId + "/" : "/ciphers/") +
                cipherId +
                "/attachment/" +
                attachmentId;
            const r = yield this.send("GET", path, null, true, true);
            return new attachment_response_1.AttachmentResponse(r);
        });
    }
    postCipherAttachment(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/ciphers/" + id + "/attachment/v2", request, true, true);
            return new attachment_upload_data_response_1.AttachmentUploadDataResponse(r);
        });
    }
    /**
     * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
     * This method still exists for backward compatibility with old server versions.
     */
    postCipherAttachmentLegacy(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/ciphers/" + id + "/attachment", data, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    /**
     * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
     * This method still exists for backward compatibility with old server versions.
     */
    postCipherAttachmentAdminLegacy(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/ciphers/" + id + "/attachment-admin", data, true, true);
            return new cipher_response_1.CipherResponse(r);
        });
    }
    deleteCipherAttachment(id, attachmentId) {
        return this.send("DELETE", "/ciphers/" + id + "/attachment/" + attachmentId, null, true, false);
    }
    deleteCipherAttachmentAdmin(id, attachmentId) {
        return this.send("DELETE", "/ciphers/" + id + "/attachment/" + attachmentId + "/admin", null, true, false);
    }
    postShareCipherAttachment(id, attachmentId, data, organizationId) {
        return this.send("POST", "/ciphers/" + id + "/attachment/" + attachmentId + "/share?organizationId=" + organizationId, data, true, false);
    }
    renewAttachmentUploadUrl(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/ciphers/" + id + "/attachment/" + attachmentId + "/renew", null, true, true);
            return new attachment_upload_data_response_1.AttachmentUploadDataResponse(r);
        });
    }
    postAttachmentFile(id, attachmentId, data) {
        return this.send("POST", "/ciphers/" + id + "/attachment/" + attachmentId, data, true, false);
    }
    // Collections APIs
    getCollectionAccessDetails(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/collections/" + id + "/details", null, true, true);
            return new collection_response_1.CollectionAccessDetailsResponse(r);
        });
    }
    getUserCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/collections", null, true, true);
            return new list_response_1.ListResponse(r, collection_response_1.CollectionResponse);
        });
    }
    getCollections(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/collections", null, true, true);
            return new list_response_1.ListResponse(r, collection_response_1.CollectionResponse);
        });
    }
    getManyCollectionsWithAccessDetails(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/collections/details", null, true, true);
            return new list_response_1.ListResponse(r, collection_response_1.CollectionAccessDetailsResponse);
        });
    }
    getCollectionUsers(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/collections/" + id + "/users", null, true, true);
            return r.map((dr) => new selection_read_only_response_1.SelectionReadOnlyResponse(dr));
        });
    }
    postCollection(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/organizations/" + organizationId + "/collections", request, true, true);
            return new collection_response_1.CollectionAccessDetailsResponse(r);
        });
    }
    putCollection(organizationId, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/organizations/" + organizationId + "/collections/" + id, request, true, true);
            return new collection_response_1.CollectionAccessDetailsResponse(r);
        });
    }
    putCollectionUsers(organizationId, id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send("PUT", "/organizations/" + organizationId + "/collections/" + id + "/users", request, true, false);
        });
    }
    deleteCollection(organizationId, id) {
        return this.send("DELETE", "/organizations/" + organizationId + "/collections/" + id, null, true, false);
    }
    deleteManyCollections(organizationId, collectionIds) {
        return this.send("DELETE", "/organizations/" + organizationId + "/collections", new collection_bulk_delete_request_1.CollectionBulkDeleteRequest(collectionIds), true, false);
    }
    deleteCollectionUser(organizationId, id, organizationUserId) {
        return this.send("DELETE", "/organizations/" + organizationId + "/collections/" + id + "/user/" + organizationUserId, null, true, false);
    }
    // Groups APIs
    getGroupUsers(organizationId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/groups/" + id + "/users", null, true, true);
            return r;
        });
    }
    deleteGroupUser(organizationId, id, organizationUserId) {
        return this.send("DELETE", "/organizations/" + organizationId + "/groups/" + id + "/user/" + organizationUserId, null, true, false);
    }
    // Plan APIs
    getPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/plans", null, false, true);
            return new list_response_1.ListResponse(r, plan_response_1.PlanResponse);
        });
    }
    postPublicImportDirectory(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send("POST", "/public/organization/import", request, true, false);
        });
    }
    getTaxRates() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/plans/sales-tax-rates/", null, true, true);
            return new list_response_1.ListResponse(r, tax_rate_response_1.TaxRateResponse);
        });
    }
    // Settings APIs
    getSettingsDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/settings/domains", null, true, true);
            return new domains_response_1.DomainsResponse(r);
        });
    }
    putSettingsDomains(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/settings/domains", request, true, true);
            return new domains_response_1.DomainsResponse(r);
        });
    }
    // Sync APIs
    getSync() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.isDesktopClient || this.isWebClient ? "/sync?excludeDomains=true" : "/sync";
            const r = yield this.send("GET", path, null, true, true);
            return new sync_1.SyncResponse(r);
        });
    }
    // Two-factor APIs
    getTwoFactorProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/two-factor", null, true, true);
            return new list_response_1.ListResponse(r, two_factor_provider_response_1.TwoFactorProviderResponse);
        });
    }
    getTwoFactorOrganizationProviders(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/two-factor", null, true, true);
            return new list_response_1.ListResponse(r, two_factor_provider_response_1.TwoFactorProviderResponse);
        });
    }
    getTwoFactorAuthenticator(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-authenticator", request, true, true);
            return new two_factor_authenticator_response_1.TwoFactorAuthenticatorResponse(r);
        });
    }
    getTwoFactorEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-email", request, true, true);
            return new two_factor_email_response_1.TwoFactorEmailResponse(r);
        });
    }
    getTwoFactorDuo(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-duo", request, true, true);
            return new two_factor_duo_response_1.TwoFactorDuoResponse(r);
        });
    }
    getTwoFactorOrganizationDuo(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/organizations/" + organizationId + "/two-factor/get-duo", request, true, true);
            return new two_factor_duo_response_1.TwoFactorDuoResponse(r);
        });
    }
    getTwoFactorYubiKey(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-yubikey", request, true, true);
            return new two_factor_yubi_key_response_1.TwoFactorYubiKeyResponse(r);
        });
    }
    getTwoFactorWebAuthn(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-webauthn", request, true, true);
            return new two_factor_web_authn_response_1.TwoFactorWebAuthnResponse(r);
        });
    }
    getTwoFactorWebAuthnChallenge(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-webauthn-challenge", request, true, true);
            return new two_factor_web_authn_response_1.ChallengeResponse(r);
        });
    }
    getTwoFactorRecover(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/two-factor/get-recover", request, true, true);
            return new two_factor_recover_response_1.TwoFactorRecoverResponse(r);
        });
    }
    putTwoFactorAuthenticator(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/two-factor/authenticator", request, true, true);
            return new two_factor_authenticator_response_1.TwoFactorAuthenticatorResponse(r);
        });
    }
    putTwoFactorEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/two-factor/email", request, true, true);
            return new two_factor_email_response_1.TwoFactorEmailResponse(r);
        });
    }
    putTwoFactorDuo(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/two-factor/duo", request, true, true);
            return new two_factor_duo_response_1.TwoFactorDuoResponse(r);
        });
    }
    putTwoFactorOrganizationDuo(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/organizations/" + organizationId + "/two-factor/duo", request, true, true);
            return new two_factor_duo_response_1.TwoFactorDuoResponse(r);
        });
    }
    putTwoFactorYubiKey(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/two-factor/yubikey", request, true, true);
            return new two_factor_yubi_key_response_1.TwoFactorYubiKeyResponse(r);
        });
    }
    putTwoFactorWebAuthn(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = request.deviceResponse.response;
            const data = Object.assign({}, request);
            data.deviceResponse = {
                id: request.deviceResponse.id,
                rawId: btoa(request.deviceResponse.id),
                type: request.deviceResponse.type,
                extensions: request.deviceResponse.getClientExtensionResults(),
                response: {
                    AttestationObject: utils_1.Utils.fromBufferToB64(response.attestationObject),
                    clientDataJson: utils_1.Utils.fromBufferToB64(response.clientDataJSON),
                },
            };
            const r = yield this.send("PUT", "/two-factor/webauthn", data, true, true);
            return new two_factor_web_authn_response_1.TwoFactorWebAuthnResponse(r);
        });
    }
    deleteTwoFactorWebAuthn(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("DELETE", "/two-factor/webauthn", request, true, true);
            return new two_factor_web_authn_response_1.TwoFactorWebAuthnResponse(r);
        });
    }
    putTwoFactorDisable(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/two-factor/disable", request, true, true);
            return new two_factor_provider_response_1.TwoFactorProviderResponse(r);
        });
    }
    putTwoFactorOrganizationDisable(organizationId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/organizations/" + organizationId + "/two-factor/disable", request, true, true);
            return new two_factor_provider_response_1.TwoFactorProviderResponse(r);
        });
    }
    postTwoFactorRecover(request) {
        return this.send("POST", "/two-factor/recover", request, false, false);
    }
    postTwoFactorEmailSetup(request) {
        return this.send("POST", "/two-factor/send-email", request, true, false);
    }
    postTwoFactorEmail(request) {
        return this.send("POST", "/two-factor/send-email-login", request, false, false);
    }
    getDeviceVerificationSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/two-factor/get-device-verification-settings", null, true, true);
            return new device_verification_response_1.DeviceVerificationResponse(r);
        });
    }
    putDeviceVerificationSettings(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/two-factor/device-verification-settings", request, true, true);
            return new device_verification_response_1.DeviceVerificationResponse(r);
        });
    }
    // Organization APIs
    getCloudCommunicationsEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/connections/enabled", null, true, true);
            return r;
        });
    }
    getOrganizationConnection(id, type, configType) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", `/organizations/connections/${id}/${type}`, null, true, true);
            return new organization_connection_response_1.OrganizationConnectionResponse(r, configType);
        });
    }
    createOrganizationConnection(request, configType) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/organizations/connections/", request, true, true);
            return new organization_connection_response_1.OrganizationConnectionResponse(r, configType);
        });
    }
    updateOrganizationConnection(request, configType, organizationConnectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("PUT", "/organizations/connections/" + organizationConnectionId, request, true, true);
            return new organization_connection_response_1.OrganizationConnectionResponse(r, configType);
        });
    }
    deleteOrganizationConnection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send("DELETE", "/organizations/connections/" + id, null, true, false);
        });
    }
    // Provider User APIs
    getProviderUsers(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/providers/" + providerId + "/users", null, true, true);
            return new list_response_1.ListResponse(r, provider_user_response_1.ProviderUserUserDetailsResponse);
        });
    }
    getProviderUser(providerId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/providers/" + providerId + "/users/" + id, null, true, true);
            return new provider_user_response_1.ProviderUserResponse(r);
        });
    }
    postProviderUserInvite(providerId, request) {
        return this.send("POST", "/providers/" + providerId + "/users/invite", request, true, false);
    }
    postProviderUserReinvite(providerId, id) {
        return this.send("POST", "/providers/" + providerId + "/users/" + id + "/reinvite", null, true, false);
    }
    postManyProviderUserReinvite(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/providers/" + providerId + "/users/reinvite", request, true, true);
            return new list_response_1.ListResponse(r, provider_user_bulk_response_1.ProviderUserBulkResponse);
        });
    }
    postProviderUserBulkConfirm(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/providers/" + providerId + "/users/confirm", request, true, true);
            return new list_response_1.ListResponse(r, provider_user_bulk_response_1.ProviderUserBulkResponse);
        });
    }
    deleteManyProviderUsers(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("DELETE", "/providers/" + providerId + "/users", request, true, true);
            return new list_response_1.ListResponse(r, provider_user_bulk_response_1.ProviderUserBulkResponse);
        });
    }
    postProviderUserAccept(providerId, id, request) {
        return this.send("POST", "/providers/" + providerId + "/users/" + id + "/accept", request, true, false);
    }
    postProviderUserConfirm(providerId, id, request) {
        return this.send("POST", "/providers/" + providerId + "/users/" + id + "/confirm", request, true, false);
    }
    postProviderUsersPublicKey(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/providers/" + providerId + "/users/public-keys", request, true, true);
            return new list_response_1.ListResponse(r, provider_user_bulk_public_key_response_1.ProviderUserBulkPublicKeyResponse);
        });
    }
    putProviderUser(providerId, id, request) {
        return this.send("PUT", "/providers/" + providerId + "/users/" + id, request, true, false);
    }
    deleteProviderUser(providerId, id) {
        return this.send("DELETE", "/providers/" + providerId + "/users/" + id, null, true, false);
    }
    // Provider Organization APIs
    getProviderClients(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/providers/" + providerId + "/organizations", null, true, true);
            return new list_response_1.ListResponse(r, provider_organization_response_1.ProviderOrganizationOrganizationDetailsResponse);
        });
    }
    postProviderAddOrganization(providerId, request) {
        return this.send("POST", "/providers/" + providerId + "/organizations/add", request, true, false);
    }
    postProviderCreateOrganization(providerId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/providers/" + providerId + "/organizations", request, true, true);
            return new provider_organization_response_1.ProviderOrganizationResponse(r);
        });
    }
    deleteProviderOrganization(providerId, id) {
        return this.send("DELETE", "/providers/" + providerId + "/organizations/" + id, null, true, false);
    }
    // Event APIs
    getEvents(start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", this.addEventParameters("/events", start, end, token), null, true, true);
            return new list_response_1.ListResponse(r, event_response_1.EventResponse);
        });
    }
    getEventsCipher(id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", this.addEventParameters("/ciphers/" + id + "/events", start, end, token), null, true, true);
            return new list_response_1.ListResponse(r, event_response_1.EventResponse);
        });
    }
    getEventsOrganization(id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", this.addEventParameters("/organizations/" + id + "/events", start, end, token), null, true, true);
            return new list_response_1.ListResponse(r, event_response_1.EventResponse);
        });
    }
    getEventsOrganizationUser(organizationId, id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", this.addEventParameters("/organizations/" + organizationId + "/users/" + id + "/events", start, end, token), null, true, true);
            return new list_response_1.ListResponse(r, event_response_1.EventResponse);
        });
    }
    getEventsProvider(id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", this.addEventParameters("/providers/" + id + "/events", start, end, token), null, true, true);
            return new list_response_1.ListResponse(r, event_response_1.EventResponse);
        });
    }
    getEventsProviderUser(providerId, id, start, end, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", this.addEventParameters("/providers/" + providerId + "/users/" + id + "/events", start, end, token), null, true, true);
            return new list_response_1.ListResponse(r, event_response_1.EventResponse);
        });
    }
    postEventsCollect(request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.tokenService.getAccessToken(userId);
            const headers = new Headers({
                "Device-Type": this.deviceType,
                Authorization: "Bearer " + authHeader,
                "Content-Type": "application/json; charset=utf-8",
            });
            if (this.customUserAgent != null) {
                headers.set("User-Agent", this.customUserAgent);
            }
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const response = yield this.fetch(new Request(env.getEventsUrl() + "/collect", {
                cache: "no-store",
                credentials: yield this.getCredentials(),
                method: "POST",
                body: JSON.stringify(request),
                headers: headers,
            }));
            if (response.status !== 200) {
                return Promise.reject("Event post failed.");
            }
        });
    }
    // User APIs
    getUserPublicKey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/users/" + id + "/public-key", null, true, true);
            return new user_key_response_1.UserKeyResponse(r);
        });
    }
    // HIBP APIs
    getHibpBreach(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/hibp/breach?username=" + username, null, true, true);
            return r.map((a) => new breach_account_response_1.BreachAccountResponse(a));
        });
    }
    // Misc
    postBitPayInvoice(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/bitpay-invoice", request, true, true);
            return r;
        });
    }
    postSetupPayment() {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/setup-payment", null, true, true);
            return r;
        });
    }
    // Key Connector
    getMasterKeyFromKeyConnector(keyConnectorUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.getActiveBearerToken();
            const response = yield this.fetch(new Request(keyConnectorUrl + "/user-keys", {
                cache: "no-store",
                method: "GET",
                headers: new Headers({
                    Accept: "application/json",
                    Authorization: "Bearer " + authHeader,
                }),
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false, true);
                return Promise.reject(error);
            }
            return new key_connector_user_key_response_1.KeyConnectorUserKeyResponse(yield response.json());
        });
    }
    postUserKeyToKeyConnector(keyConnectorUrl, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.getActiveBearerToken();
            const response = yield this.fetch(new Request(keyConnectorUrl + "/user-keys", {
                cache: "no-store",
                method: "POST",
                headers: new Headers({
                    Accept: "application/json",
                    Authorization: "Bearer " + authHeader,
                    "Content-Type": "application/json; charset=utf-8",
                }),
                body: JSON.stringify(request),
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false, true);
                return Promise.reject(error);
            }
        });
    }
    getKeyConnectorAlive(keyConnectorUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.fetch(new Request(keyConnectorUrl + "/alive", {
                cache: "no-store",
                method: "GET",
                headers: new Headers({
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8",
                }),
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false, true);
                return Promise.reject(error);
            }
        });
    }
    getOrganizationExport(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("GET", "/organizations/" + organizationId + "/export", null, true, true);
            return new organization_export_response_1.OrganizationExportResponse(r);
        });
    }
    // Helpers
    getActiveBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let accessToken = yield this.tokenService.getAccessToken();
            if (yield this.tokenService.tokenNeedsRefresh()) {
                accessToken = yield this.refreshToken();
            }
            return accessToken;
        });
    }
    fetch(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.method === "GET") {
                request.headers.set("Cache-Control", "no-store");
                request.headers.set("Pragma", "no-cache");
            }
            request.headers.set("Bitwarden-Client-Name", this.platformUtilsService.getClientType());
            request.headers.set("Bitwarden-Client-Version", yield this.platformUtilsService.getApplicationVersionNumber());
            return this.nativeFetch(request);
        });
    }
    nativeFetch(request) {
        return fetch(request);
    }
    preValidateSso(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            if (identifier == null || identifier === "") {
                throw new Error("Organization Identifier was not provided.");
            }
            const headers = new Headers({
                Accept: "application/json",
                "Device-Type": this.deviceType,
            });
            if (this.customUserAgent != null) {
                headers.set("User-Agent", this.customUserAgent);
            }
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const path = `/sso/prevalidate?domainHint=${encodeURIComponent(identifier)}`;
            const response = yield this.fetch(new Request(env.getIdentityUrl() + path, {
                cache: "no-store",
                credentials: yield this.getCredentials(),
                headers: headers,
                method: "GET",
            }));
            if (response.status === 200) {
                const body = yield response.json();
                return new sso_pre_validate_response_1.SsoPreValidateResponse(body);
            }
            else {
                const error = yield this.handleError(response, false, true);
                return Promise.reject(error);
            }
        });
    }
    postCreateSponsorship(sponsoredOrgId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send("POST", "/organization/sponsorship/" +
                (this.platformUtilsService.isSelfHost() ? "self-hosted/" : "") +
                sponsoredOrgId +
                "/families-for-enterprise", request, true, false);
        });
    }
    getSponsorshipSyncStatus(sponsoredOrgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.send("GET", "/organization/sponsorship/" + sponsoredOrgId + "/sync-status", null, true, true);
            return new organization_sponsorship_sync_status_response_1.OrganizationSponsorshipSyncStatusResponse(response);
        });
    }
    deleteRevokeSponsorship(sponsoringOrganizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send("DELETE", "/organization/sponsorship/" +
                (this.platformUtilsService.isSelfHost() ? "self-hosted/" : "") +
                sponsoringOrganizationId, null, true, false);
        });
    }
    deleteRemoveSponsorship(sponsoringOrgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send("DELETE", "/organization/sponsorship/sponsored/" + sponsoringOrgId, null, true, false);
        });
    }
    postPreValidateSponsorshipToken(sponsorshipToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.send("POST", "/organization/sponsorship/validate-token?sponsorshipToken=" +
                encodeURIComponent(sponsorshipToken), null, true, true);
            return r;
        });
    }
    postRedeemSponsorship(sponsorshipToken, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send("POST", "/organization/sponsorship/redeem?sponsorshipToken=" + encodeURIComponent(sponsorshipToken), request, true, false);
        });
    }
    postResendSponsorshipOffer(sponsoringOrgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send("POST", "/organization/sponsorship/" + sponsoringOrgId + "/families-for-enterprise/resend", null, true, false);
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.tokenService.getRefreshToken();
            if (refreshToken != null && refreshToken !== "") {
                return this.refreshAccessToken();
            }
            const clientId = yield this.tokenService.getClientId();
            const clientSecret = yield this.tokenService.getClientSecret();
            if (!utils_1.Utils.isNullOrWhitespace(clientId) && !utils_1.Utils.isNullOrWhitespace(clientSecret)) {
                return this.refreshApiToken();
            }
            this.refreshAccessTokenErrorCallback();
            throw new Error("Cannot refresh access token, no refresh token or api keys are stored.");
        });
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.tokenService.getRefreshToken();
            if (refreshToken == null || refreshToken === "") {
                throw new Error();
            }
            const headers = new Headers({
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                Accept: "application/json",
                "Device-Type": this.deviceType,
            });
            if (this.customUserAgent != null) {
                headers.set("User-Agent", this.customUserAgent);
            }
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            const decodedToken = yield this.tokenService.decodeAccessToken();
            const response = yield this.fetch(new Request(env.getIdentityUrl() + "/connect/token", {
                body: this.qsStringify({
                    grant_type: "refresh_token",
                    client_id: decodedToken.client_id,
                    refresh_token: refreshToken,
                }),
                cache: "no-store",
                credentials: yield this.getCredentials(),
                headers: headers,
                method: "POST",
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                const tokenResponse = new identity_token_response_1.IdentityTokenResponse(responseJson);
                const newDecodedAccessToken = yield this.tokenService.decodeAccessToken(tokenResponse.accessToken);
                const userId = newDecodedAccessToken.sub;
                const vaultTimeoutAction = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.getVaultTimeoutActionByUserId$(userId));
                const vaultTimeout = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.getVaultTimeoutByUserId$(userId));
                const refreshedTokens = yield this.tokenService.setTokens(tokenResponse.accessToken, vaultTimeoutAction, vaultTimeout, tokenResponse.refreshToken);
                return refreshedTokens.accessToken;
            }
            else {
                const error = yield this.handleError(response, true, true);
                return Promise.reject(error);
            }
        });
    }
    refreshApiToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const clientId = yield this.tokenService.getClientId();
            const clientSecret = yield this.tokenService.getClientSecret();
            const appId = yield this.appIdService.getAppId();
            const deviceRequest = new device_request_1.DeviceRequest(appId, this.platformUtilsService);
            const tokenRequest = new user_api_token_request_1.UserApiTokenRequest(clientId, clientSecret, new token_two_factor_request_1.TokenTwoFactorRequest(), deviceRequest);
            const response = yield this.postIdentityToken(tokenRequest);
            if (!(response instanceof identity_token_response_1.IdentityTokenResponse)) {
                throw new Error("Invalid response received when refreshing api token");
            }
            const newDecodedAccessToken = yield this.tokenService.decodeAccessToken(response.accessToken);
            const userId = newDecodedAccessToken.sub;
            const vaultTimeoutAction = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.getVaultTimeoutActionByUserId$(userId));
            const vaultTimeout = yield (0, rxjs_1.firstValueFrom)(this.vaultTimeoutSettingsService.getVaultTimeoutByUserId$(userId));
            const refreshedToken = yield this.tokenService.setAccessToken(response.accessToken, vaultTimeoutAction, vaultTimeout);
            return refreshedToken;
        });
    }
    send(method, path, body, authed, hasResponse, apiUrl, alterHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            apiUrl = utils_1.Utils.isNullOrWhitespace(apiUrl) ? env.getApiUrl() : apiUrl;
            // Prevent directory traversal from malicious paths
            const pathParts = path.split("?");
            const requestUrl = apiUrl + utils_1.Utils.normalizePath(pathParts[0]) + (pathParts.length > 1 ? `?${pathParts[1]}` : "");
            const headers = new Headers({
                "Device-Type": this.deviceType,
            });
            if (this.customUserAgent != null) {
                headers.set("User-Agent", this.customUserAgent);
            }
            const requestInit = {
                cache: "no-store",
                credentials: yield this.getCredentials(),
                method: method,
            };
            if (authed) {
                const authHeader = yield this.getActiveBearerToken();
                headers.set("Authorization", "Bearer " + authHeader);
            }
            if (body != null) {
                if (typeof body === "string") {
                    requestInit.body = body;
                    headers.set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
                }
                else if (typeof body === "object") {
                    if (body instanceof FormData) {
                        requestInit.body = body;
                    }
                    else {
                        headers.set("Content-Type", "application/json; charset=utf-8");
                        requestInit.body = JSON.stringify(body);
                    }
                }
            }
            if (hasResponse) {
                headers.set("Accept", "application/json");
            }
            if (alterHeaders != null) {
                alterHeaders(headers);
            }
            requestInit.headers = headers;
            const response = yield this.fetch(new Request(requestUrl, requestInit));
            const responseType = response.headers.get("content-type");
            const responseIsJson = responseType != null && responseType.indexOf("application/json") !== -1;
            const responseIsCsv = responseType != null && responseType.indexOf("text/csv") !== -1;
            if (hasResponse && response.status === 200 && responseIsJson) {
                const responseJson = yield response.json();
                return responseJson;
            }
            else if (hasResponse && response.status === 200 && responseIsCsv) {
                return yield response.text();
            }
            else if (response.status !== 200) {
                const error = yield this.handleError(response, false, authed);
                return Promise.reject(error);
            }
        });
    }
    handleError(response, tokenError, authed) {
        return __awaiter(this, void 0, void 0, function* () {
            let responseJson = null;
            if (this.isJsonResponse(response)) {
                responseJson = yield response.json();
            }
            else if (this.isTextResponse(response)) {
                responseJson = { Message: yield response.text() };
            }
            if (authed) {
                if (response.status === 401 ||
                    response.status === 403 ||
                    (tokenError &&
                        response.status === 400 &&
                        responseJson != null &&
                        responseJson.error === "invalid_grant")) {
                    yield this.logoutCallback("invalidGrantError");
                    return null;
                }
            }
            return new error_response_1.ErrorResponse(responseJson, response.status, tokenError);
        });
    }
    qsStringify(params) {
        return Object.keys(params)
            .map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        })
            .join("&");
    }
    getCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            const env = yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$);
            if (!this.isWebClient || env.hasBaseUrl()) {
                return "include";
            }
            return undefined;
        });
    }
    addEventParameters(base, start, end, token) {
        if (start != null) {
            base += "?start=" + start;
        }
        if (end != null) {
            base += base.indexOf("?") > -1 ? "&" : "?";
            base += "end=" + end;
        }
        if (token != null) {
            base += base.indexOf("?") > -1 ? "&" : "?";
            base += "continuationToken=" + token;
        }
        return base;
    }
    isJsonResponse(response) {
        const typeHeader = response.headers.get("content-type");
        return typeHeader != null && typeHeader.indexOf("application/json") > -1;
    }
    isTextResponse(response) {
        const typeHeader = response.headers.get("content-type");
        return typeHeader != null && typeHeader.indexOf("text") > -1;
    }
}
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map