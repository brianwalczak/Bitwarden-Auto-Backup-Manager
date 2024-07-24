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
exports.LegacyPasswordHistoryDecryptor = void 0;
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const generated_password_history_1 = require("../password/generated-password-history");
/** Strategy that decrypts a password history */
class LegacyPasswordHistoryDecryptor {
    constructor(userId, cryptoService, encryptService) {
        this.userId = userId;
        this.cryptoService = cryptoService;
        this.encryptService = encryptService;
    }
    /** Decrypts a password history. */
    decrypt(history) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.cryptoService.getUserKey(this.userId);
            const promises = (history !== null && history !== void 0 ? history : []).map((item) => __awaiter(this, void 0, void 0, function* () {
                const encrypted = new enc_string_1.EncString(item.password);
                const decrypted = yield this.encryptService.decryptToUtf8(encrypted, key);
                return new generated_password_history_1.GeneratedPasswordHistory(decrypted, item.date);
            }));
            const decrypted = yield Promise.all(promises);
            return decrypted;
        });
    }
}
exports.LegacyPasswordHistoryDecryptor = LegacyPasswordHistoryDecryptor;
//# sourceMappingURL=legacy-password-history-decryptor.js.map