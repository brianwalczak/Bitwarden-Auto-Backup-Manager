"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateEventRegistrarService = exports.STATE_LOGOUT_EVENT = exports.STATE_LOCK_EVENT = void 0;
const key_definition_1 = require("./key-definition");
const state_definitions_1 = require("./state-definitions");
exports.STATE_LOCK_EVENT = key_definition_1.KeyDefinition.array(state_definitions_1.CLEAR_EVENT_DISK, "lock", {
    deserializer: (e) => e,
});
exports.STATE_LOGOUT_EVENT = key_definition_1.KeyDefinition.array(state_definitions_1.CLEAR_EVENT_DISK, "logout", {
    deserializer: (e) => e,
});
class StateEventRegistrarService {
    constructor(globalStateProvider, storageServiceProvider) {
        this.storageServiceProvider = storageServiceProvider;
        this.stateEventStateMap = {
            lock: globalStateProvider.get(exports.STATE_LOCK_EVENT),
            logout: globalStateProvider.get(exports.STATE_LOGOUT_EVENT),
        };
    }
    registerEvents(keyDefinition) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const clearEvent of keyDefinition.clearOn) {
                const eventState = this.stateEventStateMap[clearEvent];
                // Determine the storage location for this
                const [storageLocation] = this.storageServiceProvider.get(keyDefinition.stateDefinition.defaultStorageLocation, keyDefinition.stateDefinition.storageLocationOverrides);
                const newEvent = {
                    state: keyDefinition.stateDefinition.name,
                    key: keyDefinition.key,
                    location: storageLocation,
                };
                // Only update the event state if the existing list doesn't have a matching entry
                yield eventState.update((existingTickets) => {
                    existingTickets !== null && existingTickets !== void 0 ? existingTickets : (existingTickets = []);
                    existingTickets.push(newEvent);
                    return existingTickets;
                }, {
                    shouldUpdate: (currentTickets) => {
                        return (
                        // If the current tickets are null, then it will for sure be added
                        currentTickets == null ||
                            // If an existing match couldn't be found, we also need to add one
                            currentTickets.findIndex((e) => e.state === newEvent.state &&
                                e.key === newEvent.key &&
                                e.location === newEvent.location) === -1);
                    },
                });
            }
        });
    }
}
exports.StateEventRegistrarService = StateEventRegistrarService;
//# sourceMappingURL=state-event-registrar.service.js.map