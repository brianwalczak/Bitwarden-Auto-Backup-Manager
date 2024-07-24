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
exports.MultithreadEncryptServiceImplementation = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../../platform/misc/utils");
const encrypt_service_implementation_1 = require("./encrypt.service.implementation");
const get_class_initializer_1 = require("./get-class-initializer");
// TTL (time to live) is not strictly required but avoids tying up memory resources if inactive
const workerTTL = 3 * 60000; // 3 minutes
/**
 * @deprecated Replaced by BulkEncryptionService (PM-4154)
 */
class MultithreadEncryptServiceImplementation extends encrypt_service_implementation_1.EncryptServiceImplementation {
    constructor() {
        super(...arguments);
        this.clear$ = new rxjs_1.Subject();
    }
    /**
     * Sends items to a web worker to decrypt them.
     * This utilises multithreading to decrypt items faster without interrupting other operations (e.g. updating UI).
     */
    decryptItems(items, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (items == null || items.length < 1) {
                return [];
            }
            this.logService.info("Starting decryption using multithreading");
            (_a = this.worker) !== null && _a !== void 0 ? _a : (this.worker = new Worker(new URL(
            /* webpackChunkName: 'encrypt-worker' */
            "@bitwarden/common/platform/services/cryptography/encrypt.worker.ts", import.meta.url)));
            this.restartTimeout();
            const request = {
                id: utils_1.Utils.newGuid(),
                items: items,
                key: key,
            };
            this.worker.postMessage(JSON.stringify(request));
            return yield (0, rxjs_1.firstValueFrom)((0, rxjs_1.fromEvent)(this.worker, "message").pipe((0, rxjs_1.filter)((response) => { var _a; return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.id) === request.id; }), (0, rxjs_1.map)((response) => JSON.parse(response.data.items)), (0, rxjs_1.map)((items) => items.map((jsonItem) => {
                const initializer = (0, get_class_initializer_1.getClassInitializer)(jsonItem.initializerKey);
                return initializer(jsonItem);
            })), (0, rxjs_1.takeUntil)(this.clear$), (0, rxjs_1.defaultIfEmpty)([])));
        });
    }
    clear() {
        var _a;
        this.clear$.next();
        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.terminate();
        this.worker = null;
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
exports.MultithreadEncryptServiceImplementation = MultithreadEncryptServiceImplementation;
//# sourceMappingURL=multithread-encrypt.service.implementation.js.map