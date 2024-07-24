"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommand = exports.tagAsExternal = exports.SubjectMessageSender = void 0;
// Built in implementations
var subject_message_sender_1 = require("./subject-message.sender");
Object.defineProperty(exports, "SubjectMessageSender", { enumerable: true, get: function () { return subject_message_sender_1.SubjectMessageSender; } });
// Helpers meant to be used only by other implementations
var helpers_1 = require("./helpers");
Object.defineProperty(exports, "tagAsExternal", { enumerable: true, get: function () { return helpers_1.tagAsExternal; } });
Object.defineProperty(exports, "getCommand", { enumerable: true, get: function () { return helpers_1.getCommand; } });
//# sourceMappingURL=internal.js.map