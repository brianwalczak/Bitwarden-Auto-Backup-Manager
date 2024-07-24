"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDefinition = void 0;
/**
 * A class for defining information about a message, this is helpful
 * alonside `MessageSender` and `MessageListener` for providing a type
 * safe(-ish) way of sending and receiving messages.
 */
class CommandDefinition {
    constructor(command) {
        this.command = command;
    }
}
exports.CommandDefinition = CommandDefinition;
//# sourceMappingURL=types.js.map