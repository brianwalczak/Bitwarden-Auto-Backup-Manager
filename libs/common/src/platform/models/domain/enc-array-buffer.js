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
exports.EncArrayBuffer = void 0;
const utils_1 = require("../../../platform/misc/utils");
const enums_1 = require("../../enums");
const ENC_TYPE_LENGTH = 1;
const IV_LENGTH = 16;
const MAC_LENGTH = 32;
const MIN_DATA_LENGTH = 1;
class EncArrayBuffer {
    constructor(buffer) {
        this.buffer = buffer;
        this.encryptionType = null;
        this.dataBytes = null;
        this.ivBytes = null;
        this.macBytes = null;
        const encBytes = buffer;
        const encType = encBytes[0];
        switch (encType) {
            case enums_1.EncryptionType.AesCbc128_HmacSha256_B64:
            case enums_1.EncryptionType.AesCbc256_HmacSha256_B64: {
                const minimumLength = ENC_TYPE_LENGTH + IV_LENGTH + MAC_LENGTH + MIN_DATA_LENGTH;
                if (encBytes.length < minimumLength) {
                    this.throwDecryptionError();
                }
                this.ivBytes = encBytes.slice(ENC_TYPE_LENGTH, ENC_TYPE_LENGTH + IV_LENGTH);
                this.macBytes = encBytes.slice(ENC_TYPE_LENGTH + IV_LENGTH, ENC_TYPE_LENGTH + IV_LENGTH + MAC_LENGTH);
                this.dataBytes = encBytes.slice(ENC_TYPE_LENGTH + IV_LENGTH + MAC_LENGTH);
                break;
            }
            case enums_1.EncryptionType.AesCbc256_B64: {
                const minimumLength = ENC_TYPE_LENGTH + IV_LENGTH + MIN_DATA_LENGTH;
                if (encBytes.length < minimumLength) {
                    this.throwDecryptionError();
                }
                this.ivBytes = encBytes.slice(ENC_TYPE_LENGTH, ENC_TYPE_LENGTH + IV_LENGTH);
                this.dataBytes = encBytes.slice(ENC_TYPE_LENGTH + IV_LENGTH);
                break;
            }
            default:
                this.throwDecryptionError();
        }
        this.encryptionType = encType;
    }
    throwDecryptionError() {
        throw new Error("Error parsing encrypted ArrayBuffer: data is corrupted or has an invalid format.");
    }
    static fromResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield response.arrayBuffer();
            if (buffer == null) {
                throw new Error("Cannot create EncArrayBuffer from Response - Response is empty");
            }
            return new EncArrayBuffer(new Uint8Array(buffer));
        });
    }
    static fromB64(b64) {
        const buffer = utils_1.Utils.fromB64ToArray(b64);
        return new EncArrayBuffer(buffer);
    }
}
exports.EncArrayBuffer = EncArrayBuffer;
//# sourceMappingURL=enc-array-buffer.js.map