"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherView = void 0;
const initializer_key_1 = require("../../../platform/services/cryptography/initializer-key");
const cipher_reprompt_type_1 = require("../../enums/cipher-reprompt-type");
const cipher_type_1 = require("../../enums/cipher-type");
const attachment_view_1 = require("./attachment.view");
const card_view_1 = require("./card.view");
const field_view_1 = require("./field.view");
const identity_view_1 = require("./identity.view");
const login_view_1 = require("./login.view");
const password_history_view_1 = require("./password-history.view");
const secure_note_view_1 = require("./secure-note.view");
class CipherView {
    constructor(c) {
        var _a;
        this.initializerKey = initializer_key_1.InitializerKey.CipherView;
        this.id = null;
        this.organizationId = null;
        this.folderId = null;
        this.name = null;
        this.notes = null;
        this.type = null;
        this.favorite = false;
        this.organizationUseTotp = false;
        this.edit = false;
        this.viewPassword = true;
        this.login = new login_view_1.LoginView();
        this.identity = new identity_view_1.IdentityView();
        this.card = new card_view_1.CardView();
        this.secureNote = new secure_note_view_1.SecureNoteView();
        this.attachments = null;
        this.fields = null;
        this.passwordHistory = null;
        this.collectionIds = null;
        this.revisionDate = null;
        this.creationDate = null;
        this.deletedDate = null;
        this.reprompt = cipher_reprompt_type_1.CipherRepromptType.None;
        if (!c) {
            return;
        }
        this.id = c.id;
        this.organizationId = c.organizationId;
        this.folderId = c.folderId;
        this.favorite = c.favorite;
        this.organizationUseTotp = c.organizationUseTotp;
        this.edit = c.edit;
        this.viewPassword = c.viewPassword;
        this.type = c.type;
        this.localData = c.localData;
        this.collectionIds = c.collectionIds;
        this.revisionDate = c.revisionDate;
        this.creationDate = c.creationDate;
        this.deletedDate = c.deletedDate;
        // Old locally stored ciphers might have reprompt == null. If so set it to None.
        this.reprompt = (_a = c.reprompt) !== null && _a !== void 0 ? _a : cipher_reprompt_type_1.CipherRepromptType.None;
    }
    get item() {
        switch (this.type) {
            case cipher_type_1.CipherType.Login:
                return this.login;
            case cipher_type_1.CipherType.SecureNote:
                return this.secureNote;
            case cipher_type_1.CipherType.Card:
                return this.card;
            case cipher_type_1.CipherType.Identity:
                return this.identity;
            default:
                break;
        }
        return null;
    }
    get subTitle() {
        var _a;
        return (_a = this.item) === null || _a === void 0 ? void 0 : _a.subTitle;
    }
    get hasPasswordHistory() {
        return this.passwordHistory && this.passwordHistory.length > 0;
    }
    get hasAttachments() {
        return this.attachments && this.attachments.length > 0;
    }
    get hasOldAttachments() {
        if (this.hasAttachments) {
            for (let i = 0; i < this.attachments.length; i++) {
                if (this.attachments[i].key == null) {
                    return true;
                }
            }
        }
        return false;
    }
    get hasFields() {
        return this.fields && this.fields.length > 0;
    }
    get passwordRevisionDisplayDate() {
        if (this.type !== cipher_type_1.CipherType.Login || this.login == null) {
            return null;
        }
        else if (this.login.password == null || this.login.password === "") {
            return null;
        }
        return this.login.passwordRevisionDate;
    }
    get isDeleted() {
        return this.deletedDate != null;
    }
    get linkedFieldOptions() {
        var _a;
        return (_a = this.item) === null || _a === void 0 ? void 0 : _a.linkedFieldOptions;
    }
    get isUnassigned() {
        return (this.organizationId != null && (this.collectionIds == null || this.collectionIds.length === 0));
    }
    linkedFieldValue(id) {
        var _a;
        const linkedFieldOption = (_a = this.linkedFieldOptions) === null || _a === void 0 ? void 0 : _a.get(id);
        if (linkedFieldOption == null) {
            return null;
        }
        const item = this.item;
        return this.item[linkedFieldOption.propertyKey];
    }
    linkedFieldI18nKey(id) {
        var _a;
        return (_a = this.linkedFieldOptions.get(id)) === null || _a === void 0 ? void 0 : _a.i18nKey;
    }
    // This is used as a marker to indicate that the cipher view object still has its prototype
    toJSON() {
        return this;
    }
    static fromJSON(obj) {
        var _a, _b, _c;
        if (obj == null) {
            return null;
        }
        const view = new CipherView();
        const revisionDate = obj.revisionDate == null ? null : new Date(obj.revisionDate);
        const deletedDate = obj.deletedDate == null ? null : new Date(obj.deletedDate);
        const attachments = (_a = obj.attachments) === null || _a === void 0 ? void 0 : _a.map((a) => attachment_view_1.AttachmentView.fromJSON(a));
        const fields = (_b = obj.fields) === null || _b === void 0 ? void 0 : _b.map((f) => field_view_1.FieldView.fromJSON(f));
        const passwordHistory = (_c = obj.passwordHistory) === null || _c === void 0 ? void 0 : _c.map((ph) => password_history_view_1.PasswordHistoryView.fromJSON(ph));
        Object.assign(view, obj, {
            revisionDate: revisionDate,
            deletedDate: deletedDate,
            attachments: attachments,
            fields: fields,
            passwordHistory: passwordHistory,
        });
        switch (obj.type) {
            case cipher_type_1.CipherType.Card:
                view.card = card_view_1.CardView.fromJSON(obj.card);
                break;
            case cipher_type_1.CipherType.Identity:
                view.identity = identity_view_1.IdentityView.fromJSON(obj.identity);
                break;
            case cipher_type_1.CipherType.Login:
                view.login = login_view_1.LoginView.fromJSON(obj.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                view.secureNote = secure_note_view_1.SecureNoteView.fromJSON(obj.secureNote);
                break;
            default:
                break;
        }
        return view;
    }
}
exports.CipherView = CipherView;
//# sourceMappingURL=cipher.view.js.map