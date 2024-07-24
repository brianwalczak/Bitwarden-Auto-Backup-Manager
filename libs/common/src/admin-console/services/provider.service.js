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
exports.ProviderService = exports.PROVIDERS = void 0;
const rxjs_1 = require("rxjs");
const state_1 = require("../../platform/state");
const provider_1 = require("../models/domain/provider");
exports.PROVIDERS = state_1.UserKeyDefinition.record(state_1.PROVIDERS_DISK, "providers", {
    deserializer: (obj) => obj,
    clearOn: ["logout"],
});
function mapToSingleProvider(providerId) {
    return (0, rxjs_1.map)((providers) => providers === null || providers === void 0 ? void 0 : providers.find((p) => p.id === providerId));
}
class ProviderService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
    }
    providers$(userId) {
        // FIXME: Can be replaced with `getUserStateOrDefault$` if we weren't trying to pick this.
        return (userId != null
            ? this.stateProvider.getUser(userId, exports.PROVIDERS).state$
            : this.stateProvider.activeUserId$.pipe((0, rxjs_1.take)(1), (0, rxjs_1.switchMap)((userId) => userId != null ? this.stateProvider.getUser(userId, exports.PROVIDERS).state$ : (0, rxjs_1.of)(null)))).pipe(this.mapProviderRecordToArray());
    }
    mapProviderRecordToArray() {
        return (0, rxjs_1.map)((providers) => { var _a; return (_a = Object.values(providers !== null && providers !== void 0 ? providers : {})) === null || _a === void 0 ? void 0 : _a.map((o) => new provider_1.Provider(o)); });
    }
    get$(id) {
        return this.providers$().pipe(mapToSingleProvider(id));
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.providers$().pipe(mapToSingleProvider(id)));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.providers$());
        });
    }
    save(providers, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.setUserState(exports.PROVIDERS, providers, userId);
        });
    }
}
exports.ProviderService = ProviderService;
//# sourceMappingURL=provider.service.js.map