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
exports.Fido2Credential = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const fido2_credential_data_1 = require("../data/fido2-credential.data");
const fido2_credential_view_1 = require("../view/fido2-credential.view");
class Fido2Credential extends domain_base_1.default {
    constructor(obj) {
        super();
        this.credentialId = null;
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            credentialId: null,
            keyType: null,
            keyAlgorithm: null,
            keyCurve: null,
            keyValue: null,
            rpId: null,
            userHandle: null,
            userName: null,
            counter: null,
            rpName: null,
            userDisplayName: null,
            discoverable: null,
        }, []);
        this.creationDate = obj.creationDate != null ? new Date(obj.creationDate) : null;
    }
    decrypt(orgId, encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.decryptObj(new fido2_credential_view_1.Fido2CredentialView(), {
                credentialId: null,
                keyType: null,
                keyAlgorithm: null,
                keyCurve: null,
                keyValue: null,
                rpId: null,
                userHandle: null,
                userName: null,
                rpName: null,
                userDisplayName: null,
                discoverable: null,
            }, orgId, encKey);
            const { counter } = yield this.decryptObj({ counter: "" }, {
                counter: null,
            }, orgId, encKey);
            // Counter will end up as NaN if this fails
            view.counter = parseInt(counter);
            const { discoverable } = yield this.decryptObj({ discoverable: "" }, {
                discoverable: null,
            }, orgId, encKey);
            view.discoverable = discoverable === "true";
            view.creationDate = this.creationDate;
            return view;
        });
    }
    toFido2CredentialData() {
        const i = new fido2_credential_data_1.Fido2CredentialData();
        i.creationDate = this.creationDate.toISOString();
        this.buildDataModel(this, i, {
            credentialId: null,
            keyType: null,
            keyAlgorithm: null,
            keyCurve: null,
            keyValue: null,
            rpId: null,
            userHandle: null,
            userName: null,
            counter: null,
            rpName: null,
            userDisplayName: null,
            discoverable: null,
        });
        return i;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const credentialId = enc_string_1.EncString.fromJSON(obj.credentialId);
        const keyType = enc_string_1.EncString.fromJSON(obj.keyType);
        const keyAlgorithm = enc_string_1.EncString.fromJSON(obj.keyAlgorithm);
        const keyCurve = enc_string_1.EncString.fromJSON(obj.keyCurve);
        const keyValue = enc_string_1.EncString.fromJSON(obj.keyValue);
        const rpId = enc_string_1.EncString.fromJSON(obj.rpId);
        const userHandle = enc_string_1.EncString.fromJSON(obj.userHandle);
        const userName = enc_string_1.EncString.fromJSON(obj.userName);
        const counter = enc_string_1.EncString.fromJSON(obj.counter);
        const rpName = enc_string_1.EncString.fromJSON(obj.rpName);
        const userDisplayName = enc_string_1.EncString.fromJSON(obj.userDisplayName);
        const discoverable = enc_string_1.EncString.fromJSON(obj.discoverable);
        const creationDate = obj.creationDate != null ? new Date(obj.creationDate) : null;
        return Object.assign(new Fido2Credential(), obj, {
            credentialId,
            keyType,
            keyAlgorithm,
            keyCurve,
            keyValue,
            rpId,
            userHandle,
            userName,
            counter,
            rpName,
            userDisplayName,
            discoverable,
            creationDate,
        });
    }
}
exports.Fido2Credential = Fido2Credential;
//# sourceMappingURL=fido2-credential.js.map