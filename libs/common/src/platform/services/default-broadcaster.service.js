"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBroadcasterService = void 0;
/**
 * Temporary implementation that just delegates to the message sender and message listener
 * and manages their subscriptions.
 */
class DefaultBroadcasterService {
    constructor(messageListener) {
        this.messageListener = messageListener;
        this.subscriptions = new Map();
    }
    subscribe(id, messageCallback) {
        this.subscriptions.set(id, this.messageListener.allMessages$.subscribe((message) => {
            messageCallback(message);
        }));
    }
    unsubscribe(id) {
        const subscription = this.subscriptions.get(id);
        subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
        this.subscriptions.delete(id);
    }
}
exports.DefaultBroadcasterService = DefaultBroadcasterService;
//# sourceMappingURL=default-broadcaster.service.js.map