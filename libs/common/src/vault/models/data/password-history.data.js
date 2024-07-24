"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHistoryData = void 0;
class PasswordHistoryData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.password = response.password;
        this.lastUsedDate = response.lastUsedDate;
    }
}
exports.PasswordHistoryData = PasswordHistoryData;
//# sourceMappingURL=password-history.data.js.map