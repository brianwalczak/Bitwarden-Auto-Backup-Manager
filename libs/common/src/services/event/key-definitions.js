"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_COLLECTION = void 0;
const event_data_1 = require("../../models/data/event.data");
const state_1 = require("../../platform/state");
exports.EVENT_COLLECTION = state_1.UserKeyDefinition.array(state_1.EVENT_COLLECTION_DISK, "events", {
    deserializer: (s) => event_data_1.EventData.fromJSON(s),
    clearOn: ["logout"],
});
//# sourceMappingURL=key-definitions.js.map