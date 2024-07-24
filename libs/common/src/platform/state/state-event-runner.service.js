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
exports.StateEventRunnerService = void 0;
const rxjs_1 = require("rxjs");
const state_definition_1 = require("./state-definition");
const state_event_registrar_service_1 = require("./state-event-registrar.service");
const user_key_definition_1 = require("./user-key-definition");
class StateEventRunnerService {
    constructor(globalStateProvider, storageServiceProvider) {
        this.storageServiceProvider = storageServiceProvider;
        this.stateEventMap = {
            lock: globalStateProvider.get(state_event_registrar_service_1.STATE_LOCK_EVENT),
            logout: globalStateProvider.get(state_event_registrar_service_1.STATE_LOGOUT_EVENT),
        };
    }
    handleEvent(event, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let tickets = yield (0, rxjs_1.firstValueFrom)(this.stateEventMap[event].state$);
            tickets !== null && tickets !== void 0 ? tickets : (tickets = []);
            const failures = [];
            for (const ticket of tickets) {
                try {
                    const [, service] = this.storageServiceProvider.get(ticket.location, {});
                    const ticketStorageKey = this.storageKeyFor(userId, ticket);
                    // Evaluate current value so we can avoid writing to state if we don't need to
                    const currentValue = yield service.get(ticketStorageKey);
                    if (currentValue != null) {
                        yield service.remove(ticketStorageKey);
                    }
                }
                catch (err) {
                    let errorMessage = "Unknown Error";
                    if (typeof err === "object" && "message" in err && typeof err.message === "string") {
                        errorMessage = err.message;
                    }
                    failures.push(`${errorMessage} in ${ticket.state} > ${ticket.key} located ${ticket.location}`);
                }
            }
            if (failures.length > 0) {
                // Throw aggregated error
                throw new Error(`One or more errors occurred while handling event '${event}' for user ${userId}.\n${failures.join("\n")}`);
            }
        });
    }
    storageKeyFor(userId, ticket) {
        const userKey = new user_key_definition_1.UserKeyDefinition(new state_definition_1.StateDefinition(ticket.state, ticket.location), ticket.key, {
            deserializer: (v) => v,
            clearOn: [],
        });
        return userKey.buildKey(userId);
    }
}
exports.StateEventRunnerService = StateEventRunnerService;
//# sourceMappingURL=state-event-runner.service.js.map