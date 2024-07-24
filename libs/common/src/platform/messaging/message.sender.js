"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSender = void 0;
class MultiMessageSender {
    constructor(innerMessageSenders) {
        this.innerMessageSenders = innerMessageSenders;
    }
    send(commandDefinition, payload = {}) {
        for (const messageSender of this.innerMessageSenders) {
            messageSender.send(commandDefinition, payload);
        }
    }
}
class MessageSender {
    /**
     * A helper method for combine multiple {@link MessageSender}'s.
     * @param messageSenders The message senders that should be combined.
     * @returns A message sender that will relay all messages to the given message senders.
     */
    static combine(...messageSenders) {
        return new MultiMessageSender(messageSenders);
    }
}
exports.MessageSender = MessageSender;
/**
 * A helper property for creating a {@link MessageSender} that sends to nowhere.
 */
MessageSender.EMPTY = new MultiMessageSender([]);
//# sourceMappingURL=message.sender.js.map