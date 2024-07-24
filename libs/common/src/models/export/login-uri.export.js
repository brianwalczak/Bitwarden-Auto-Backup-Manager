"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriExport = void 0;
const enc_string_1 = require("../../platform/models/domain/enc-string");
const login_uri_1 = require("../../vault/models/domain/login-uri");
const login_uri_view_1 = require("../../vault/models/view/login-uri.view");
const utils_1 = require("./utils");
class LoginUriExport {
    static template() {
        const req = new LoginUriExport();
        req.uri = "https://google.com";
        req.match = null;
        return req;
    }
    static toView(req, view = new login_uri_view_1.LoginUriView()) {
        view.uri = req.uri;
        view.match = req.match;
        return view;
    }
    static toDomain(req, domain = new login_uri_1.LoginUri()) {
        domain.uri = req.uri != null ? new enc_string_1.EncString(req.uri) : null;
        domain.uriChecksum = req.uriChecksum != null ? new enc_string_1.EncString(req.uriChecksum) : null;
        domain.match = req.match;
        return domain;
    }
    constructor(o) {
        var _a;
        this.match = null;
        if (o == null) {
            return;
        }
        this.uri = (0, utils_1.safeGetString)(o.uri);
        if ("uriChecksum" in o) {
            this.uriChecksum = (_a = o.uriChecksum) === null || _a === void 0 ? void 0 : _a.encryptedString;
        }
        this.match = o.match;
    }
}
exports.LoginUriExport = LoginUriExport;
//# sourceMappingURL=login-uri.export.js.map