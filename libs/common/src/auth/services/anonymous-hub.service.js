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
exports.AnonymousHubService = void 0;
const signalr_1 = require("@microsoft/signalr");
const signalr_protocol_msgpack_1 = require("@microsoft/signalr-protocol-msgpack");
const rxjs_1 = require("rxjs");
const enums_1 = require("../../enums");
const notification_response_1 = require("../../models/response/notification.response");
class AnonymousHubService {
    constructor(environmentService, authRequestService) {
        this.environmentService = environmentService;
        this.authRequestService = authRequestService;
    }
    createHubConnection(token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.url = (yield (0, rxjs_1.firstValueFrom)(this.environmentService.environment$)).getNotificationsUrl();
            this.anonHubConnection = new signalr_1.HubConnectionBuilder()
                .withUrl(this.url + "/anonymous-hub?Token=" + token, {
                skipNegotiation: true,
                transport: signalr_1.HttpTransportType.WebSockets,
            })
                .withHubProtocol(new signalr_protocol_msgpack_1.MessagePackHubProtocol())
                .build();
            yield this.anonHubConnection.start();
            this.anonHubConnection.on("AuthRequestResponseRecieved", (data) => {
                this.ProcessNotification(new notification_response_1.NotificationResponse(data));
            });
        });
    }
    stopHubConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.anonHubConnection) {
                yield this.anonHubConnection.stop();
            }
        });
    }
    ProcessNotification(notification) {
        switch (notification.type) {
            case enums_1.NotificationType.AuthRequestResponse:
                this.authRequestService.sendAuthRequestPushNotification(notification.payload);
        }
    }
}
exports.AnonymousHubService = AnonymousHubService;
//# sourceMappingURL=anonymous-hub.service.js.map