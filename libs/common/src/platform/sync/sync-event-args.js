"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccessfullyCompleted = isSuccessfullyCompleted;
/**
 * Helper function to filter only on successfully completed syncs
 * @returns a function that can be used in a `.pipe(filter(...))` from an observable
 * @example
 * ```
 * of<SyncEventArgs>({ status: "Completed", successfully: true, data: new SyncResponse() })
 *  .pipe(filter(isSuccessfullyCompleted))
 *  .subscribe(event => {
 *    console.log(event.data);
 *  });
 * ```
 */
function isSuccessfullyCompleted(syncEvent) {
    return syncEvent.status === "Completed" && syncEvent.successfully;
}
//# sourceMappingURL=sync-event-args.js.map