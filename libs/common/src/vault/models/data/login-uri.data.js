"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriData = void 0;
class LoginUriData {
    constructor(data) {
        this.match = null;
        if (data == null) {
            return;
        }
        this.uri = data.uri;
        this.uriChecksum = data.uriChecksum;
        this.match = data.match;
    }
}
exports.LoginUriData = LoginUriData;
//# sourceMappingURL=login-uri.data.js.map