"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyData = void 0;
class PolicyData {
    constructor(response) {
        if (response == null) {
            return;
        }
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.type = response.type;
        this.data = response.data;
        this.enabled = response.enabled;
    }
    static fromPolicy(policy) {
        return Object.assign(new PolicyData(), policy);
    }
}
exports.PolicyData = PolicyData;
//# sourceMappingURL=policy.data.js.map