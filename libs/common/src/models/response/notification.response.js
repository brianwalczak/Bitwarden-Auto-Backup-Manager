"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequestPushNotification = exports.SyncSendNotification = exports.UserNotification = exports.SyncFolderNotification = exports.SyncCipherNotification = exports.NotificationResponse = void 0;
const enums_1 = require("../../enums");
const base_response_1 = require("./base.response");
class NotificationResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.contextId = this.getResponseProperty("ContextId");
        this.type = this.getResponseProperty("Type");
        const payload = this.getResponseProperty("Payload");
        switch (this.type) {
            case enums_1.NotificationType.SyncCipherCreate:
            case enums_1.NotificationType.SyncCipherDelete:
            case enums_1.NotificationType.SyncCipherUpdate:
            case enums_1.NotificationType.SyncLoginDelete:
                this.payload = new SyncCipherNotification(payload);
                break;
            case enums_1.NotificationType.SyncFolderCreate:
            case enums_1.NotificationType.SyncFolderDelete:
            case enums_1.NotificationType.SyncFolderUpdate:
                this.payload = new SyncFolderNotification(payload);
                break;
            case enums_1.NotificationType.SyncVault:
            case enums_1.NotificationType.SyncCiphers:
            case enums_1.NotificationType.SyncOrganizations:
            case enums_1.NotificationType.SyncOrgKeys:
            case enums_1.NotificationType.SyncSettings:
            case enums_1.NotificationType.LogOut:
                this.payload = new UserNotification(payload);
                break;
            case enums_1.NotificationType.SyncSendCreate:
            case enums_1.NotificationType.SyncSendUpdate:
            case enums_1.NotificationType.SyncSendDelete:
                this.payload = new SyncSendNotification(payload);
                break;
            case enums_1.NotificationType.AuthRequest:
            case enums_1.NotificationType.AuthRequestResponse:
                this.payload = new AuthRequestPushNotification(payload);
                break;
            default:
                break;
        }
    }
}
exports.NotificationResponse = NotificationResponse;
class SyncCipherNotification extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.organizationId = this.getResponseProperty("OrganizationId");
        this.collectionIds = this.getResponseProperty("CollectionIds");
        this.revisionDate = new Date(this.getResponseProperty("RevisionDate"));
    }
}
exports.SyncCipherNotification = SyncCipherNotification;
class SyncFolderNotification extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.revisionDate = new Date(this.getResponseProperty("RevisionDate"));
    }
}
exports.SyncFolderNotification = SyncFolderNotification;
class UserNotification extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.userId = this.getResponseProperty("UserId");
        this.date = new Date(this.getResponseProperty("Date"));
    }
}
exports.UserNotification = UserNotification;
class SyncSendNotification extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
        this.revisionDate = new Date(this.getResponseProperty("RevisionDate"));
    }
}
exports.SyncSendNotification = SyncSendNotification;
class AuthRequestPushNotification extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.userId = this.getResponseProperty("UserId");
    }
}
exports.AuthRequestPushNotification = AuthRequestPushNotification;
//# sourceMappingURL=notification.response.js.map