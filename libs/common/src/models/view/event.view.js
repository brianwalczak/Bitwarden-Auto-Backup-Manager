"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventView = void 0;
class EventView {
    constructor(data) {
        this.message = data.message;
        this.humanReadableMessage = data.humanReadableMessage;
        this.appIcon = data.appIcon;
        this.appName = data.appName;
        this.userId = data.userId;
        this.userName = data.userName;
        this.userEmail = data.userEmail;
        this.date = data.date;
        this.ip = data.ip;
        this.type = data.type;
        this.installationId = data.installationId;
        this.systemUser = data.systemUser;
        this.serviceAccountId = data.serviceAccountId;
    }
}
exports.EventView = EventView;
//# sourceMappingURL=event.view.js.map