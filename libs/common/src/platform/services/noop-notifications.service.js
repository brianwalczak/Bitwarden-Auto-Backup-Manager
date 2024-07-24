"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopNotificationsService = void 0;
class NoopNotificationsService {
    constructor(logService) {
        this.logService = logService;
    }
    init() {
        this.logService.info("Initializing no-op notification service, no push notifications will be received");
        return Promise.resolve();
    }
    updateConnection(sync) {
        this.logService.info("Updating notification service connection");
        return Promise.resolve();
    }
    reconnectFromActivity() {
        this.logService.info("Reconnecting notification service from activity");
        return Promise.resolve();
    }
    disconnectFromInactivity() {
        this.logService.info("Disconnecting notification service from inactivity");
        return Promise.resolve();
    }
}
exports.NoopNotificationsService = NoopNotificationsService;
//# sourceMappingURL=noop-notifications.service.js.map