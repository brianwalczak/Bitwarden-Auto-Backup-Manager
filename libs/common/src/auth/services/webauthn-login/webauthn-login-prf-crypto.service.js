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
exports.WebAuthnLoginPrfCryptoService = void 0;
const symmetric_crypto_key_1 = require("../../../platform/models/domain/symmetric-crypto-key");
const LoginWithPrfSalt = "passwordless-login";
class WebAuthnLoginPrfCryptoService {
    constructor(cryptoFunctionService) {
        this.cryptoFunctionService = cryptoFunctionService;
    }
    getLoginWithPrfSalt() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cryptoFunctionService.hash(LoginWithPrfSalt, "sha256");
        });
    }
    createSymmetricKeyFromPrf(prf) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.stretchKey(new Uint8Array(prf)));
        });
    }
    // TODO: use keyGenerationService.stretchKey
    stretchKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKey = new Uint8Array(64);
            const encKey = yield this.cryptoFunctionService.hkdfExpand(key, "enc", 32, "sha256");
            const macKey = yield this.cryptoFunctionService.hkdfExpand(key, "mac", 32, "sha256");
            newKey.set(new Uint8Array(encKey));
            newKey.set(new Uint8Array(macKey), 32);
            return new symmetric_crypto_key_1.SymmetricCryptoKey(newKey);
        });
    }
}
exports.WebAuthnLoginPrfCryptoService = WebAuthnLoginPrfCryptoService;
//# sourceMappingURL=webauthn-login-prf-crypto.service.js.map