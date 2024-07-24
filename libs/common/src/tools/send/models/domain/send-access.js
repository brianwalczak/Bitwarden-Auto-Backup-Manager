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
exports.SendAccess = void 0;
const domain_base_1 = require("../../../../platform/models/domain/domain-base");
const send_type_1 = require("../../enums/send-type");
const send_access_view_1 = require("../view/send-access.view");
const send_file_1 = require("./send-file");
const send_text_1 = require("./send-text");
class SendAccess extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            name: null,
            expirationDate: null,
            creatorIdentifier: null,
        }, ["id", "expirationDate", "creatorIdentifier"]);
        this.type = obj.type;
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
    decrypt(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new send_access_view_1.SendAccessView(this);
            yield this.decryptObj(model, {
                name: null,
            }, null, key);
            switch (this.type) {
                case send_type_1.SendType.File:
                    model.file = yield this.file.decrypt(key);
                    break;
                case send_type_1.SendType.Text:
                    model.text = yield this.text.decrypt(key);
                    break;
                default:
                    break;
            }
            return model;
        });
    }
}
exports.SendAccess = SendAccess;
//# sourceMappingURL=send-access.js.map