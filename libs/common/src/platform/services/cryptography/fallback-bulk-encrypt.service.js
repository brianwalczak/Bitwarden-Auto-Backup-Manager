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
exports.FallbackBulkEncryptService = void 0;
/**
 * @deprecated For the feature flag from PM-4154, remove once feature is rolled out
 */
class FallbackBulkEncryptService {
    constructor(encryptService) {
        this.encryptService = encryptService;
    }
    /**
     * Decrypts items using a web worker if the environment supports it.
     * Will fall back to the main thread if the window object is not available.
     */
    decryptItems(items, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.featureFlagEncryptService != null) {
                return yield this.featureFlagEncryptService.decryptItems(items, key);
            }
            else {
                return yield this.encryptService.decryptItems(items, key);
            }
        });
    }
    setFeatureFlagEncryptService(featureFlagEncryptService) {
        return __awaiter(this, void 0, void 0, function* () {
            this.featureFlagEncryptService = featureFlagEncryptService;
        });
    }
}
exports.FallbackBulkEncryptService = FallbackBulkEncryptService;
//# sourceMappingURL=fallback-bulk-encrypt.service.js.map