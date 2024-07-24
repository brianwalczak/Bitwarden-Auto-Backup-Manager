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
exports.EventUploadService = void 0;
const rxjs_1 = require("rxjs");
const authentication_status_1 = require("../../auth/enums/authentication-status");
const event_request_1 = require("../../models/request/event.request");
const scheduled_task_name_enum_1 = require("../../platform/scheduling/scheduled-task-name.enum");
const key_definitions_1 = require("./key-definitions");
class EventUploadService {
    constructor(apiService, stateProvider, logService, authService, taskSchedulerService) {
        this.apiService = apiService;
        this.stateProvider = stateProvider;
        this.logService = logService;
        this.authService = authService;
        this.taskSchedulerService = taskSchedulerService;
        this.inited = false;
        this.taskSchedulerService.registerTaskHandler(scheduled_task_name_enum_1.ScheduledTaskNames.eventUploadsInterval, () => this.uploadEvents());
    }
    init(checkOnInterval) {
        if (this.inited) {
            return;
        }
        this.inited = true;
        if (checkOnInterval) {
            void this.uploadEvents();
            this.taskSchedulerService.setInterval(scheduled_task_name_enum_1.ScheduledTaskNames.eventUploadsInterval, 60 * 1000);
        }
    }
    /** Upload the event collection from state.
     *  @param userId upload events for provided user. If not active user will be used.
     */
    uploadEvents(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            }
            if (!userId) {
                return;
            }
            const isUnlocked = yield (0, rxjs_1.firstValueFrom)(this.authService
                .authStatusFor$(userId)
                .pipe((0, rxjs_1.map)((status) => status === authentication_status_1.AuthenticationStatus.Unlocked)));
            if (!isUnlocked) {
                return;
            }
            const eventCollection = yield this.takeEvents(userId);
            if (eventCollection == null || eventCollection.length === 0) {
                return;
            }
            const request = eventCollection.map((e) => {
                const req = new event_request_1.EventRequest();
                req.type = e.type;
                req.cipherId = e.cipherId;
                req.date = e.date;
                req.organizationId = e.organizationId;
                return req;
            });
            try {
                yield this.apiService.postEventsCollect(request, userId);
            }
            catch (e) {
                this.logService.error(e);
                // Add the events back to state if there was an error and they were not uploaded.
                yield this.stateProvider.setUserState(key_definitions_1.EVENT_COLLECTION, eventCollection, userId);
            }
        });
    }
    /** Return user's events and then clear them from state
     *  @param userId the user to grab and clear events for
     */
    takeEvents(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let taken = null;
            yield this.stateProvider.getUser(userId, key_definitions_1.EVENT_COLLECTION).update((current) => {
                taken = current !== null && current !== void 0 ? current : [];
                return [];
            });
            return taken;
        });
    }
}
exports.EventUploadService = EventUploadService;
//# sourceMappingURL=event-upload.service.js.map