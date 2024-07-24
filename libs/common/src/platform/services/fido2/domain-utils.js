"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRpId = isValidRpId;
const tldts_1 = require("tldts");
function isValidRpId(rpId, origin) {
    const parsedOrigin = (0, tldts_1.parse)(origin, { allowPrivateDomains: true });
    const parsedRpId = (0, tldts_1.parse)(rpId, { allowPrivateDomains: true });
    return ((parsedOrigin.domain == null &&
        parsedOrigin.hostname == parsedRpId.hostname &&
        parsedOrigin.hostname == "localhost") ||
        (parsedOrigin.domain != null &&
            parsedOrigin.domain == parsedRpId.domain &&
            parsedOrigin.subdomain.endsWith(parsedRpId.subdomain)));
}
//# sourceMappingURL=domain-utils.js.map