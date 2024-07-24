"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherRequest = void 0;
const cipher_type_1 = require("../../enums/cipher-type");
const card_api_1 = require("../api/card.api");
const fido2_credential_api_1 = require("../api/fido2-credential.api");
const field_api_1 = require("../api/field.api");
const identity_api_1 = require("../api/identity.api");
const login_uri_api_1 = require("../api/login-uri.api");
const login_api_1 = require("../api/login.api");
const secure_note_api_1 = require("../api/secure-note.api");
const attachment_request_1 = require("./attachment.request");
class CipherRequest {
    constructor(cipher) {
        var _a, _b, _c;
        this.type = cipher.type;
        this.folderId = cipher.folderId;
        this.organizationId = cipher.organizationId;
        this.name = cipher.name ? cipher.name.encryptedString : null;
        this.notes = cipher.notes ? cipher.notes.encryptedString : null;
        this.favorite = cipher.favorite;
        this.lastKnownRevisionDate = cipher.revisionDate;
        this.reprompt = cipher.reprompt;
        this.key = (_a = cipher.key) === null || _a === void 0 ? void 0 : _a.encryptedString;
        switch (this.type) {
            case cipher_type_1.CipherType.Login:
                this.login = new login_api_1.LoginApi();
                this.login.uris =
                    (_c = (_b = cipher.login.uris) === null || _b === void 0 ? void 0 : _b.map((u) => {
                        const uri = new login_uri_api_1.LoginUriApi();
                        uri.uri = u.uri != null ? u.uri.encryptedString : null;
                        uri.match = u.match != null ? u.match : null;
                        uri.uriChecksum = u.uriChecksum != null ? u.uriChecksum.encryptedString : null;
                        return uri;
                    })) !== null && _c !== void 0 ? _c : [];
                this.login.username = cipher.login.username ? cipher.login.username.encryptedString : null;
                this.login.password = cipher.login.password ? cipher.login.password.encryptedString : null;
                this.login.passwordRevisionDate =
                    cipher.login.passwordRevisionDate != null
                        ? cipher.login.passwordRevisionDate.toISOString()
                        : null;
                this.login.totp = cipher.login.totp ? cipher.login.totp.encryptedString : null;
                this.login.autofillOnPageLoad = cipher.login.autofillOnPageLoad;
                if (cipher.login.fido2Credentials != null) {
                    this.login.fido2Credentials = cipher.login.fido2Credentials.map((key) => {
                        const keyApi = new fido2_credential_api_1.Fido2CredentialApi();
                        keyApi.credentialId =
                            key.credentialId != null ? key.credentialId.encryptedString : null;
                        keyApi.keyType =
                            key.keyType != null ? key.keyType.encryptedString : null;
                        keyApi.keyAlgorithm =
                            key.keyAlgorithm != null ? key.keyAlgorithm.encryptedString : null;
                        keyApi.keyCurve =
                            key.keyCurve != null ? key.keyCurve.encryptedString : null;
                        keyApi.keyValue = key.keyValue != null ? key.keyValue.encryptedString : null;
                        keyApi.rpId = key.rpId != null ? key.rpId.encryptedString : null;
                        keyApi.rpName = key.rpName != null ? key.rpName.encryptedString : null;
                        keyApi.counter = key.counter != null ? key.counter.encryptedString : null;
                        keyApi.userHandle = key.userHandle != null ? key.userHandle.encryptedString : null;
                        keyApi.userName = key.userName != null ? key.userName.encryptedString : null;
                        keyApi.userDisplayName =
                            key.userDisplayName != null ? key.userDisplayName.encryptedString : null;
                        keyApi.discoverable =
                            key.discoverable != null ? key.discoverable.encryptedString : null;
                        keyApi.creationDate = key.creationDate != null ? key.creationDate.toISOString() : null;
                        return keyApi;
                    });
                }
                break;
            case cipher_type_1.CipherType.SecureNote:
                this.secureNote = new secure_note_api_1.SecureNoteApi();
                this.secureNote.type = cipher.secureNote.type;
                break;
            case cipher_type_1.CipherType.Card:
                this.card = new card_api_1.CardApi();
                this.card.cardholderName =
                    cipher.card.cardholderName != null ? cipher.card.cardholderName.encryptedString : null;
                this.card.brand = cipher.card.brand != null ? cipher.card.brand.encryptedString : null;
                this.card.number = cipher.card.number != null ? cipher.card.number.encryptedString : null;
                this.card.expMonth =
                    cipher.card.expMonth != null ? cipher.card.expMonth.encryptedString : null;
                this.card.expYear =
                    cipher.card.expYear != null ? cipher.card.expYear.encryptedString : null;
                this.card.code = cipher.card.code != null ? cipher.card.code.encryptedString : null;
                break;
            case cipher_type_1.CipherType.Identity:
                this.identity = new identity_api_1.IdentityApi();
                this.identity.title =
                    cipher.identity.title != null ? cipher.identity.title.encryptedString : null;
                this.identity.firstName =
                    cipher.identity.firstName != null ? cipher.identity.firstName.encryptedString : null;
                this.identity.middleName =
                    cipher.identity.middleName != null ? cipher.identity.middleName.encryptedString : null;
                this.identity.lastName =
                    cipher.identity.lastName != null ? cipher.identity.lastName.encryptedString : null;
                this.identity.address1 =
                    cipher.identity.address1 != null ? cipher.identity.address1.encryptedString : null;
                this.identity.address2 =
                    cipher.identity.address2 != null ? cipher.identity.address2.encryptedString : null;
                this.identity.address3 =
                    cipher.identity.address3 != null ? cipher.identity.address3.encryptedString : null;
                this.identity.city =
                    cipher.identity.city != null ? cipher.identity.city.encryptedString : null;
                this.identity.state =
                    cipher.identity.state != null ? cipher.identity.state.encryptedString : null;
                this.identity.postalCode =
                    cipher.identity.postalCode != null ? cipher.identity.postalCode.encryptedString : null;
                this.identity.country =
                    cipher.identity.country != null ? cipher.identity.country.encryptedString : null;
                this.identity.company =
                    cipher.identity.company != null ? cipher.identity.company.encryptedString : null;
                this.identity.email =
                    cipher.identity.email != null ? cipher.identity.email.encryptedString : null;
                this.identity.phone =
                    cipher.identity.phone != null ? cipher.identity.phone.encryptedString : null;
                this.identity.ssn =
                    cipher.identity.ssn != null ? cipher.identity.ssn.encryptedString : null;
                this.identity.username =
                    cipher.identity.username != null ? cipher.identity.username.encryptedString : null;
                this.identity.passportNumber =
                    cipher.identity.passportNumber != null
                        ? cipher.identity.passportNumber.encryptedString
                        : null;
                this.identity.licenseNumber =
                    cipher.identity.licenseNumber != null
                        ? cipher.identity.licenseNumber.encryptedString
                        : null;
                break;
            default:
                break;
        }
        if (cipher.fields != null) {
            this.fields = cipher.fields.map((f) => {
                const field = new field_api_1.FieldApi();
                field.type = f.type;
                field.name = f.name ? f.name.encryptedString : null;
                field.value = f.value ? f.value.encryptedString : null;
                field.linkedId = f.linkedId;
                return field;
            });
        }
        if (cipher.passwordHistory != null) {
            this.passwordHistory = [];
            cipher.passwordHistory.forEach((ph) => {
                this.passwordHistory.push({
                    lastUsedDate: ph.lastUsedDate,
                    password: ph.password ? ph.password.encryptedString : null,
                });
            });
        }
        if (cipher.attachments != null) {
            this.attachments = {};
            this.attachments2 = {};
            cipher.attachments.forEach((attachment) => {
                const fileName = attachment.fileName ? attachment.fileName.encryptedString : null;
                this.attachments[attachment.id] = fileName;
                const attachmentRequest = new attachment_request_1.AttachmentRequest();
                attachmentRequest.fileName = fileName;
                if (attachment.key != null) {
                    attachmentRequest.key = attachment.key.encryptedString;
                }
                this.attachments2[attachment.id] = attachmentRequest;
            });
        }
    }
}
exports.CipherRequest = CipherRequest;
//# sourceMappingURL=cipher.request.js.map