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
exports.EventCollectionService = void 0;
const rxjs_1 = require("rxjs");
const authentication_status_1 = require("../../auth/enums/authentication-status");
const enums_1 = require("../../enums");
const event_data_1 = require("../../models/data/event.data");
const cipher_view_1 = require("../../vault/models/view/cipher.view");
const key_definitions_1 = require("./key-definitions");
class EventCollectionService {
    constructor(cipherService, stateProvider, organizationService, eventUploadService, authService, accountService) {
        this.cipherService = cipherService;
        this.stateProvider = stateProvider;
        this.organizationService = organizationService;
        this.eventUploadService = eventUploadService;
        this.authService = authService;
        this.accountService = accountService;
        this.orgIds$ = this.organizationService.organizations$.pipe((0, rxjs_1.map)((orgs) => { var _a, _b; return (_b = (_a = orgs === null || orgs === void 0 ? void 0 : orgs.filter((o) => o.useEvents)) === null || _a === void 0 ? void 0 : _a.map((x) => x.id)) !== null && _b !== void 0 ? _b : []; }));
    }
    /** Adds an event to the active user's event collection
     *  @param eventType the event type to be added
     *  @param ciphers The collection of ciphers to log events for
     *  @param uploadImmediately in some cases the recorded events should be uploaded right after being added
     */
    collectMany(eventType_1, ciphers_1) {
        return __awaiter(this, arguments, void 0, function* (eventType, ciphers, uploadImmediately = false) {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id)));
            const eventStore = this.stateProvider.getUser(userId, key_definitions_1.EVENT_COLLECTION);
            if (!(yield this.shouldUpdate(null, eventType, ciphers))) {
                return;
            }
            const events$ = this.orgIds$.pipe((0, rxjs_1.map)((orgs) => ciphers
                .filter((c) => orgs.includes(c.organizationId))
                .map((c) => ({
                type: eventType,
                cipherId: c.id,
                date: new Date().toISOString(),
                organizationId: c.organizationId,
            }))));
            yield eventStore.update((currentEvents, newEvents) => [...(currentEvents !== null && currentEvents !== void 0 ? currentEvents : []), ...newEvents], {
                combineLatestWith: events$,
            });
            if (uploadImmediately) {
                yield this.eventUploadService.uploadEvents();
            }
        });
    }
    /** Adds an event to the active user's event collection
     *  @param eventType the event type to be added
     *  @param cipherId if provided the id of the cipher involved in the event
     *  @param uploadImmediately in some cases the recorded events should be uploaded right after being added
     *  @param organizationId the organizationId involved in the event. If the cipherId is not provided an organizationId is required
     */
    collect(eventType_1) {
        return __awaiter(this, arguments, void 0, function* (eventType, cipherId = null, uploadImmediately = false, organizationId = null) {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.accountService.activeAccount$.pipe((0, rxjs_1.map)((a) => a === null || a === void 0 ? void 0 : a.id)));
            const eventStore = this.stateProvider.getUser(userId, key_definitions_1.EVENT_COLLECTION);
            if (!(yield this.shouldUpdate(organizationId, eventType, undefined, cipherId))) {
                return;
            }
            const event = new event_data_1.EventData();
            event.type = eventType;
            event.cipherId = cipherId;
            event.date = new Date().toISOString();
            event.organizationId = organizationId;
            yield eventStore.update((events) => {
                events = events !== null && events !== void 0 ? events : [];
                events.push(event);
                return events;
            });
            if (uploadImmediately) {
                yield this.eventUploadService.uploadEvents();
            }
        });
    }
    /** Verifies if the event collection should be updated for the provided information
     *  @param cipherId the cipher for the event
     *  @param organizationId the organization for the event
     */
    shouldUpdate() {
        return __awaiter(this, arguments, void 0, function* (organizationId = null, eventType = null, ciphers = [], cipherId) {
            const cipher$ = (0, rxjs_1.from)(this.cipherService.get(cipherId));
            const [authStatus, orgIds, cipher] = yield (0, rxjs_1.firstValueFrom)((0, rxjs_1.zip)(this.authService.activeAccountStatus$, this.orgIds$, cipher$));
            // The user must be authorized
            if (authStatus != authentication_status_1.AuthenticationStatus.Unlocked) {
                return false;
            }
            // User must have organizations assigned to them
            if (orgIds == null || orgIds.length == 0) {
                return false;
            }
            // Individual vault export doesn't need cipher id or organization id.
            if (eventType == enums_1.EventType.User_ClientExportedVault) {
                return true;
            }
            // If the cipherId was provided and a cipher exists, add it to the collection
            if (cipher != null) {
                ciphers.push(new cipher_view_1.CipherView(cipher));
            }
            // If no ciphers there must be an organization id provided
            if ((ciphers == null || ciphers.length == 0) && organizationId == null) {
                return false;
            }
            // If the input list of ciphers is provided. Check the ciphers to see if any
            // are in the user's org list
            if (ciphers != null && ciphers.length > 0) {
                const filtered = ciphers.filter((c) => orgIds.includes(c.organizationId));
                return filtered.length > 0;
            }
            // If the organization id is provided it must be in the user's org list
            if (organizationId != null && !orgIds.includes(organizationId)) {
                return false;
            }
            return true;
        });
    }
}
exports.EventCollectionService = EventCollectionService;
//# sourceMappingURL=event-collection.service.js.map