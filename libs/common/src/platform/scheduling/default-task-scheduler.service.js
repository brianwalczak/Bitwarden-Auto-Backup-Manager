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
exports.DefaultTaskSchedulerService = void 0;
const rxjs_1 = require("rxjs");
const task_scheduler_service_1 = require("../scheduling/task-scheduler.service");
class DefaultTaskSchedulerService extends task_scheduler_service_1.TaskSchedulerService {
    constructor(logService) {
        super();
        this.logService = logService;
        this.taskHandlers = new Map();
    }
    /**
     * Sets a timeout and returns the timeout id.
     *
     * @param taskName - The name of the task. Unused in the base implementation.
     * @param delayInMs - The delay in milliseconds.
     */
    setTimeout(taskName, delayInMs) {
        this.validateRegisteredTask(taskName);
        const timeoutHandle = globalThis.setTimeout(() => this.triggerTask(taskName), delayInMs);
        return new rxjs_1.Subscription(() => globalThis.clearTimeout(timeoutHandle));
    }
    /**
     * Sets an interval and returns the interval id.
     *
     * @param taskName - The name of the task. Unused in the base implementation.
     * @param intervalInMs - The interval in milliseconds.
     * @param _initialDelayInMs - The initial delay in milliseconds. Unused in the base implementation.
     */
    setInterval(taskName, intervalInMs, _initialDelayInMs) {
        this.validateRegisteredTask(taskName);
        const intervalHandle = globalThis.setInterval(() => this.triggerTask(taskName), intervalInMs);
        return new rxjs_1.Subscription(() => globalThis.clearInterval(intervalHandle));
    }
    /**
     * Registers a task handler.
     *
     * @param taskName - The name of the task.
     * @param handler - The task handler.
     */
    registerTaskHandler(taskName, handler) {
        const existingHandler = this.taskHandlers.get(taskName);
        if (existingHandler) {
            this.logService.warning(`Task handler for ${taskName} already exists. Overwriting.`);
            this.unregisterTaskHandler(taskName);
        }
        this.taskHandlers.set(taskName, handler);
    }
    /**
     * Unregisters a task handler.
     *
     * @param taskName - The name of the task.
     */
    unregisterTaskHandler(taskName) {
        this.taskHandlers.delete(taskName);
    }
    /**
     * Triggers a task.
     *
     * @param taskName - The name of the task.
     * @param _periodInMinutes - The period in minutes. Unused in the base implementation.
     */
    triggerTask(taskName, _periodInMinutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this.taskHandlers.get(taskName);
            if (handler) {
                handler();
            }
        });
    }
    /**
     * Validates that a task handler is registered.
     *
     * @param taskName - The name of the task.
     */
    validateRegisteredTask(taskName) {
        if (!this.taskHandlers.has(taskName)) {
            throw new Error(`Task handler for ${taskName} not registered. Unable to schedule task.`);
        }
    }
}
exports.DefaultTaskSchedulerService = DefaultTaskSchedulerService;
//# sourceMappingURL=default-task-scheduler.service.js.map