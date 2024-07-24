"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentServerConfigData = exports.ThirdPartyServerConfigData = exports.ServerConfigData = void 0;
class ServerConfigData {
    constructor(serverConfigResponse) {
        this.featureStates = {};
        this.version = serverConfigResponse === null || serverConfigResponse === void 0 ? void 0 : serverConfigResponse.version;
        this.gitHash = serverConfigResponse === null || serverConfigResponse === void 0 ? void 0 : serverConfigResponse.gitHash;
        this.server = (serverConfigResponse === null || serverConfigResponse === void 0 ? void 0 : serverConfigResponse.server)
            ? new ThirdPartyServerConfigData(serverConfigResponse.server)
            : null;
        this.utcDate = new Date().toISOString();
        this.environment = (serverConfigResponse === null || serverConfigResponse === void 0 ? void 0 : serverConfigResponse.environment)
            ? new EnvironmentServerConfigData(serverConfigResponse.environment)
            : null;
        this.featureStates = serverConfigResponse === null || serverConfigResponse === void 0 ? void 0 : serverConfigResponse.featureStates;
    }
    static fromJSON(obj) {
        return Object.assign(new ServerConfigData({}), obj, {
            server: (obj === null || obj === void 0 ? void 0 : obj.server) ? ThirdPartyServerConfigData.fromJSON(obj.server) : null,
            environment: (obj === null || obj === void 0 ? void 0 : obj.environment) ? EnvironmentServerConfigData.fromJSON(obj.environment) : null,
        });
    }
}
exports.ServerConfigData = ServerConfigData;
class ThirdPartyServerConfigData {
    constructor(response) {
        this.name = response.name;
        this.url = response.url;
    }
    static fromJSON(obj) {
        return Object.assign(new ThirdPartyServerConfigData({}), obj);
    }
}
exports.ThirdPartyServerConfigData = ThirdPartyServerConfigData;
class EnvironmentServerConfigData {
    constructor(response) {
        this.cloudRegion = response.cloudRegion;
        this.vault = response.vault;
        this.api = response.api;
        this.identity = response.identity;
        this.notifications = response.notifications;
        this.sso = response.sso;
    }
    static fromJSON(obj) {
        return Object.assign(new EnvironmentServerConfigData({}), obj);
    }
}
exports.EnvironmentServerConfigData = EnvironmentServerConfigData;
//# sourceMappingURL=server-config.data.js.map