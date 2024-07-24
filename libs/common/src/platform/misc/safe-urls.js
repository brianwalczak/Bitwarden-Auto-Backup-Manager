"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeUrls = void 0;
const utils_1 = require("./utils");
const CanLaunchWhitelist = [
    "https://",
    "http://",
    "ssh://",
    "ftp://",
    "sftp://",
    "irc://",
    "vnc://",
    // https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-uri
    "rdp://", // Legacy RDP URI scheme
    "ms-rd:", // Preferred RDP URI scheme
    "chrome://",
    "iosapp://",
    "androidapp://",
];
class SafeUrls {
    static canLaunch(uri) {
        if (utils_1.Utils.isNullOrWhitespace(uri)) {
            return false;
        }
        for (let i = 0; i < CanLaunchWhitelist.length; i++) {
            if (uri.indexOf(CanLaunchWhitelist[i]) === 0) {
                return true;
            }
        }
        return false;
    }
}
exports.SafeUrls = SafeUrls;
//# sourceMappingURL=safe-urls.js.map