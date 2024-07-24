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
exports.SendStateProvider = void 0;
const rxjs_1 = require("rxjs");
const key_definitions_1 = require("./key-definitions");
/** State provider for sends */
class SendStateProvider {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
        this.activeUserEncryptedState = this.stateProvider.getActive(key_definitions_1.SEND_USER_ENCRYPTED);
        this.encryptedState$ = this.activeUserEncryptedState.state$;
        this.activeUserDecryptedState = this.stateProvider.getActive(key_definitions_1.SEND_USER_DECRYPTED);
        this.decryptedState$ = this.activeUserDecryptedState.state$;
    }
    /** Gets the encrypted sends from state for an active user */
    getEncryptedSends() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.encryptedState$);
        });
    }
    /** Sets the encrypted send state for an active user */
    setEncryptedSends(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.activeUserEncryptedState.update(() => value);
        });
    }
    /** Gets the decrypted sends from state for the active user */
    getDecryptedSends() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.decryptedState$);
        });
    }
    /** Sets the decrypted send state for an active user */
    setDecryptedSends(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.activeUserDecryptedState.update(() => value);
        });
    }
}
exports.SendStateProvider = SendStateProvider;
//# sourceMappingURL=send-state.provider.js.map