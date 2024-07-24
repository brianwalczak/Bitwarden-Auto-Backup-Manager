"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fido2Utils = void 0;
class Fido2Utils {
    static bufferToString(bufferSource) {
        let buffer;
        if (bufferSource instanceof ArrayBuffer || bufferSource.buffer === undefined) {
            buffer = new Uint8Array(bufferSource);
        }
        else {
            buffer = new Uint8Array(bufferSource.buffer);
        }
        return Fido2Utils.fromBufferToB64(buffer)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
    }
    static stringToBuffer(str) {
        return Fido2Utils.fromB64ToArray(Fido2Utils.fromUrlB64ToB64(str));
    }
    static bufferSourceToUint8Array(bufferSource) {
        if (Fido2Utils.isArrayBuffer(bufferSource)) {
            return new Uint8Array(bufferSource);
        }
        else {
            return new Uint8Array(bufferSource.buffer);
        }
    }
    /** Utility function to identify type of bufferSource. Necessary because of differences between runtimes */
    static isArrayBuffer(bufferSource) {
        return bufferSource instanceof ArrayBuffer || bufferSource.buffer === undefined;
    }
    static fromB64toUrlB64(b64Str) {
        return b64Str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    static fromBufferToB64(buffer) {
        if (buffer == null) {
            return null;
        }
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return globalThis.btoa(binary);
    }
    static fromB64ToArray(str) {
        if (str == null) {
            return null;
        }
        const binaryString = globalThis.atob(str);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    static fromUrlB64ToB64(urlB64Str) {
        let output = urlB64Str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += "==";
                break;
            case 3:
                output += "=";
                break;
            default:
                throw new Error("Illegal base64url string!");
        }
        return output;
    }
}
exports.Fido2Utils = Fido2Utils;
//# sourceMappingURL=fido2-utils.js.map