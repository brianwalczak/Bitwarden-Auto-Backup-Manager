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
exports.AppIdService = exports.ANONYMOUS_APP_ID_KEY = exports.APP_ID_KEY = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../misc/utils");
const state_1 = require("../state");
exports.APP_ID_KEY = new state_1.KeyDefinition(state_1.APPLICATION_ID_DISK, "appId", {
    deserializer: (value) => value,
});
exports.ANONYMOUS_APP_ID_KEY = new state_1.KeyDefinition(state_1.APPLICATION_ID_DISK, "anonymousAppId", {
    deserializer: (value) => value,
});
class AppIdService {
    constructor(globalStateProvider) {
        const appIdState = globalStateProvider.get(exports.APP_ID_KEY);
        const anonymousAppIdState = globalStateProvider.get(exports.ANONYMOUS_APP_ID_KEY);
        this.appId$ = appIdState.state$.pipe((0, rxjs_1.concatMap)((appId) => __awaiter(this, void 0, void 0, function* () {
            if (!appId) {
                return yield appIdState.update(() => utils_1.Utils.newGuid(), {
                    shouldUpdate: (v) => v == null,
                });
            }
            return appId;
        })), (0, rxjs_1.distinctUntilChanged)(), (0, rxjs_1.share)());
        this.anonymousAppId$ = anonymousAppIdState.state$.pipe((0, rxjs_1.concatMap)((appId) => __awaiter(this, void 0, void 0, function* () {
            if (!appId) {
                return yield anonymousAppIdState.update(() => utils_1.Utils.newGuid(), {
                    shouldUpdate: (v) => v == null,
                });
            }
            return appId;
        })), (0, rxjs_1.distinctUntilChanged)(), (0, rxjs_1.share)());
    }
    getAppId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.appId$);
        });
    }
    getAnonymousAppId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.anonymousAppId$);
        });
    }
}
exports.AppIdService = AppIdService;
//# sourceMappingURL=app-id.service.js.map