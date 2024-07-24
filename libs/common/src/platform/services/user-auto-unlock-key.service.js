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
exports.UserAutoUnlockKeyService = void 0;
const enums_1 = require("../enums");
// TODO: this is a half measure improvement which allows us to reduce some side effects today (cryptoService.getUserKey setting user key in memory if auto key exists)
// but ideally, in the future, we would be able to put this logic into the cryptoService
// after the vault timeout settings service is transitioned to state provider so that
// the getUserKey logic can simply go to the correct location based on the vault timeout settings
// similar to the TokenService (it would either go to secure storage for the auto user key or memory for the user key)
class UserAutoUnlockKeyService {
    constructor(cryptoService) {
        this.cryptoService = cryptoService;
    }
    /**
     * The presence of the user key in memory dictates whether the user's vault is locked or unlocked.
     * However, for users that have the auto unlock user key set, we need to set the user key in memory
     * on application bootstrap and on active account changes so that the user's vault loads unlocked.
     * @param userId - The user id to check for an auto user key.
     */
    setUserKeyInMemoryIfAutoUserKeySet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                return;
            }
            const autoUserKey = yield this.cryptoService.getUserKeyFromStorage(enums_1.KeySuffixOptions.Auto, userId);
            if (autoUserKey == null) {
                return;
            }
            yield this.cryptoService.setUserKey(autoUserKey, userId);
        });
    }
}
exports.UserAutoUnlockKeyService = UserAutoUnlockKeyService;
//# sourceMappingURL=user-auto-unlock-key.service.js.map