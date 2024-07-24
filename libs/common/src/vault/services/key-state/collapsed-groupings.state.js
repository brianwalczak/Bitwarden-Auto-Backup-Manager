"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLAPSED_GROUPINGS = void 0;
const state_1 = require("../../../platform/state");
exports.COLLAPSED_GROUPINGS = state_1.UserKeyDefinition.array(state_1.VAULT_FILTER_DISK, "collapsedGroupings", {
    deserializer: (obj) => obj,
    clearOn: ["logout", "lock"],
});
//# sourceMappingURL=collapsed-groupings.state.js.map