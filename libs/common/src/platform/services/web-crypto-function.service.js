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
exports.WebCryptoFunctionService = void 0;
const argon2 = require("argon2-browser");
const forge = require("node-forge");
const utils_1 = require("../../platform/misc/utils");
const decrypt_parameters_1 = require("../models/domain/decrypt-parameters");
class WebCryptoFunctionService {
    constructor(globalContext) {
        this.crypto = typeof globalContext.crypto !== "undefined" ? globalContext.crypto : null;
        this.subtle =
            !!this.crypto && typeof this.crypto.subtle !== "undefined" ? this.crypto.subtle : null;
        this.wasmSupported = this.checkIfWasmSupported();
    }
    pbkdf2(password, salt, algorithm, iterations) {
        return __awaiter(this, void 0, void 0, function* () {
            const wcLen = algorithm === "sha256" ? 256 : 512;
            const passwordBuf = this.toBuf(password);
            const saltBuf = this.toBuf(salt);
            const pbkdf2Params = {
                name: "PBKDF2",
                salt: saltBuf,
                iterations: iterations,
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey("raw", passwordBuf, { name: "PBKDF2" }, false, ["deriveBits"]);
            const buffer = yield this.subtle.deriveBits(pbkdf2Params, impKey, wcLen);
            return new Uint8Array(buffer);
        });
    }
    argon2(password, salt, iterations, memory, parallelism) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wasmSupported) {
                throw "Webassembly support is required for the Argon2 KDF feature.";
            }
            const passwordArr = new Uint8Array(this.toBuf(password));
            const saltArr = new Uint8Array(this.toBuf(salt));
            const result = yield argon2.hash({
                pass: passwordArr,
                salt: saltArr,
                time: iterations,
                mem: memory,
                parallelism: parallelism,
                hashLen: 32,
                type: argon2.ArgonType.Argon2id,
            });
            argon2.unloadRuntime();
            return result.hash;
        });
    }
    hkdf(ikm, salt, info, outputByteSize, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltBuf = this.toBuf(salt);
            const infoBuf = this.toBuf(info);
            const hkdfParams = {
                name: "HKDF",
                salt: saltBuf,
                info: infoBuf,
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey("raw", ikm, { name: "HKDF" }, false, [
                "deriveBits",
            ]);
            const buffer = yield this.subtle.deriveBits(hkdfParams, impKey, outputByteSize * 8);
            return new Uint8Array(buffer);
        });
    }
    // ref: https://tools.ietf.org/html/rfc5869
    hkdfExpand(prk, info, outputByteSize, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashLen = algorithm === "sha256" ? 32 : 64;
            if (outputByteSize > 255 * hashLen) {
                throw new Error("outputByteSize is too large.");
            }
            const prkArr = new Uint8Array(prk);
            if (prkArr.length < hashLen) {
                throw new Error("prk is too small.");
            }
            const infoBuf = this.toBuf(info);
            const infoArr = new Uint8Array(infoBuf);
            let runningOkmLength = 0;
            let previousT = new Uint8Array(0);
            const n = Math.ceil(outputByteSize / hashLen);
            const okm = new Uint8Array(n * hashLen);
            for (let i = 0; i < n; i++) {
                const t = new Uint8Array(previousT.length + infoArr.length + 1);
                t.set(previousT);
                t.set(infoArr, previousT.length);
                t.set([i + 1], t.length - 1);
                previousT = new Uint8Array(yield this.hmac(t, prk, algorithm));
                okm.set(previousT, runningOkmLength);
                runningOkmLength += previousT.length;
                if (runningOkmLength >= outputByteSize) {
                    break;
                }
            }
            return okm.slice(0, outputByteSize);
        });
    }
    hash(value, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (algorithm === "md5") {
                const md = forge.md.md5.create();
                const valueBytes = this.toByteString(value);
                md.update(valueBytes, "raw");
                return utils_1.Utils.fromByteStringToArray(md.digest().data);
            }
            const valueBuf = this.toBuf(value);
            const buffer = yield this.subtle.digest({ name: this.toWebCryptoAlgorithm(algorithm) }, valueBuf);
            return new Uint8Array(buffer);
        });
    }
    hmac(value, key, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            const signingAlgorithm = {
                name: "HMAC",
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey("raw", key, signingAlgorithm, false, ["sign"]);
            const buffer = yield this.subtle.sign(signingAlgorithm, impKey, value);
            return new Uint8Array(buffer);
        });
    }
    // Safely compare two values in a way that protects against timing attacks (Double HMAC Verification).
    // ref: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/
    // ref: https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy
    compare(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const macKey = yield this.randomBytes(32);
            const signingAlgorithm = {
                name: "HMAC",
                hash: { name: "SHA-256" },
            };
            const impKey = yield this.subtle.importKey("raw", macKey, signingAlgorithm, false, ["sign"]);
            const mac1 = yield this.subtle.sign(signingAlgorithm, impKey, a);
            const mac2 = yield this.subtle.sign(signingAlgorithm, impKey, b);
            if (mac1.byteLength !== mac2.byteLength) {
                return false;
            }
            const arr1 = new Uint8Array(mac1);
            const arr2 = new Uint8Array(mac2);
            for (let i = 0; i < arr2.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        });
    }
    hmacFast(value, key, algorithm) {
        const hmac = forge.hmac.create();
        hmac.start(algorithm, key);
        hmac.update(value);
        const bytes = hmac.digest().getBytes();
        return Promise.resolve(bytes);
    }
    compareFast(a, b) {
        return __awaiter(this, void 0, void 0, function* () {
            const rand = yield this.randomBytes(32);
            const bytes = new Uint32Array(rand);
            const buffer = forge.util.createBuffer();
            for (let i = 0; i < bytes.length; i++) {
                buffer.putInt32(bytes[i]);
            }
            const macKey = buffer.getBytes();
            const hmac = forge.hmac.create();
            hmac.start("sha256", macKey);
            hmac.update(a);
            const mac1 = hmac.digest().getBytes();
            hmac.start(null, null);
            hmac.update(b);
            const mac2 = hmac.digest().getBytes();
            const equals = mac1 === mac2;
            return equals;
        });
    }
    aesEncrypt(data, iv, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const impKey = yield this.subtle.importKey("raw", key, { name: "AES-CBC" }, false, [
                "encrypt",
            ]);
            const buffer = yield this.subtle.encrypt({ name: "AES-CBC", iv: iv }, impKey, data);
            return new Uint8Array(buffer);
        });
    }
    aesDecryptFastParameters(data, iv, mac, key) {
        const p = new decrypt_parameters_1.DecryptParameters();
        if (key.meta != null) {
            p.encKey = key.meta.encKeyByteString;
            p.macKey = key.meta.macKeyByteString;
        }
        if (p.encKey == null) {
            p.encKey = forge.util.decode64(key.encKeyB64);
        }
        p.data = forge.util.decode64(data);
        p.iv = forge.util.decode64(iv);
        p.macData = p.iv + p.data;
        if (p.macKey == null && key.macKeyB64 != null) {
            p.macKey = forge.util.decode64(key.macKeyB64);
        }
        if (mac != null) {
            p.mac = forge.util.decode64(mac);
        }
        // cache byte string keys for later
        if (key.meta == null) {
            key.meta = {};
        }
        if (key.meta.encKeyByteString == null) {
            key.meta.encKeyByteString = p.encKey;
        }
        if (p.macKey != null && key.meta.macKeyByteString == null) {
            key.meta.macKeyByteString = p.macKey;
        }
        return p;
    }
    aesDecryptFast(parameters, mode) {
        const decipher = forge.cipher.createDecipher(this.toWebCryptoAesMode(mode), parameters.encKey);
        const options = {};
        if (mode === "cbc") {
            options.iv = parameters.iv;
        }
        const dataBuffer = forge.util.createBuffer(parameters.data);
        decipher.start(options);
        decipher.update(dataBuffer);
        decipher.finish();
        const val = decipher.output.toString();
        return Promise.resolve(val);
    }
    aesDecrypt(data, iv, key, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mode === "ecb") {
                // Web crypto does not support AES-ECB mode, so we need to do this in forge.
                const params = new decrypt_parameters_1.DecryptParameters();
                params.data = this.toByteString(data);
                params.encKey = this.toByteString(key);
                const result = yield this.aesDecryptFast(params, "ecb");
                return utils_1.Utils.fromByteStringToArray(result);
            }
            const impKey = yield this.subtle.importKey("raw", key, { name: "AES-CBC" }, false, [
                "decrypt",
            ]);
            const buffer = yield this.subtle.decrypt({ name: "AES-CBC", iv: iv }, impKey, data);
            return new Uint8Array(buffer);
        });
    }
    rsaEncrypt(data, publicKey, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: Edge browser requires that we specify name and hash for both key import and decrypt.
            // We cannot use the proper types here.
            const rsaParams = {
                name: "RSA-OAEP",
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey("spki", publicKey, rsaParams, false, ["encrypt"]);
            const buffer = yield this.subtle.encrypt(rsaParams, impKey, data);
            return new Uint8Array(buffer);
        });
    }
    rsaDecrypt(data, privateKey, algorithm) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note: Edge browser requires that we specify name and hash for both key import and decrypt.
            // We cannot use the proper types here.
            const rsaParams = {
                name: "RSA-OAEP",
                hash: { name: this.toWebCryptoAlgorithm(algorithm) },
            };
            const impKey = yield this.subtle.importKey("pkcs8", privateKey, rsaParams, false, ["decrypt"]);
            const buffer = yield this.subtle.decrypt(rsaParams, impKey, data);
            return new Uint8Array(buffer);
        });
    }
    rsaExtractPublicKey(privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const rsaParams = {
                name: "RSA-OAEP",
                // Have to specify some algorithm
                hash: { name: this.toWebCryptoAlgorithm("sha1") },
            };
            const impPrivateKey = yield this.subtle.importKey("pkcs8", privateKey, rsaParams, true, [
                "decrypt",
            ]);
            const jwkPrivateKey = yield this.subtle.exportKey("jwk", impPrivateKey);
            const jwkPublicKeyParams = {
                kty: "RSA",
                e: jwkPrivateKey.e,
                n: jwkPrivateKey.n,
                alg: "RSA-OAEP",
                ext: true,
            };
            const impPublicKey = yield this.subtle.importKey("jwk", jwkPublicKeyParams, rsaParams, true, [
                "encrypt",
            ]);
            const buffer = yield this.subtle.exportKey("spki", impPublicKey);
            return new Uint8Array(buffer);
        });
    }
    aesGenerateKey() {
        return __awaiter(this, arguments, void 0, function* (bitLength = 128 | 192 | 256 | 512) {
            if (bitLength === 512) {
                // 512 bit keys are not supported in WebCrypto, so we concat two 256 bit keys
                const key1 = yield this.aesGenerateKey(256);
                const key2 = yield this.aesGenerateKey(256);
                return new Uint8Array([...key1, ...key2]);
            }
            const aesParams = {
                name: "AES-CBC",
                length: bitLength,
            };
            const key = yield this.subtle.generateKey(aesParams, true, ["encrypt", "decrypt"]);
            const rawKey = yield this.subtle.exportKey("raw", key);
            return new Uint8Array(rawKey);
        });
    }
    rsaGenerateKeyPair(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const rsaParams = {
                name: "RSA-OAEP",
                modulusLength: length,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                // Have to specify some algorithm
                hash: { name: this.toWebCryptoAlgorithm("sha1") },
            };
            const keyPair = yield this.subtle.generateKey(rsaParams, true, ["encrypt", "decrypt"]);
            const publicKey = yield this.subtle.exportKey("spki", keyPair.publicKey);
            const privateKey = yield this.subtle.exportKey("pkcs8", keyPair.privateKey);
            return [new Uint8Array(publicKey), new Uint8Array(privateKey)];
        });
    }
    randomBytes(length) {
        const arr = new Uint8Array(length);
        this.crypto.getRandomValues(arr);
        return Promise.resolve(arr);
    }
    toBuf(value) {
        let buf;
        if (typeof value === "string") {
            buf = utils_1.Utils.fromUtf8ToArray(value);
        }
        else {
            buf = value;
        }
        return buf;
    }
    toByteString(value) {
        let bytes;
        if (typeof value === "string") {
            bytes = forge.util.encodeUtf8(value);
        }
        else {
            bytes = utils_1.Utils.fromBufferToByteString(value);
        }
        return bytes;
    }
    toWebCryptoAlgorithm(algorithm) {
        if (algorithm === "md5") {
            throw new Error("MD5 is not supported in WebCrypto.");
        }
        return algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : "SHA-512";
    }
    toWebCryptoAesMode(mode) {
        return mode === "cbc" ? "AES-CBC" : "AES-ECB";
    }
    // ref: https://stackoverflow.com/a/47880734/1090359
    checkIfWasmSupported() {
        try {
            if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
                const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                if (module instanceof WebAssembly.Module) {
                    return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
                }
            }
        }
        catch (_a) {
            return false;
        }
        return false;
    }
}
exports.WebCryptoFunctionService = WebCryptoFunctionService;
//# sourceMappingURL=web-crypto-function.service.js.map