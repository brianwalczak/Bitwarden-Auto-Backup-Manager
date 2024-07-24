"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectMessageSender = void 0;
const internal_1 = require("./internal");
class SubjectMessageSender {
    constructor(messagesSubject) {
        this.messagesSubject = messagesSubject;
    }
    send(commandDefinition, payload = {}) {
        const command = (0, internal_1.getCommand)(commandDefinition);
        this.messagesSubject.next(Object.assign(payload !== null && payload !== void 0 ? payload : {}, { command: command }));
    }
}
exports.SubjectMessageSender = SubjectMessageSender;
//# sourceMappingURL=subject-message.sender.js.map