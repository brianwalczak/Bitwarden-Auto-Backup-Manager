"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileData = void 0;
class SendFileData {
    constructor(data) {
        if (data == null) {
            return;
        }
        this.id = data.id;
        this.fileName = data.fileName;
        this.size = data.size;
        this.sizeName = data.sizeName;
    }
}
exports.SendFileData = SendFileData;
//# sourceMappingURL=send-file.data.js.map