"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSsoResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
const sso_config_api_1 = require("../api/sso-config.api");
class OrganizationSsoResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.enabled = this.getResponseProperty("Enabled");
        this.identifier = this.getResponseProperty("Identifier");
        this.data =
            this.getResponseProperty("Data") != null
                ? new sso_config_api_1.SsoConfigApi(this.getResponseProperty("Data"))
                : null;
        this.urls = new SsoUrls(this.getResponseProperty("Urls"));
    }
}
exports.OrganizationSsoResponse = OrganizationSsoResponse;
class SsoUrls extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.callbackPath = this.getResponseProperty("CallbackPath");
        this.signedOutCallbackPath = this.getResponseProperty("SignedOutCallbackPath");
        this.spEntityId = this.getResponseProperty("SpEntityId");
        this.spEntityIdStatic = this.getResponseProperty("SpEntityIdStatic");
        this.spMetadataUrl = this.getResponseProperty("SpMetadataUrl");
        this.spAcsUrl = this.getResponseProperty("SpAcsUrl");
    }
}
//# sourceMappingURL=organization-sso.response.js.map