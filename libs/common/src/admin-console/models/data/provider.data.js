"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderData = void 0;
class ProviderData {
    constructor(response) {
        this.id = response.id;
        this.name = response.name;
        this.status = response.status;
        this.type = response.type;
        this.enabled = response.enabled;
        this.userId = response.userId;
        this.useEvents = response.useEvents;
        this.providerStatus = response.providerStatus;
    }
}
exports.ProviderData = ProviderData;
//# sourceMappingURL=provider.data.js.map