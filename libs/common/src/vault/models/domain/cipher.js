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
exports.Cipher = void 0;
const utils_1 = require("../../../platform/misc/utils");
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const symmetric_crypto_key_1 = require("../../../platform/models/domain/symmetric-crypto-key");
const initializer_key_1 = require("../../../platform/services/cryptography/initializer-key");
const cipher_type_1 = require("../../enums/cipher-type");
const cipher_data_1 = require("../data/cipher.data");
const cipher_view_1 = require("../view/cipher.view");
const attachment_1 = require("./attachment");
const card_1 = require("./card");
const field_1 = require("./field");
const identity_1 = require("./identity");
const login_1 = require("./login");
const password_1 = require("./password");
const secure_note_1 = require("./secure-note");
class Cipher extends domain_base_1.default {
    constructor(obj, localData = null) {
        super();
        this.initializerKey = initializer_key_1.InitializerKey.Cipher;
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            organizationId: null,
            folderId: null,
            name: null,
            notes: null,
            key: null,
        }, ["id", "organizationId", "folderId"]);
        this.type = obj.type;
        this.favorite = obj.favorite;
        this.organizationUseTotp = obj.organizationUseTotp;
        this.edit = obj.edit;
        if (obj.viewPassword != null) {
            this.viewPassword = obj.viewPassword;
        }
        else {
            this.viewPassword = true; // Default for already synced Ciphers without viewPassword
        }
        this.revisionDate = obj.revisionDate != null ? new Date(obj.revisionDate) : null;
        this.collectionIds = obj.collectionIds;
        this.localData = localData;
        this.creationDate = obj.creationDate != null ? new Date(obj.creationDate) : null;
        this.deletedDate = obj.deletedDate != null ? new Date(obj.deletedDate) : null;
        this.reprompt = obj.reprompt;
        switch (this.type) {
            case cipher_type_1.CipherType.Login:
                this.login = new login_1.Login(obj.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                this.secureNote = new secure_note_1.SecureNote(obj.secureNote);
                break;
            case cipher_type_1.CipherType.Card:
                this.card = new card_1.Card(obj.card);
                break;
            case cipher_type_1.CipherType.Identity:
                this.identity = new identity_1.Identity(obj.identity);
                break;
            default:
                break;
        }
        if (obj.attachments != null) {
            this.attachments = obj.attachments.map((a) => new attachment_1.Attachment(a));
        }
        else {
            this.attachments = null;
        }
        if (obj.fields != null) {
            this.fields = obj.fields.map((f) => new field_1.Field(f));
        }
        else {
            this.fields = null;
        }
        if (obj.passwordHistory != null) {
            this.passwordHistory = obj.passwordHistory.map((ph) => new password_1.Password(ph));
        }
        else {
            this.passwordHistory = null;
        }
    }
    // We are passing the organizationId into the EncString.decrypt() method here, but because the encKey will always be
    // present and so the organizationId will not be used.
    // We will refactor the EncString.decrypt() in https://bitwarden.atlassian.net/browse/PM-3762 to remove the dependency on the organizationId.
    decrypt(encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new cipher_view_1.CipherView(this);
            let bypassValidation = true;
            if (this.key != null) {
                const encryptService = utils_1.Utils.getContainerService().getEncryptService();
                encKey = new symmetric_crypto_key_1.SymmetricCryptoKey(yield encryptService.decryptToBytes(this.key, encKey));
                bypassValidation = false;
            }
            yield this.decryptObj(model, {
                name: null,
                notes: null,
            }, this.organizationId, encKey);
            switch (this.type) {
                case cipher_type_1.CipherType.Login:
                    model.login = yield this.login.decrypt(this.organizationId, bypassValidation, encKey);
                    break;
                case cipher_type_1.CipherType.SecureNote:
                    model.secureNote = yield this.secureNote.decrypt(this.organizationId, encKey);
                    break;
                case cipher_type_1.CipherType.Card:
                    model.card = yield this.card.decrypt(this.organizationId, encKey);
                    break;
                case cipher_type_1.CipherType.Identity:
                    model.identity = yield this.identity.decrypt(this.organizationId, encKey);
                    break;
                default:
                    break;
            }
            if (this.attachments != null && this.attachments.length > 0) {
                const attachments = [];
                yield this.attachments.reduce((promise, attachment) => {
                    return promise
                        .then(() => {
                        return attachment.decrypt(this.organizationId, encKey);
                    })
                        .then((decAttachment) => {
                        attachments.push(decAttachment);
                    });
                }, Promise.resolve());
                model.attachments = attachments;
            }
            if (this.fields != null && this.fields.length > 0) {
                const fields = [];
                yield this.fields.reduce((promise, field) => {
                    return promise
                        .then(() => {
                        return field.decrypt(this.organizationId, encKey);
                    })
                        .then((decField) => {
                        fields.push(decField);
                    });
                }, Promise.resolve());
                model.fields = fields;
            }
            if (this.passwordHistory != null && this.passwordHistory.length > 0) {
                const passwordHistory = [];
                yield this.passwordHistory.reduce((promise, ph) => {
                    return promise
                        .then(() => {
                        return ph.decrypt(this.organizationId, encKey);
                    })
                        .then((decPh) => {
                        passwordHistory.push(decPh);
                    });
                }, Promise.resolve());
                model.passwordHistory = passwordHistory;
            }
            return model;
        });
    }
    toCipherData() {
        var _a;
        const c = new cipher_data_1.CipherData();
        c.id = this.id;
        c.organizationId = this.organizationId;
        c.folderId = this.folderId;
        c.edit = this.edit;
        c.viewPassword = this.viewPassword;
        c.organizationUseTotp = this.organizationUseTotp;
        c.favorite = this.favorite;
        c.revisionDate = this.revisionDate != null ? this.revisionDate.toISOString() : null;
        c.type = this.type;
        c.collectionIds = this.collectionIds;
        c.creationDate = this.creationDate != null ? this.creationDate.toISOString() : null;
        c.deletedDate = this.deletedDate != null ? this.deletedDate.toISOString() : null;
        c.reprompt = this.reprompt;
        c.key = (_a = this.key) === null || _a === void 0 ? void 0 : _a.encryptedString;
        this.buildDataModel(this, c, {
            name: null,
            notes: null,
        });
        switch (c.type) {
            case cipher_type_1.CipherType.Login:
                c.login = this.login.toLoginData();
                break;
            case cipher_type_1.CipherType.SecureNote:
                c.secureNote = this.secureNote.toSecureNoteData();
                break;
            case cipher_type_1.CipherType.Card:
                c.card = this.card.toCardData();
                break;
            case cipher_type_1.CipherType.Identity:
                c.identity = this.identity.toIdentityData();
                break;
            default:
                break;
        }
        if (this.fields != null) {
            c.fields = this.fields.map((f) => f.toFieldData());
        }
        if (this.attachments != null) {
            c.attachments = this.attachments.map((a) => a.toAttachmentData());
        }
        if (this.passwordHistory != null) {
            c.passwordHistory = this.passwordHistory.map((ph) => ph.toPasswordHistoryData());
        }
        return c;
    }
    static fromJSON(obj) {
        var _a, _b, _c;
        if (obj == null) {
            return null;
        }
        const domain = new Cipher();
        const name = enc_string_1.EncString.fromJSON(obj.name);
        const notes = enc_string_1.EncString.fromJSON(obj.notes);
        const revisionDate = obj.revisionDate == null ? null : new Date(obj.revisionDate);
        const deletedDate = obj.deletedDate == null ? null : new Date(obj.deletedDate);
        const attachments = (_a = obj.attachments) === null || _a === void 0 ? void 0 : _a.map((a) => attachment_1.Attachment.fromJSON(a));
        const fields = (_b = obj.fields) === null || _b === void 0 ? void 0 : _b.map((f) => field_1.Field.fromJSON(f));
        const passwordHistory = (_c = obj.passwordHistory) === null || _c === void 0 ? void 0 : _c.map((ph) => password_1.Password.fromJSON(ph));
        const key = enc_string_1.EncString.fromJSON(obj.key);
        Object.assign(domain, obj, {
            name,
            notes,
            revisionDate,
            deletedDate,
            attachments,
            fields,
            passwordHistory,
            key,
        });
        switch (obj.type) {
            case cipher_type_1.CipherType.Card:
                domain.card = card_1.Card.fromJSON(obj.card);
                break;
            case cipher_type_1.CipherType.Identity:
                domain.identity = identity_1.Identity.fromJSON(obj.identity);
                break;
            case cipher_type_1.CipherType.Login:
                domain.login = login_1.Login.fromJSON(obj.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                domain.secureNote = secure_note_1.SecureNote.fromJSON(obj.secureNote);
                break;
            default:
                break;
        }
        return domain;
    }
}
exports.Cipher = Cipher;
//# sourceMappingURL=cipher.js.map