"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileView = void 0;
class SendFileView {
    constructor(f) {
        this.id = null;
        this.size = null;
        this.sizeName = null;
        this.fileName = null;
        if (!f) {
            return;
        }
        this.id = f.id;
        this.size = f.size;
        this.sizeName = f.sizeName;
    }
    get fileSize() {
        try {
            if (this.size != null) {
                return parseInt(this.size, null);
            }
        }
        catch (_a) {
            // Invalid file size.
        }
        return 0;
    }
    static fromJSON(json) {
        if (json == null) {
            return null;
        }
        return Object.assign(new SendFileView(), json);
    }
}
exports.SendFileView = SendFileView;
//# sourceMappingURL=send-file.view.js.map