"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policy = void 0;
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const policy_data_1 = require("../data/policy.data");
class Policy extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.id = obj.id;
        this.organizationId = obj.organizationId;
        this.type = obj.type;
        this.data = obj.data;
        this.enabled = obj.enabled;
    }
    static fromResponse(response) {
        return new Policy(new policy_data_1.PolicyData(response));
    }
    static fromListResponse(response) {
        var _a, _b;
        return (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.map((d) => Policy.fromResponse(d))) !== null && _b !== void 0 ? _b : undefined;
    }
}
exports.Policy = Policy;
//# sourceMappingURL=policy.js.map