"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
// Export the new message sender as the legacy MessagingService to minimize changes in the initial PR,
// team specific PR's will come after.
var message_sender_1 = require("../messaging/message.sender");
Object.defineProperty(exports, "MessagingService", { enumerable: true, get: function () { return message_sender_1.MessageSender; } });
//# sourceMappingURL=messaging.service.js.map