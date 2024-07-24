"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendWithIdRequest = void 0;
const send_request_1 = require("./send.request");
class SendWithIdRequest extends send_request_1.SendRequest {
    constructor(send) {
        super(send);
        this.id = send.id;
    }
}
exports.SendWithIdRequest = SendWithIdRequest;
//# sourceMappingURL=send-with-id.request.js.map