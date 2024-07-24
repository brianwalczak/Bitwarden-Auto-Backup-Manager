"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendData = void 0;
const send_type_1 = require("../../enums/send-type");
const send_file_data_1 = require("./send-file.data");
const send_text_data_1 = require("./send-text.data");
class SendData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.accessId = response.accessId;
        this.type = response.type;
        this.name = response.name;
        this.notes = response.notes;
        this.key = response.key;
        this.maxAccessCount = response.maxAccessCount;
        this.accessCount = response.accessCount;
        this.revisionDate = response.revisionDate;
        this.expirationDate = response.expirationDate;
        this.deletionDate = response.deletionDate;
        this.password = response.password;
        this.disabled = response.disable;
        this.hideEmail = response.hideEmail;
        switch (this.type) {
            case send_type_1.SendType.Text:
                this.text = new send_text_data_1.SendTextData(response.text);
                break;
            case send_type_1.SendType.File:
                this.file = new send_file_data_1.SendFileData(response.file);
                break;
            default:
                break;
        }
    }
}
exports.SendData = SendData;
//# sourceMappingURL=send.data.js.map