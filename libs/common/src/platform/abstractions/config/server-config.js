"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfig = void 0;
const dayInMilliseconds = 24 * 3600 * 1000;
class ServerConfig {
    constructor(serverConfigData) {
        var _a, _b;
        this.featureStates = {};
        this.version = serverConfigData.version;
        this.gitHash = serverConfigData.gitHash;
        this.server = serverConfigData.server;
        this.utcDate = new Date(serverConfigData.utcDate);
        this.environment = serverConfigData.environment;
        this.featureStates = serverConfigData.featureStates;
        if (((_a = this.server) === null || _a === void 0 ? void 0 : _a.name) == null && ((_b = this.server) === null || _b === void 0 ? void 0 : _b.url) == null) {
            this.server = null;
        }
    }
    getAgeInMilliseconds() {
        var _a;
        return new Date().getTime() - ((_a = this.utcDate) === null || _a === void 0 ? void 0 : _a.getTime());
    }
    isValid() {
        return this.getAgeInMilliseconds() <= dayInMilliseconds;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return new ServerConfig(obj);
    }
}
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=server-config.js.map