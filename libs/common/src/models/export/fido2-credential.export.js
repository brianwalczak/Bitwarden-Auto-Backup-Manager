"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fido2CredentialExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const fido2_credential_1 = require("../../vault/models/domain/fido2-credential");
const fido2_credential_view_1 = require("../../vault/models/view/fido2-credential.view");
const utils_1 = require("./utils");
/**
 * Represents format of Fido2 Credentials in JSON exports.
 */
class Fido2CredentialExport {
    /**
     * Generates a template for Fido2CredentialExport
     * @returns Instance of Fido2CredentialExport with predefined values.
     */
    static template() {
        const req = new Fido2CredentialExport();
        req.credentialId = "keyId";
        req.keyType = "keyType";
        req.keyAlgorithm = "keyAlgorithm";
        req.keyCurve = "keyCurve";
        req.keyValue = "keyValue";
        req.rpId = "rpId";
        req.userHandle = "userHandle";
        req.userName = "userName";
        req.counter = "counter";
        req.rpName = "rpName";
        req.userDisplayName = "userDisplayName";
        req.discoverable = "false";
        req.creationDate = null;
        return req;
    }
    /**
     * Converts a Fido2CredentialExport object to its view representation.
     * @param req - The Fido2CredentialExport object to be converted.
     * @param view - (Optional) The Fido2CredentialView object to popualte with Fido2CredentialExport data
     * @returns Fido2CredentialView - The populated view, or a new instance if none was provided.
     */
    static toView(req, view = new fido2_credential_view_1.Fido2CredentialView()) {
        view.credentialId = req.credentialId;
        view.keyType = req.keyType;
        view.keyAlgorithm = req.keyAlgorithm;
        view.keyCurve = req.keyCurve;
        view.keyValue = req.keyValue;
        view.rpId = req.rpId;
        view.userHandle = req.userHandle;
        view.userName = req.userName;
        view.counter = parseInt(req.counter);
        view.rpName = req.rpName;
        view.userDisplayName = req.userDisplayName;
        view.discoverable = req.discoverable === "true";
        view.creationDate = new Date(req.creationDate);
        return view;
    }
    /**
     * Converts a Fido2CredentialExport object to its domain representation.
     * @param req - The Fido2CredentialExport object to be converted.
     * @param domain - (Optional) The Fido2Credential object to popualte with Fido2CredentialExport data
     * @returns Fido2Credential - The populated domain, or a new instance if none was provided.
     */
    static toDomain(req, domain = new fido2_credential_1.Fido2Credential()) {
        domain.credentialId = req.credentialId != null ? new enc_string_1.EncString(req.credentialId) : null;
        domain.keyType = req.keyType != null ? new enc_string_1.EncString(req.keyType) : null;
        domain.keyAlgorithm = req.keyAlgorithm != null ? new enc_string_1.EncString(req.keyAlgorithm) : null;
        domain.keyCurve = req.keyCurve != null ? new enc_string_1.EncString(req.keyCurve) : null;
        domain.keyValue = req.keyValue != null ? new enc_string_1.EncString(req.keyValue) : null;
        domain.rpId = req.rpId != null ? new enc_string_1.EncString(req.rpId) : null;
        domain.userHandle = req.userHandle != null ? new enc_string_1.EncString(req.userHandle) : null;
        domain.userName = req.userName != null ? new enc_string_1.EncString(req.userName) : null;
        domain.counter = req.counter != null ? new enc_string_1.EncString(req.counter) : null;
        domain.rpName = req.rpName != null ? new enc_string_1.EncString(req.rpName) : null;
        domain.userDisplayName =
            req.userDisplayName != null ? new enc_string_1.EncString(req.userDisplayName) : null;
        domain.discoverable = req.discoverable != null ? new enc_string_1.EncString(req.discoverable) : null;
        domain.creationDate = req.creationDate;
        return domain;
    }
    /**
     * Constructs a new Fid2CredentialExport instance.
     *
     * @param o - The credential storing the data being exported. When not provided, an empty export is created instead.
     */
    constructor(o) {
        if (o == null) {
            return;
        }
        this.credentialId = (0, utils_1.safeGetString)(o.credentialId);
        this.keyType = (0, utils_1.safeGetString)(o.keyType);
        this.keyAlgorithm = (0, utils_1.safeGetString)(o.keyAlgorithm);
        this.keyCurve = (0, utils_1.safeGetString)(o.keyCurve);
        this.keyValue = (0, utils_1.safeGetString)(o.keyValue);
        this.rpId = (0, utils_1.safeGetString)(o.rpId);
        this.userHandle = (0, utils_1.safeGetString)(o.userHandle);
        this.userName = (0, utils_1.safeGetString)(o.userName);
        this.counter = (0, utils_1.safeGetString)(String(o.counter));
        this.rpName = (0, utils_1.safeGetString)(o.rpName);
        this.userDisplayName = (0, utils_1.safeGetString)(o.userDisplayName);
        this.discoverable = (0, utils_1.safeGetString)(String(o.discoverable));
        this.creationDate = o.creationDate;
    }
}
exports.Fido2CredentialExport = Fido2CredentialExport;
//# sourceMappingURL=fido2-credential.export.js.map