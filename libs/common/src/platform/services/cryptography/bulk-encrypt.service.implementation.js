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
exports.BulkEncryptServiceImplementation = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../misc/utils");
const get_class_initializer_1 = require("./get-class-initializer");
// TTL (time to live) is not strictly required but avoids tying up memory resources if inactive
const workerTTL = 60000; // 1 minute
const maxWorkers = 8;
const minNumberOfItemsForMultithreading = 400;
class BulkEncryptServiceImplementation {
    constructor(cryptoFunctionService, logService) {
        this.cryptoFunctionService = cryptoFunctionService;
        this.logService = logService;
        this.workers = [];
        this.clear$ = new rxjs_1.Subject();
    }
    /**
     * Decrypts items using a web worker if the environment supports it.
     * Will fall back to the main thread if the window object is not available.
     */
    decryptItems(items, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                throw new Error("No encryption key provided.");
            }
            if (items == null || items.length < 1) {
                return [];
            }
            if (typeof window === "undefined") {
                this.logService.info("Window not available in BulkEncryptService, decrypting sequentially");
                const results = [];
                for (let i = 0; i < items.length; i++) {
                    results.push(yield items[i].decrypt(key));
                }
                return results;
            }
            const decryptedItems = yield this.getDecryptedItemsFromWorkers(items, key);
            return decryptedItems;
        });
    }
    /**
     * Sends items to a set of web workers to decrypt them. This utilizes multiple workers to decrypt items
     * faster without interrupting other operations (e.g. updating UI).
     */
    getDecryptedItemsFromWorkers(items, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (items == null || items.length < 1) {
                return [];
            }
            this.clearTimeout();
            const hardwareConcurrency = navigator.hardwareConcurrency || 1;
            let numberOfWorkers = Math.min(hardwareConcurrency, maxWorkers);
            if (items.length < minNumberOfItemsForMultithreading) {
                numberOfWorkers = 1;
            }
            this.logService.info(`Starting decryption using multithreading with ${numberOfWorkers} workers for ${items.length} items`);
            if (this.workers.length == 0) {
                for (let i = 0; i < numberOfWorkers; i++) {
                    this.workers.push(new Worker(new URL(
                    /* webpackChunkName: 'encrypt-worker' */
                    "@bitwarden/common/platform/services/cryptography/encrypt.worker.ts", import.meta.url)));
                }
            }
            const itemsPerWorker = Math.floor(items.length / this.workers.length);
            const results = [];
            for (const [i, worker] of this.workers.entries()) {
                const start = i * itemsPerWorker;
                const end = start + itemsPerWorker;
                const itemsForWorker = items.slice(start, end);
                // push the remaining items to the last worker
                if (i == this.workers.length - 1) {
                    itemsForWorker.push(...items.slice(end));
                }
                const request = {
                    id: utils_1.Utils.newGuid(),
                    items: itemsForWorker,
                    key: key,
                };
                worker.postMessage(JSON.stringify(request));
                results.push((0, rxjs_1.firstValueFrom)((0, rxjs_1.fromEvent)(worker, "message").pipe((0, rxjs_1.filter)((response) => { var _a; return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.id) === request.id; }), (0, rxjs_1.map)((response) => JSON.parse(response.data.items)), (0, rxjs_1.map)((items) => items.map((jsonItem) => {
                    const initializer = (0, get_class_initializer_1.getClassInitializer)(jsonItem.initializerKey);
                    return initializer(jsonItem);
                })), (0, rxjs_1.takeUntil)(this.clear$), (0, rxjs_1.defaultIfEmpty)([]))));
            }
            const decryptedItems = (yield Promise.all(results)).flat();
            this.logService.info(`Finished decrypting ${decryptedItems.length} items using ${numberOfWorkers} workers`);
            this.restartTimeout();
            return decryptedItems;
        });
    }
    clear() {
        this.clear$.next();
        for (const worker of this.workers) {
            worker.terminate();
        }
        this.workers = [];
        this.clearTimeout();
    }
    restartTimeout() {
        this.clearTimeout();
        this.timeout = setTimeout(() => this.clear(), workerTTL);
    }
    clearTimeout() {
        if (this.timeout != null) {
            clearTimeout(this.timeout);
        }
    }
}
exports.BulkEncryptServiceImplementation = BulkEncryptServiceImplementation;
//# sourceMappingURL=bulk-encrypt.service.implementation.js.map