"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forwarders = void 0;
/** Metadata about an email forwarding service.
 *  @remarks This is used to populate the forwarder selection list
 *  and to identify forwarding services in error messages.
 */
exports.Forwarders = Object.freeze({
    /** For https://addy.io/ */
    AddyIo: Object.freeze({
        id: "anonaddy",
        name: "Addy.io",
        validForSelfHosted: true,
    }),
    /** For https://duckduckgo.com/email/ */
    DuckDuckGo: Object.freeze({
        id: "duckduckgo",
        name: "DuckDuckGo",
        validForSelfHosted: false,
    }),
    /** For https://www.fastmail.com. */
    Fastmail: Object.freeze({
        id: "fastmail",
        name: "Fastmail",
        validForSelfHosted: true,
    }),
    /** For https://relay.firefox.com/ */
    FirefoxRelay: Object.freeze({
        id: "firefoxrelay",
        name: "Firefox Relay",
        validForSelfHosted: false,
    }),
    /** For https://forwardemail.net/ */
    ForwardEmail: Object.freeze({
        id: "forwardemail",
        name: "Forward Email",
        validForSelfHosted: true,
    }),
    /** For https://simplelogin.io/ */
    SimpleLogin: Object.freeze({
        id: "simplelogin",
        name: "SimpleLogin",
        validForSelfHosted: true,
    }),
});
//# sourceMappingURL=constants.js.map