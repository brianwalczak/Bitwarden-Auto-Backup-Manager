"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const cipher_reprompt_type_1 = require("../../enums/cipher-reprompt-type");
const card_api_1 = require("../api/card.api");
const field_api_1 = require("../api/field.api");
const identity_api_1 = require("../api/identity.api");
const login_api_1 = require("../api/login.api");
const secure_note_api_1 = require("../api/secure-note.api");
const attachment_response_1 = require("./attachment.response");
const password_history_response_1 = require("./password-history.response");
class CipherResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.folderId = this.getResponseProperty("FolderId") || null;
        this.type = this.getResponseProperty("Type");
        this.name = this.getResponseProperty("Name");
        this.notes = this.getResponseProperty("Notes");
        this.favorite = this.getResponseProperty("Favorite") || false;
        this.edit = !!this.getResponseProperty("Edit");
        if (this.getResponseProperty("ViewPassword") == null) {
            this.viewPassword = true;
        }
        else {
            this.viewPassword = this.getResponseProperty("ViewPassword");
        }
        this.organizationUseTotp = this.getResponseProperty("OrganizationUseTotp");
        this.revisionDate = this.getResponseProperty("RevisionDate");
        this.collectionIds = this.getResponseProperty("CollectionIds");
        this.creationDate = this.getResponseProperty("CreationDate");
        this.deletedDate = this.getResponseProperty("DeletedDate");
        const login = this.getResponseProperty("Login");
        if (login != null) {
            this.login = new login_api_1.LoginApi(login);
        }
        const card = this.getResponseProperty("Card");
        if (card != null) {
            this.card = new card_api_1.CardApi(card);
        }
        const identity = this.getResponseProperty("Identity");
        if (identity != null) {
            this.identity = new identity_api_1.IdentityApi(identity);
        }
        const secureNote = this.getResponseProperty("SecureNote");
        if (secureNote != null) {
            this.secureNote = new secure_note_api_1.SecureNoteApi(secureNote);
        }
        const fields = this.getResponseProperty("Fields");
        if (fields != null) {
            this.fields = fields.map((f) => new field_api_1.FieldApi(f));
        }
        const attachments = this.getResponseProperty("Attachments");
        if (attachments != null) {
            this.attachments = attachments.map((a) => new attachment_response_1.AttachmentResponse(a));
        }
        const passwordHistory = this.getResponseProperty("PasswordHistory");
        if (passwordHistory != null) {
            this.passwordHistory = passwordHistory.map((h) => new password_history_response_1.PasswordHistoryResponse(h));
        }
        this.reprompt = this.getResponseProperty("Reprompt") || cipher_reprompt_type_1.CipherRepromptType.None;
        this.key = this.getResponseProperty("Key") || null;
    }
}
exports.CipherResponse = CipherResponse;
//# sourceMappingURL=cipher.response.js.map