"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageListener = void 0;
const rxjs_1 = require("rxjs");
/**
 * A class that allows for listening to messages coming through the application,
 * allows for listening of all messages or just the messages you care about.
 *
 * @note Consider NOT using messaging at all if you can. State Providers offer an observable stream of
 * data that is persisted. This can serve messages that might have been used to notify of settings changes
 * or vault data changes and those observables should be preferred over messaging.
 */
class MessageListener {
    constructor(messageStream) {
        this.messageStream = messageStream;
        /**
         * A stream of all messages sent through the application. It does not contain type information for the
         * other properties on the messages. You are encouraged to instead subscribe to an individual message
         * through {@link messages$}.
         */
        this.allMessages$ = this.messageStream;
    }
    /**
     * Creates an observable stream filtered to just the command given via the {@link CommandDefinition} and typed
     * to the generic contained in the CommandDefinition. Be careful using this method unless all your messages are being
     * sent through `MessageSender.send`, if that isn't the case you should have lower confidence in the message
     * payload being the expected type.
     *
     * @param commandDefinition The CommandDefinition containing the information about the message type you care about.
     */
    messages$(commandDefinition) {
        return this.allMessages$.pipe((0, rxjs_1.filter)((msg) => (msg === null || msg === void 0 ? void 0 : msg.command) === commandDefinition.command));
    }
}
exports.MessageListener = MessageListener;
/**
 * A helper property for returning a MessageListener that will never emit any messages and will immediately complete.
 */
MessageListener.EMPTY = new MessageListener(rxjs_1.EMPTY);
//# sourceMappingURL=message.listener.js.map