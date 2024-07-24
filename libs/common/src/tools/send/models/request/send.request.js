"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendRequest = void 0;
const send_type_1 = require("../../enums/send-type");
const send_file_api_1 = require("../api/send-file.api");
const send_text_api_1 = require("../api/send-text.api");
class SendRequest {
    constructor(send, fileLength) {
        this.type = send.type;
        this.fileLength = fileLength;
        this.name = send.name ? send.name.encryptedString : null;
        this.notes = send.notes ? send.notes.encryptedString : null;
        this.maxAccessCount = send.maxAccessCount;
        this.expirationDate = send.expirationDate != null ? send.expirationDate.toISOString() : null;
        this.deletionDate = send.deletionDate != null ? send.deletionDate.toISOString() : null;
        this.key = send.key != null ? send.key.encryptedString : null;
        this.password = send.password;
        this.disabled = send.disabled;
        this.hideEmail = send.hideEmail;
        switch (this.type) {
            case send_type_1.SendType.Text:
                this.text = new send_text_api_1.SendTextApi();
                this.text.text = send.text.text != null ? send.text.text.encryptedString : null;
                this.text.hidden = send.text.hidden;
                break;
            case send_type_1.SendType.File:
                this.file = new send_file_api_1.SendFileApi();
                this.file.fileName = send.file.fileName != null ? send.file.fileName.encryptedString : null;
                break;
            default:
                break;
        }
    }
}
exports.SendRequest = SendRequest;
//# sourceMappingURL=send.request.js.map