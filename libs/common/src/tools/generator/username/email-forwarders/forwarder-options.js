"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLoginForwarderOptions = exports.ForwardEmailForwarderOptions = exports.AnonAddyForwarderOptions = exports.FastmailForwarderOptions = exports.ForwarderOptions = void 0;
class ForwarderOptions {
    constructor() {
        this.fastmail = new FastmailForwarderOptions();
        this.anonaddy = new AnonAddyForwarderOptions();
        this.forwardemail = new ForwardEmailForwarderOptions();
        this.simplelogin = new SimpleLoginForwarderOptions();
    }
}
exports.ForwarderOptions = ForwarderOptions;
class FastmailForwarderOptions {
}
exports.FastmailForwarderOptions = FastmailForwarderOptions;
class AnonAddyForwarderOptions {
}
exports.AnonAddyForwarderOptions = AnonAddyForwarderOptions;
class ForwardEmailForwarderOptions {
}
exports.ForwardEmailForwarderOptions = ForwardEmailForwarderOptions;
class SimpleLoginForwarderOptions {
}
exports.SimpleLoginForwarderOptions = SimpleLoginForwarderOptions;
//# sourceMappingURL=forwarder-options.js.map