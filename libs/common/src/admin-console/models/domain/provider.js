"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const enums_1 = require("../../enums");
class Provider {
    constructor(obj) {
        if (obj == null) {
            return;
        }
        this.id = obj.id;
        this.name = obj.name;
        this.status = obj.status;
        this.type = obj.type;
        this.enabled = obj.enabled;
        this.userId = obj.userId;
        this.useEvents = obj.useEvents;
        this.providerStatus = obj.providerStatus;
    }
    get canAccess() {
        if (this.isProviderAdmin) {
            return true;
        }
        return this.enabled && this.status === enums_1.ProviderUserStatusType.Confirmed;
    }
    get canCreateOrganizations() {
        return this.enabled && this.isProviderAdmin;
    }
    get canManageUsers() {
        return this.isProviderAdmin;
    }
    get canAccessEventLogs() {
        return this.isProviderAdmin;
    }
    get isProviderAdmin() {
        return this.type === enums_1.ProviderUserType.ProviderAdmin;
    }
}
exports.Provider = Provider;
//# sourceMappingURL=provider.js.map