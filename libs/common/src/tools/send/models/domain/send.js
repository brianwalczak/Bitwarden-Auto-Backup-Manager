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
exports.Send = void 0;
const utils_1 = require("../../../../platform/misc/utils");
const domain_base_1 = require("../../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../../platform/models/domain/enc-string");
const send_type_1 = require("../../enums/send-type");
const send_view_1 = require("../view/send.view");
const send_file_1 = require("./send-file");
const send_text_1 = require("./send-text");
class Send extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            accessId: null,
            name: null,
            notes: null,
            key: null,
        }, ["id", "accessId"]);
        this.type = obj.type;
        this.maxAccessCount = obj.maxAccessCount;
        this.accessCount = obj.accessCount;
        this.password = obj.password;
        this.disabled = obj.disabled;
        this.revisionDate = obj.revisionDate != null ? new Date(obj.revisionDate) : null;
        this.deletionDate = obj.deletionDate != null ? new Date(obj.deletionDate) : null;
        this.expirationDate = obj.expirationDate != null ? new Date(obj.expirationDate) : null;
        this.hideEmail = obj.hideEmail;
        switch (this.type) {
            case send_type_1.SendType.Text:
                this.text = new send_text_1.SendText(obj.text);
                break;
            case send_type_1.SendType.File:
                this.file = new send_file_1.SendFile(obj.file);
                break;
            default:
                break;
        }
    }
    decrypt() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new send_view_1.SendView(this);
            const cryptoService = utils_1.Utils.getContainerService().getCryptoService();
            try {
                model.key = yield cryptoService.decryptToBytes(this.key, null);
                model.cryptoKey = yield cryptoService.makeSendKey(model.key);
            }
            catch (e) {
                // TODO: error?
            }
            yield this.decryptObj(model, {
                name: null,
                notes: null,
            }, null, model.cryptoKey);
            switch (this.type) {
                case send_type_1.SendType.File:
                    model.file = yield this.file.decrypt(model.cryptoKey);
                    break;
                case send_type_1.SendType.Text:
                    model.text = yield this.text.decrypt(model.cryptoKey);
                    break;
                default:
                    break;
            }
            return model;
        });
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const revisionDate = obj.revisionDate == null ? null : new Date(obj.revisionDate);
        const expirationDate = obj.expirationDate == null ? null : new Date(obj.expirationDate);
        const deletionDate = obj.deletionDate == null ? null : new Date(obj.deletionDate);
        return Object.assign(new Send(), obj, {
            key: enc_string_1.EncString.fromJSON(obj.key),
            name: enc_string_1.EncString.fromJSON(obj.name),
            notes: enc_string_1.EncString.fromJSON(obj.notes),
            text: send_text_1.SendText.fromJSON(obj.text),
            file: send_file_1.SendFile.fromJSON(obj.file),
            revisionDate,
            expirationDate,
            deletionDate,
        });
    }
}
exports.Send = Send;
//# sourceMappingURL=send.js.map