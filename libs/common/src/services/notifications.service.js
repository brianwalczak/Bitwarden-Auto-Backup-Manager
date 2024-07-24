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
exports.NotificationsService = void 0;
const signalR = require("@microsoft/signalr");
const signalRMsgPack = require("@microsoft/signalr-protocol-msgpack");
const rxjs_1 = require("rxjs");
const authentication_status_1 = require("../auth/enums/authentication-status");
const enums_1 = require("../enums");
const notification_response_1 = require("../models/response/notification.response");
const scheduled_task_name_enum_1 = require("../platform/scheduling/scheduled-task-name.enum");
class NotificationsService {
    constructor(logService, syncService, appIdService, apiService, environmentService, logoutCallback, stateService, authService, messagingService, taskSchedulerService) {
        this.logService = logService;
        this.syncService = syncService;
        this.appIdService = appIdService;
        this.apiService = apiService;
        this.environmentService = environmentService;
        this.logoutCallback = logoutCallback;
        this.stateService = stateService;
        this.authService = authService;
        this.messagingService = messagingService;
        this.taskSchedulerService = taskSchedulerService;
        this.connected = false;
        this.inited = false;
        this.inactive = false;
        this.isSyncingOnReconnect = true;
        this.taskSchedulerService.registerTaskHandler(scheduled_task_name_enum_1.ScheduledTaskNames.notificationsReconnectTimeout, () => this.reconnect(this.isSyncingOnReconnect));
        this.environmentService.environment$.subscribe(() => {
            if (!this.inited) {
                return;
            }
            // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.init();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.inited = false;
            this.url = (yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$)).getNotificationsUrl();
            // Set notifications server URL to `https://-` to effectively disable communication
            // with the notifications server from the client app
            if (this.url === "https://-") {
                return;
            }
            if (this.signalrConnection != null) {
                this.signalrConnection.off("ReceiveMessage");
                this.signalrConnection.off("Heartbeat");
                yield this.signalrConnection.stop();
                this.connected = false;
                this.signalrConnection = null;
            }
            this.signalrConnection = new signalR.HubConnectionBuilder()
                .withUrl(this.url + "/hub", {
                accessTokenFactory: () => this.apiService.getActiveBearerToken(),
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
                .withHubProtocol(new signalRMsgPack.MessagePackHubProtocol())
                // .configureLogging(signalR.LogLevel.Trace)
                .build();
            this.signalrConnection.on("ReceiveMessage", (data) => this.processNotification(new notification_response_1.NotificationResponse(data)));
            // eslint-disable-next-line
            this.signalrConnection.on("Heartbeat", (data) => {
                /*console.log('Heartbeat!');*/
            });
            this.signalrConnection.onclose(() => {
                this.connected = false;
                // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.reconnect(true);
            });
            this.inited = true;
            if (yield this.isAuthedAndUnlocked()) {
                yield this.reconnect(false);
            }
        });
    }
    updateConnection() {
        return __awaiter(this, arguments, void 0, function* (sync = false) {
            if (!this.inited) {
                return;
            }
            try {
                if (yield this.isAuthedAndUnlocked()) {
                    yield this.reconnect(sync);
                }
                else {
                    yield this.signalrConnection.stop();
                }
            }
            catch (e) {
                this.logService.error(e.toString());
            }
        });
    }
    reconnectFromActivity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.inactive = false;
            if (this.inited && !this.connected) {
                yield this.reconnect(true);
            }
        });
    }
    disconnectFromInactivity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.inactive = true;
            if (this.inited && this.connected) {
                yield this.signalrConnection.stop();
            }
        });
    }
    processNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const appId = yield this.appIdService.getAppId();
            if (notification == null || notification.contextId === appId) {
                return;
            }
            const isAuthenticated = yield this.stateService.getIsAuthenticated();
            const payloadUserId = notification.payload.userId || notification.payload.UserId;
            const myUserId = yield this.stateService.getUserId();
            if (isAuthenticated && payloadUserId != null && payloadUserId !== myUserId) {
                return;
            }
            switch (notification.type) {
                case enums_1.NotificationType.SyncCipherCreate:
                case enums_1.NotificationType.SyncCipherUpdate:
                    yield this.syncService.syncUpsertCipher(notification.payload, notification.type === enums_1.NotificationType.SyncCipherUpdate);
                    break;
                case enums_1.NotificationType.SyncCipherDelete:
                case enums_1.NotificationType.SyncLoginDelete:
                    yield this.syncService.syncDeleteCipher(notification.payload);
                    break;
                case enums_1.NotificationType.SyncFolderCreate:
                case enums_1.NotificationType.SyncFolderUpdate:
                    yield this.syncService.syncUpsertFolder(notification.payload, notification.type === enums_1.NotificationType.SyncFolderUpdate);
                    break;
                case enums_1.NotificationType.SyncFolderDelete:
                    yield this.syncService.syncDeleteFolder(notification.payload);
                    break;
                case enums_1.NotificationType.SyncVault:
                case enums_1.NotificationType.SyncCiphers:
                case enums_1.NotificationType.SyncSettings:
                    if (isAuthenticated) {
                        yield this.syncService.fullSync(false);
                    }
                    break;
                case enums_1.NotificationType.SyncOrganizations:
                    if (isAuthenticated) {
                        // An organization update may not have bumped the user's account revision date, so force a sync
                        yield this.syncService.fullSync(true);
                    }
                    break;
                case enums_1.NotificationType.SyncOrgKeys:
                    if (isAuthenticated) {
                        yield this.syncService.fullSync(true);
                        // Stop so a reconnect can be made
                        yield this.signalrConnection.stop();
                    }
                    break;
                case enums_1.NotificationType.LogOut:
                    if (isAuthenticated) {
                        // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        this.logoutCallback("logoutNotification");
                    }
                    break;
                case enums_1.NotificationType.SyncSendCreate:
                case enums_1.NotificationType.SyncSendUpdate:
                    yield this.syncService.syncUpsertSend(notification.payload, notification.type === enums_1.NotificationType.SyncSendUpdate);
                    break;
                case enums_1.NotificationType.SyncSendDelete:
                    yield this.syncService.syncDeleteSend(notification.payload);
                    break;
                case enums_1.NotificationType.AuthRequest:
                    {
                        this.messagingService.send("openLoginApproval", {
                            notificationId: notification.payload.id,
                        });
                    }
                    break;
                default:
                    break;
            }
        });
    }
    reconnect(sync) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.reconnectTimerSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            if (this.connected || !this.inited || this.inactive) {
                return;
            }
            const authedAndUnlocked = yield this.isAuthedAndUnlocked();
            if (!authedAndUnlocked) {
                return;
            }
            try {
                yield this.signalrConnection.start();
                this.connected = true;
                if (sync) {
                    yield this.syncService.fullSync(false);
                }
            }
            catch (e) {
                this.logService.error(e);
            }
            if (!this.connected) {
                this.isSyncingOnReconnect = sync;
                this.reconnectTimerSubscription = this.taskSchedulerService.setTimeout(scheduled_task_name_enum_1.ScheduledTaskNames.notificationsReconnectTimeout, this.random(120000, 300000));
            }
        });
    }
    isAuthedAndUnlocked() {
        return __awaiter(this, void 0, void 0, function* () {
            const authStatus = yield this.authService.getAuthStatus();
            return authStatus >= authentication_status_1.AuthenticationStatus.Unlocked;
        });
    }
    random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map