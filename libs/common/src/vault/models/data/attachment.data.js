"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentData = void 0;
class AttachmentData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.url = response.url;
        this.fileName = response.fileName;
        this.key = response.key;
        this.size = response.size;
        this.sizeName = response.sizeName;
    }
}
exports.AttachmentData = AttachmentData;
//# sourceMappingURL=attachment.data.js.map