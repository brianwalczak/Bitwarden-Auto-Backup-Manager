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
exports.Attachment = void 0;
const utils_1 = require("../../../platform/misc/utils");
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const symmetric_crypto_key_1 = require("../../../platform/models/domain/symmetric-crypto-key");
const attachment_data_1 = require("../data/attachment.data");
const attachment_view_1 = require("../view/attachment.view");
class Attachment extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.size = obj.size;
        this.buildDomainModel(this, obj, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
            key: null,
        }, ["id", "url", "sizeName"]);
    }
    decrypt(orgId, encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.decryptObj(new attachment_view_1.AttachmentView(this), {
                fileName: null,
            }, orgId, encKey);
            if (this.key != null) {
                view.key = yield this.decryptAttachmentKey(orgId, encKey);
            }
            return view;
        });
    }
    decryptAttachmentKey(orgId, encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (encKey == null) {
                    encKey = yield this.getKeyForDecryption(orgId);
                }
                const encryptService = utils_1.Utils.getContainerService().getEncryptService();
                const decValue = yield encryptService.decryptToBytes(this.key, encKey);
                return new symmetric_crypto_key_1.SymmetricCryptoKey(decValue);
            }
            catch (e) {
                // TODO: error?
            }
        });
    }
    getKeyForDecryption(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cryptoService = utils_1.Utils.getContainerService().getCryptoService();
            return orgId != null
                ? yield cryptoService.getOrgKey(orgId)
                : yield cryptoService.getUserKeyWithLegacySupport();
        });
    }
    toAttachmentData() {
        const a = new attachment_data_1.AttachmentData();
        a.size = this.size;
        this.buildDataModel(this, a, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
            key: null,
        }, ["id", "url", "sizeName"]);
        return a;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const key = enc_string_1.EncString.fromJSON(obj.key);
        const fileName = enc_string_1.EncString.fromJSON(obj.fileName);
        return Object.assign(new Attachment(), obj, {
            key,
            fileName,
        });
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map