"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherData = void 0;
const cipher_type_1 = require("../../enums/cipher-type");
const attachment_data_1 = require("./attachment.data");
const card_data_1 = require("./card.data");
const field_data_1 = require("./field.data");
const identity_data_1 = require("./identity.data");
const login_data_1 = require("./login.data");
const password_history_data_1 = require("./password-history.data");
const secure_note_data_1 = require("./secure-note.data");
class CipherData {
    constructor(response, collectionIds) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.folderId = response.folderId;
        this.edit = response.edit;
        this.viewPassword = response.viewPassword;
        this.organizationUseTotp = response.organizationUseTotp;
        this.favorite = response.favorite;
        this.revisionDate = response.revisionDate;
        this.type = response.type;
        this.name = response.name;
        this.notes = response.notes;
        this.collectionIds = collectionIds != null ? collectionIds : response.collectionIds;
        this.creationDate = response.creationDate;
        this.deletedDate = response.deletedDate;
        this.reprompt = response.reprompt;
        this.key = response.key;
        switch (this.type) {
            case cipher_type_1.CipherType.Login:
                this.login = new login_data_1.LoginData(response.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                this.secureNote = new secure_note_data_1.SecureNoteData(response.secureNote);
                break;
            case cipher_type_1.CipherType.Card:
                this.card = new card_data_1.CardData(response.card);
                break;
            case cipher_type_1.CipherType.Identity:
                this.identity = new identity_data_1.IdentityData(response.identity);
                break;
            default:
                break;
        }
        if (response.fields != null) {
            this.fields = response.fields.map((f) => new field_data_1.FieldData(f));
        }
        if (response.attachments != null) {
            this.attachments = response.attachments.map((a) => new attachment_data_1.AttachmentData(a));
        }
        if (response.passwordHistory != null) {
            this.passwordHistory = response.passwordHistory.map((ph) => new password_history_data_1.PasswordHistoryData(ph));
        }
    }
    static fromJSON(obj) {
        return Object.assign(new CipherData(), obj);
    }
}
exports.CipherData = CipherData;
//# sourceMappingURL=cipher.data.js.map