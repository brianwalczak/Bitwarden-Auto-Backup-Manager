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
exports.EncString = void 0;
const enums_1 = require("../../enums");
const utils_1 = require("../../misc/utils");

class EncString {
    constructor(encryptedStringOrType, data, iv, mac) {
        if (data != null) {
            this.initFromData(encryptedStringOrType, data, iv, mac);
        }
        else {
            this.initFromEncryptedString(encryptedStringOrType);
        }
    }
    get ivBytes() {
        return this.iv == null ? null : utils_1.Utils.fromB64ToArray(this.iv);
    }
    get macBytes() {
        return this.mac == null ? null : utils_1.Utils.fromB64ToArray(this.mac);
    }
    get dataBytes() {
        return this.data == null ? null : utils_1.Utils.fromB64ToArray(this.data);
    }
    toJSON() {
        return this.encryptedString;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        return new EncString(obj);
    }
    initFromData(encType, data, iv, mac) {
        if (iv != null) {
            this.encryptedString = (encType + "." + iv + "|" + data);
        }
        else {
            this.encryptedString = (encType + "." + data);
        }
        // mac
        if (mac != null) {
            this.encryptedString = (this.encryptedString + "|" + mac);
        }
        this.encryptionType = encType;
        this.data = data;
        this.iv = iv;
        this.mac = mac;
    }
    initFromEncryptedString(encryptedString) {
        this.encryptedString = encryptedString;
        if (!this.encryptedString) {
            return;
        }
        const { encType, encPieces } = EncString.parseEncryptedString(this.encryptedString);
        this.encryptionType = encType;
        if (encPieces.length !== enums_1.EXPECTED_NUM_PARTS_BY_ENCRYPTION_TYPE[encType]) {
            return;
        }
        switch (encType) {
            case enums_1.EncryptionType.AesCbc128_HmacSha256_B64:
            case enums_1.EncryptionType.AesCbc256_HmacSha256_B64:
                this.iv = encPieces[0];
                this.data = encPieces[1];
                this.mac = encPieces[2];
                break;
            case enums_1.EncryptionType.AesCbc256_B64:
                this.iv = encPieces[0];
                this.data = encPieces[1];
                break;
            case enums_1.EncryptionType.Rsa2048_OaepSha256_B64:
            case enums_1.EncryptionType.Rsa2048_OaepSha1_B64:
                this.data = encPieces[0];
                break;
            case enums_1.EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
            case enums_1.EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                this.data = encPieces[0];
                this.mac = encPieces[1];
                break;
            default:
                return;
        }
    }
    static parseEncryptedString(encryptedString) {
        const headerPieces = encryptedString.split(".");
        let encType;
        let encPieces = null;
        if (headerPieces.length === 2) {
            try {
                encType = parseInt(headerPieces[0], null);
                encPieces = headerPieces[1].split("|");
            }
            catch (e) {
                return { encType: NaN, encPieces: [] };
            }
        }
        else {
            encPieces = encryptedString.split("|");
            encType =
                encPieces.length === 3
                    ? enums_1.EncryptionType.AesCbc128_HmacSha256_B64
                    : enums_1.EncryptionType.AesCbc256_B64;
        }
        return {
            encType,
            encPieces,
        };
    }
    static isSerializedEncString(s) {
        if (s == null) {
            return false;
        }
        const { encType, encPieces } = this.parseEncryptedString(s);
        if (isNaN(encType) || encPieces.length === 0) {
            return false;
        }
        return enums_1.EXPECTED_NUM_PARTS_BY_ENCRYPTION_TYPE[encType] === encPieces.length;
    }
    decrypt(orgId_1) {
        return __awaiter(this, arguments, void 0, function* (orgId, key = null) {
            if (this.decryptedValue != null) {
                return this.decryptedValue;
            }
            try {
                if (key == null) {
                    key = yield this.getKeyForDecryption(orgId);
                }
                if (key == null) {
                    throw new Error("No key to decrypt EncString with orgId " + orgId);
                }

                const encryptService = utils_1.Utils.getContainerService().getEncryptService();
                this.decryptedValue = yield encryptService.decryptToUtf8(this, key);
            }
            catch (e) {
                console.log(e);
                this.decryptedValue = "[error: cannot decrypt]";
            }
            return this.decryptedValue;
        });
    }
    getKeyForDecryption(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cryptoService = utils_1.Utils.getContainerService().getCryptoService();
            return orgId != null
                ? yield cryptoService.getOrgKey(orgId)
                : yield cryptoService.getUserKeyWithLegacySupport();
        });
    }
}
exports.EncString = EncString;
//# sourceMappingURL=enc-string.js.map