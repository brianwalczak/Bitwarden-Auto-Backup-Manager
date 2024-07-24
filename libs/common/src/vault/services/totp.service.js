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
exports.TotpService = void 0;
const utils_1 = require("../../platform/misc/utils");
const B32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const SteamChars = "23456789BCDFGHJKMNPQRTVWXY";
class TotpService {
    constructor(cryptoFunctionService, logService) {
        this.cryptoFunctionService = cryptoFunctionService;
        this.logService = logService;
    }
    getCode(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                return null;
            }
            let period = 30;
            let alg = "sha1";
            let digits = 6;
            let keyB32 = key;
            const isOtpAuth = key.toLowerCase().indexOf("otpauth://") === 0;
            const isSteamAuth = !isOtpAuth && key.toLowerCase().indexOf("steam://") === 0;
            if (isOtpAuth) {
                const params = utils_1.Utils.getQueryParams(key);
                if (params.has("digits") && params.get("digits") != null) {
                    try {
                        const digitParams = parseInt(params.get("digits").trim(), null);
                        if (digitParams > 10) {
                            digits = 10;
                        }
                        else if (digitParams > 0) {
                            digits = digitParams;
                        }
                    }
                    catch (_a) {
                        this.logService.error("Invalid digits param.");
                    }
                }
                if (params.has("period") && params.get("period") != null) {
                    try {
                        const periodParam = parseInt(params.get("period").trim(), null);
                        if (periodParam > 0) {
                            period = periodParam;
                        }
                    }
                    catch (_b) {
                        this.logService.error("Invalid period param.");
                    }
                }
                if (params.has("secret") && params.get("secret") != null) {
                    keyB32 = params.get("secret");
                }
                if (params.has("algorithm") && params.get("algorithm") != null) {
                    const algParam = params.get("algorithm").toLowerCase();
                    if (algParam === "sha1" || algParam === "sha256" || algParam === "sha512") {
                        alg = algParam;
                    }
                }
            }
            else if (isSteamAuth) {
                keyB32 = key.substr("steam://".length);
                digits = 5;
            }
            const epoch = Math.round(new Date().getTime() / 1000.0);
            const timeHex = this.leftPad(this.decToHex(Math.floor(epoch / period)), 16, "0");
            const timeBytes = utils_1.Utils.fromHexToArray(timeHex);
            const keyBytes = this.b32ToBytes(keyB32);
            if (!keyBytes.length || !timeBytes.length) {
                return null;
            }
            const hash = yield this.sign(keyBytes, timeBytes, alg);
            if (hash.length === 0) {
                return null;
            }
            const offset = hash[hash.length - 1] & 0xf;
            const binary = ((hash[offset] & 0x7f) << 24) |
                ((hash[offset + 1] & 0xff) << 16) |
                ((hash[offset + 2] & 0xff) << 8) |
                (hash[offset + 3] & 0xff);
            let otp = "";
            if (isSteamAuth) {
                let fullCode = binary & 0x7fffffff;
                for (let i = 0; i < digits; i++) {
                    otp += SteamChars[fullCode % SteamChars.length];
                    fullCode = Math.trunc(fullCode / SteamChars.length);
                }
            }
            else {
                otp = (binary % Math.pow(10, digits)).toString();
                otp = this.leftPad(otp, digits, "0");
            }
            return otp;
        });
    }
    getTimeInterval(key) {
        let period = 30;
        if (key != null && key.toLowerCase().indexOf("otpauth://") === 0) {
            const params = utils_1.Utils.getQueryParams(key);
            if (params.has("period") && params.get("period") != null) {
                try {
                    period = parseInt(params.get("period").trim(), null);
                }
                catch (_a) {
                    this.logService.error("Invalid period param.");
                }
            }
        }
        return period;
    }
    // Helpers
    leftPad(s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    }
    decToHex(d) {
        return (d < 15.5 ? "0" : "") + Math.round(d).toString(16);
    }
    b32ToHex(s) {
        s = s.toUpperCase();
        let cleanedInput = "";
        for (let i = 0; i < s.length; i++) {
            if (B32Chars.indexOf(s[i]) < 0) {
                continue;
            }
            cleanedInput += s[i];
        }
        s = cleanedInput;
        let bits = "";
        let hex = "";
        for (let i = 0; i < s.length; i++) {
            const byteIndex = B32Chars.indexOf(s.charAt(i));
            if (byteIndex < 0) {
                continue;
            }
            bits += this.leftPad(byteIndex.toString(2), 5, "0");
        }
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            const chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    }
    b32ToBytes(s) {
        return utils_1.Utils.fromHexToArray(this.b32ToHex(s));
    }
    sign(keyBytes, timeBytes, alg) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this.cryptoFunctionService.hmac(timeBytes, keyBytes, alg);
            return new Uint8Array(signature);
        });
    }
}
exports.TotpService = TotpService;
//# sourceMappingURL=totp.service.js.map