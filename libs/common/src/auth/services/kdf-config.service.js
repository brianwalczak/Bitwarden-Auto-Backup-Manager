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
exports.KdfConfigService = exports.KDF_CONFIG = void 0;
const rxjs_1 = require("rxjs");
const kdf_type_enum_1 = require("../../platform/enums/kdf-type.enum");
const state_1 = require("../../platform/state");
const kdf_config_1 = require("../models/domain/kdf-config");
exports.KDF_CONFIG = new state_1.UserKeyDefinition(state_1.KDF_CONFIG_DISK, "kdfConfig", {
    deserializer: (kdfConfig) => {
        if (kdfConfig == null) {
            return null;
        }
        return kdfConfig.kdfType === kdf_type_enum_1.KdfType.PBKDF2_SHA256
            ? kdf_config_1.PBKDF2KdfConfig.fromJSON(kdfConfig)
            : kdf_config_1.Argon2KdfConfig.fromJSON(kdfConfig);
    },
    clearOn: ["logout"],
});
class KdfConfigService {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
    }
    setKdfConfig(userId, kdfConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("userId cannot be null");
            }
            if (kdfConfig === null) {
                throw new Error("kdfConfig cannot be null");
            }
            yield this.stateProvider.setUserState(exports.KDF_CONFIG, kdfConfig, userId);
        });
    }
    getKdfConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.activeUserId$);
            const state = yield (0, rxjs_1.firstValueFrom)(this.stateProvider.getUser(userId, exports.KDF_CONFIG).state$);
            if (state === null) {
                throw new Error("KdfConfig for active user account state is null");
            }
            return state;
        });
    }
}
exports.KdfConfigService = KdfConfigService;
//# sourceMappingURL=kdf-config.service.js.map