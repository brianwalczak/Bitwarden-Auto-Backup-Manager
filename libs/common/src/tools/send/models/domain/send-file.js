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
exports.SendFile = void 0;
const domain_base_1 = require("../../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../../platform/models/domain/enc-string");
const send_file_view_1 = require("../view/send-file.view");
class SendFile extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.size = obj.size;
        this.buildDomainModel(this, obj, {
            id: null,
            sizeName: null,
            fileName: null,
        }, ["id", "sizeName"]);
    }
    decrypt(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield this.decryptObj(new send_file_view_1.SendFileView(this), {
                fileName: null,
            }, null, key);
            return view;
        });
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(new SendFile(), obj, {
            fileName: enc_string_1.EncString.fromJSON(obj.fileName),
        });
    }
}
exports.SendFile = SendFile;
//# sourceMappingURL=send-file.js.map