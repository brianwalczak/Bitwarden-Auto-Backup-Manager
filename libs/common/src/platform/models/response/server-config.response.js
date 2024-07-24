"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyServerConfigResponse = exports.EnvironmentServerConfigResponse = exports.ServerConfigResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class ServerConfigResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.featureStates = {};
        if (response == null) {
            return;
        }
        this.version = this.getResponseProperty("Version");
        this.gitHash = this.getResponseProperty("GitHash");
        this.server = new ThirdPartyServerConfigResponse(this.getResponseProperty("Server"));
        this.environment = new EnvironmentServerConfigResponse(this.getResponseProperty("Environment"));
        this.featureStates = this.getResponseProperty("FeatureStates");
    }
}
exports.ServerConfigResponse = ServerConfigResponse;
class EnvironmentServerConfigResponse extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.cloudRegion = this.getResponseProperty("CloudRegion");
        this.vault = this.getResponseProperty("Vault");
        this.api = this.getResponseProperty("Api");
        this.identity = this.getResponseProperty("Identity");
        this.notifications = this.getResponseProperty("Notifications");
        this.sso = this.getResponseProperty("Sso");
    }
}
exports.EnvironmentServerConfigResponse = EnvironmentServerConfigResponse;
class ThirdPartyServerConfigResponse extends base_response_1.BaseResponse {
    constructor(data = null) {
        super(data);
        if (data == null) {
            return;
        }
        this.name = this.getResponseProperty("Name");
        this.url = this.getResponseProperty("Url");
    }
}
exports.ThirdPartyServerConfigResponse = ThirdPartyServerConfigResponse;
//# sourceMappingURL=server-config.response.js.map