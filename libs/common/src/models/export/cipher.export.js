"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const cipher_reprompt_type_1 = require("../../vault/enums/cipher-reprompt-type");
const cipher_type_1 = require("../../vault/enums/cipher-type");
const cipher_1 = require("../../vault/models/domain/cipher");
const cipher_view_1 = require("../../vault/models/view/cipher.view");
const card_export_1 = require("./card.export");
const field_export_1 = require("./field.export");
const identity_export_1 = require("./identity.export");
const login_export_1 = require("./login.export");
const password_history_export_1 = require("./password-history.export");
const secure_note_export_1 = require("./secure-note.export");
const utils_1 = require("./utils");
class CipherExport {
    constructor() {
        this.passwordHistory = null;
        this.revisionDate = null;
        this.creationDate = null;
        this.deletedDate = null;
    }
    static template() {
        const req = new CipherExport();
        req.organizationId = null;
        req.collectionIds = null;
        req.folderId = null;
        req.type = cipher_type_1.CipherType.Login;
        req.name = "Item name";
        req.notes = "Some notes about this item.";
        req.favorite = false;
        req.fields = [];
        req.login = null;
        req.secureNote = null;
        req.card = null;
        req.identity = null;
        req.reprompt = cipher_reprompt_type_1.CipherRepromptType.None;
        req.passwordHistory = [];
        req.creationDate = null;
        req.revisionDate = null;
        req.deletedDate = null;
        return req;
    }
    static toView(req, view = new cipher_view_1.CipherView()) {
        var _a, _b, _c;
        view.type = req.type;
        view.folderId = req.folderId;
        if (view.organizationId == null) {
            view.organizationId = req.organizationId;
        }
        if (view.collectionIds || req.collectionIds) {
            const set = new Set(((_a = view.collectionIds) !== null && _a !== void 0 ? _a : []).concat((_b = req.collectionIds) !== null && _b !== void 0 ? _b : []));
            view.collectionIds = Array.from(set.values());
        }
        view.name = req.name;
        view.notes = req.notes;
        view.favorite = req.favorite;
        view.reprompt = (_c = req.reprompt) !== null && _c !== void 0 ? _c : cipher_reprompt_type_1.CipherRepromptType.None;
        if (req.fields != null) {
            view.fields = req.fields.map((f) => field_export_1.FieldExport.toView(f));
        }
        switch (req.type) {
            case cipher_type_1.CipherType.Login:
                view.login = login_export_1.LoginExport.toView(req.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                view.secureNote = secure_note_export_1.SecureNoteExport.toView(req.secureNote);
                break;
            case cipher_type_1.CipherType.Card:
                view.card = card_export_1.CardExport.toView(req.card);
                break;
            case cipher_type_1.CipherType.Identity:
                view.identity = identity_export_1.IdentityExport.toView(req.identity);
                break;
        }
        if (req.passwordHistory != null) {
            view.passwordHistory = req.passwordHistory.map((ph) => password_history_export_1.PasswordHistoryExport.toView(ph));
        }
        view.creationDate = req.creationDate;
        view.revisionDate = req.revisionDate;
        view.deletedDate = req.deletedDate;
        return view;
    }
    static toDomain(req, domain = new cipher_1.Cipher()) {
        var _a;
        domain.type = req.type;
        domain.folderId = req.folderId;
        if (domain.organizationId == null) {
            domain.organizationId = req.organizationId;
        }
        domain.name = req.name != null ? new enc_string_1.EncString(req.name) : null;
        domain.notes = req.notes != null ? new enc_string_1.EncString(req.notes) : null;
        domain.favorite = req.favorite;
        domain.reprompt = (_a = req.reprompt) !== null && _a !== void 0 ? _a : cipher_reprompt_type_1.CipherRepromptType.None;
        domain.key = req.key != null ? new enc_string_1.EncString(req.key) : null;
        if (req.fields != null) {
            domain.fields = req.fields.map((f) => field_export_1.FieldExport.toDomain(f));
        }
        switch (req.type) {
            case cipher_type_1.CipherType.Login:
                domain.login = login_export_1.LoginExport.toDomain(req.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                domain.secureNote = secure_note_export_1.SecureNoteExport.toDomain(req.secureNote);
                break;
            case cipher_type_1.CipherType.Card:
                domain.card = card_export_1.CardExport.toDomain(req.card);
                break;
            case cipher_type_1.CipherType.Identity:
                domain.identity = identity_export_1.IdentityExport.toDomain(req.identity);
                break;
        }
        if (req.passwordHistory != null) {
            domain.passwordHistory = req.passwordHistory.map((ph) => password_history_export_1.PasswordHistoryExport.toDomain(ph));
        }
        domain.creationDate = req.creationDate;
        domain.revisionDate = req.revisionDate;
        domain.deletedDate = req.deletedDate;
        return domain;
    }
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        var _a;
        this.organizationId = o.organizationId;
        this.folderId = o.folderId;
        this.type = o.type;
        this.reprompt = o.reprompt;
        this.name = (0, utils_1.safeGetString)(o.name);
        this.notes = (0, utils_1.safeGetString)(o.notes);
        if ("key" in o) {
            this.key = (_a = o.key) === null || _a === void 0 ? void 0 : _a.encryptedString;
        }
        this.favorite = o.favorite;
        if (o.fields != null) {
            this.fields = o.fields.map((f) => new field_export_1.FieldExport(f));
        }
        switch (o.type) {
            case cipher_type_1.CipherType.Login:
                this.login = new login_export_1.LoginExport(o.login);
                break;
            case cipher_type_1.CipherType.SecureNote:
                this.secureNote = new secure_note_export_1.SecureNoteExport(o.secureNote);
                break;
            case cipher_type_1.CipherType.Card:
                this.card = new card_export_1.CardExport(o.card);
                break;
            case cipher_type_1.CipherType.Identity:
                this.identity = new identity_export_1.IdentityExport(o.identity);
                break;
        }
        if (o.passwordHistory != null) {
            this.passwordHistory = o.passwordHistory.map((ph) => new password_history_export_1.PasswordHistoryExport(ph));
        }
        this.creationDate = o.creationDate;
        this.revisionDate = o.revisionDate;
        this.deletedDate = o.deletedDate;
    }
}
exports.CipherExport = CipherExport;
//# sourceMappingURL=cipher.export.js.map