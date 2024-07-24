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
exports.Fido2AuthenticatorService = exports.AAGUID = void 0;
const cipher_reprompt_type_1 = require("../../../vault/enums/cipher-reprompt-type");
const cipher_type_1 = require("../../../vault/enums/cipher-type");
const fido2_credential_view_1 = require("../../../vault/models/view/fido2-credential.view");
const fido2_authenticator_service_abstraction_1 = require("../../abstractions/fido2/fido2-authenticator.service.abstraction");
const utils_1 = require("../../misc/utils");
const cbor_1 = require("./cbor");
const ecdsa_utils_1 = require("./ecdsa-utils");
const fido2_utils_1 = require("./fido2-utils");
const guid_utils_1 = require("./guid-utils");
// AAGUID: d548826e-79b4-db40-a3d8-11116f7e8349
exports.AAGUID = new Uint8Array([
    0xd5, 0x48, 0x82, 0x6e, 0x79, 0xb4, 0xdb, 0x40, 0xa3, 0xd8, 0x11, 0x11, 0x6f, 0x7e, 0x83, 0x49,
]);
const KeyUsages = ["sign"];
/**
 * Bitwarden implementation of the WebAuthn Authenticator Model as described by W3C
 * https://www.w3.org/TR/webauthn-3/#sctn-authenticator-model
 *
 * It is highly recommended that the W3C specification is used a reference when reading this code.
 */
class Fido2AuthenticatorService {
    constructor(cipherService, userInterface, syncService, logService) {
        this.cipherService = cipherService;
        this.userInterface = userInterface;
        this.syncService = syncService;
        this.logService = logService;
    }
    makeCredential(params, tab, abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const userInterfaceSession = yield this.userInterface.newSession(params.fallbackSupported, tab, abortController);
            try {
                if (params.credTypesAndPubKeyAlgs.every((p) => p.alg !== fido2_authenticator_service_abstraction_1.Fido2AlgorithmIdentifier.ES256)) {
                    const requestedAlgorithms = params.credTypesAndPubKeyAlgs.map((p) => p.alg).join(", ");
                    (_a = this.logService) === null || _a === void 0 ? void 0 : _a.warning(`[Fido2Authenticator] No compatible algorithms found, RP requested: ${requestedAlgorithms}`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotSupported);
                }
                if (params.requireResidentKey != undefined &&
                    typeof params.requireResidentKey !== "boolean") {
                    (_b = this.logService) === null || _b === void 0 ? void 0 : _b.error(`[Fido2Authenticator] Invalid 'requireResidentKey' value: ${String(params.requireResidentKey)}`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.Unknown);
                }
                if (params.requireUserVerification != undefined &&
                    typeof params.requireUserVerification !== "boolean") {
                    (_c = this.logService) === null || _c === void 0 ? void 0 : _c.error(`[Fido2Authenticator] Invalid 'requireUserVerification' value: ${String(params.requireUserVerification)}`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.Unknown);
                }
                yield userInterfaceSession.ensureUnlockedVault();
                yield this.syncService.fullSync(false);
                const existingCipherIds = yield this.findExcludedCredentials(params.excludeCredentialDescriptorList);
                if (existingCipherIds.length > 0) {
                    (_d = this.logService) === null || _d === void 0 ? void 0 : _d.info(`[Fido2Authenticator] Aborting due to excluded credential found in vault.`);
                    yield userInterfaceSession.informExcludedCredential(existingCipherIds);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotAllowed);
                }
                let cipher;
                let fido2Credential;
                let keyPair;
                let userVerified = false;
                let credentialId;
                let pubKeyDer;
                const response = yield userInterfaceSession.confirmNewCredential({
                    credentialName: params.rpEntity.name,
                    userName: params.userEntity.name,
                    userHandle: fido2_utils_1.Fido2Utils.bufferToString(params.userEntity.id),
                    userVerification: params.requireUserVerification,
                    rpId: params.rpEntity.id,
                });
                const cipherId = response.cipherId;
                userVerified = response.userVerified;
                if (cipherId === undefined) {
                    (_e = this.logService) === null || _e === void 0 ? void 0 : _e.warning(`[Fido2Authenticator] Aborting because user confirmation was not recieved.`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotAllowed);
                }
                try {
                    keyPair = yield createKeyPair();
                    pubKeyDer = yield crypto.subtle.exportKey("spki", keyPair.publicKey);
                    const encrypted = yield this.cipherService.get(cipherId);
                    cipher = yield encrypted.decrypt(yield this.cipherService.getKeyForCipherKeyDecryption(encrypted));
                    if (!userVerified &&
                        (params.requireUserVerification || cipher.reprompt !== cipher_reprompt_type_1.CipherRepromptType.None)) {
                        (_f = this.logService) === null || _f === void 0 ? void 0 : _f.warning(`[Fido2Authenticator] Aborting because user verification was unsuccessful.`);
                        throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotAllowed);
                    }
                    fido2Credential = yield createKeyView(params, keyPair.privateKey);
                    cipher.login.fido2Credentials = [fido2Credential];
                    // update username if username is missing
                    if (utils_1.Utils.isNullOrEmpty(cipher.login.username)) {
                        cipher.login.username = fido2Credential.userName;
                    }
                    const reencrypted = yield this.cipherService.encrypt(cipher);
                    yield this.cipherService.updateWithServer(reencrypted);
                    credentialId = fido2Credential.credentialId;
                }
                catch (error) {
                    (_g = this.logService) === null || _g === void 0 ? void 0 : _g.error(`[Fido2Authenticator] Aborting because of unknown error when creating credential: ${error}`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.Unknown);
                }
                const authData = yield generateAuthData({
                    rpId: params.rpEntity.id,
                    credentialId: (0, guid_utils_1.guidToRawFormat)(credentialId),
                    counter: fido2Credential.counter,
                    userPresence: true,
                    userVerification: userVerified,
                    keyPair,
                });
                const attestationObject = new Uint8Array(cbor_1.CBOR.encode({
                    fmt: "none",
                    attStmt: {},
                    authData,
                }));
                return {
                    credentialId: (0, guid_utils_1.guidToRawFormat)(credentialId),
                    attestationObject,
                    authData,
                    publicKey: pubKeyDer,
                    publicKeyAlgorithm: -7,
                };
            }
            finally {
                userInterfaceSession.close();
            }
        });
    }
    getAssertion(params, tab, abortController) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const userInterfaceSession = yield this.userInterface.newSession(params.fallbackSupported, tab, abortController);
            try {
                if (params.requireUserVerification != undefined &&
                    typeof params.requireUserVerification !== "boolean") {
                    (_a = this.logService) === null || _a === void 0 ? void 0 : _a.error(`[Fido2Authenticator] Invalid 'requireUserVerification' value: ${String(params.requireUserVerification)}`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.Unknown);
                }
                let cipherOptions;
                yield userInterfaceSession.ensureUnlockedVault();
                yield this.syncService.fullSync(false);
                if (((_b = params.allowCredentialDescriptorList) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    cipherOptions = yield this.findCredentialsById(params.allowCredentialDescriptorList, params.rpId);
                }
                else {
                    cipherOptions = yield this.findCredentialsByRp(params.rpId);
                }
                if (cipherOptions.length === 0) {
                    (_c = this.logService) === null || _c === void 0 ? void 0 : _c.info(`[Fido2Authenticator] Aborting because no matching credentials were found in the vault.`);
                    yield userInterfaceSession.informCredentialNotFound();
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotAllowed);
                }
                const response = yield userInterfaceSession.pickCredential({
                    cipherIds: cipherOptions.map((cipher) => cipher.id),
                    userVerification: params.requireUserVerification,
                });
                const selectedCipherId = response.cipherId;
                const userVerified = response.userVerified;
                const selectedCipher = cipherOptions.find((c) => c.id === selectedCipherId);
                if (selectedCipher === undefined) {
                    (_d = this.logService) === null || _d === void 0 ? void 0 : _d.error(`[Fido2Authenticator] Aborting because the selected credential could not be found.`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotAllowed);
                }
                if (!userVerified &&
                    (params.requireUserVerification || selectedCipher.reprompt !== cipher_reprompt_type_1.CipherRepromptType.None)) {
                    (_e = this.logService) === null || _e === void 0 ? void 0 : _e.warning(`[Fido2Authenticator] Aborting because user verification was unsuccessful.`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.NotAllowed);
                }
                try {
                    const selectedFido2Credential = selectedCipher.login.fido2Credentials[0];
                    const selectedCredentialId = selectedFido2Credential.credentialId;
                    if (selectedFido2Credential.counter > 0) {
                        ++selectedFido2Credential.counter;
                    }
                    selectedCipher.localData = Object.assign(Object.assign({}, selectedCipher.localData), { lastUsedDate: new Date().getTime() });
                    if (selectedFido2Credential.counter > 0) {
                        const encrypted = yield this.cipherService.encrypt(selectedCipher);
                        yield this.cipherService.updateWithServer(encrypted);
                    }
                    const authenticatorData = yield generateAuthData({
                        rpId: selectedFido2Credential.rpId,
                        credentialId: (0, guid_utils_1.guidToRawFormat)(selectedCredentialId),
                        counter: selectedFido2Credential.counter,
                        userPresence: true,
                        userVerification: userVerified,
                    });
                    const signature = yield generateSignature({
                        authData: authenticatorData,
                        clientDataHash: params.hash,
                        privateKey: yield getPrivateKeyFromFido2Credential(selectedFido2Credential),
                    });
                    return {
                        authenticatorData,
                        selectedCredential: {
                            id: (0, guid_utils_1.guidToRawFormat)(selectedCredentialId),
                            userHandle: fido2_utils_1.Fido2Utils.stringToBuffer(selectedFido2Credential.userHandle),
                        },
                        signature,
                    };
                }
                catch (error) {
                    (_f = this.logService) === null || _f === void 0 ? void 0 : _f.error(`[Fido2Authenticator] Aborting because of unknown error when asserting credential: ${error}`);
                    throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.Unknown);
                }
            }
            finally {
                userInterfaceSession.close();
            }
        });
    }
    /** Finds existing crendetials and returns the `cipherId` for each one */
    findExcludedCredentials(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = [];
            for (const credential of credentials) {
                try {
                    ids.push((0, guid_utils_1.guidToStandardFormat)(credential.id));
                    // eslint-disable-next-line no-empty
                }
                catch (_a) { }
            }
            if (ids.length === 0) {
                return [];
            }
            const ciphers = yield this.cipherService.getAllDecrypted();
            return ciphers
                .filter((cipher) => !cipher.isDeleted &&
                cipher.organizationId == undefined &&
                cipher.type === cipher_type_1.CipherType.Login &&
                cipher.login.hasFido2Credentials &&
                ids.includes(cipher.login.fido2Credentials[0].credentialId))
                .map((cipher) => cipher.id);
        });
    }
    findCredentialsById(credentials, rpId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = [];
            for (const credential of credentials) {
                try {
                    ids.push((0, guid_utils_1.guidToStandardFormat)(credential.id));
                    // eslint-disable-next-line no-empty
                }
                catch (_a) { }
            }
            if (ids.length === 0) {
                return [];
            }
            const ciphers = yield this.cipherService.getAllDecrypted();
            return ciphers.filter((cipher) => !cipher.isDeleted &&
                cipher.type === cipher_type_1.CipherType.Login &&
                cipher.login.hasFido2Credentials &&
                cipher.login.fido2Credentials[0].rpId === rpId &&
                ids.includes(cipher.login.fido2Credentials[0].credentialId));
        });
    }
    findCredentialsByRp(rpId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield this.cipherService.getAllDecrypted();
            return ciphers.filter((cipher) => !cipher.isDeleted &&
                cipher.type === cipher_type_1.CipherType.Login &&
                cipher.login.hasFido2Credentials &&
                cipher.login.fido2Credentials[0].rpId === rpId &&
                cipher.login.fido2Credentials[0].discoverable);
        });
    }
}
exports.Fido2AuthenticatorService = Fido2AuthenticatorService;
function createKeyPair() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield crypto.subtle.generateKey({
            name: "ECDSA",
            namedCurve: "P-256",
        }, true, KeyUsages);
    });
}
function createKeyView(params, keyValue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (keyValue.algorithm.name !== "ECDSA" && keyValue.algorithm.namedCurve !== "P-256") {
            throw new fido2_authenticator_service_abstraction_1.Fido2AuthenticatorError(fido2_authenticator_service_abstraction_1.Fido2AuthenticatorErrorCode.Unknown);
        }
        const pkcs8Key = yield crypto.subtle.exportKey("pkcs8", keyValue);
        const fido2Credential = new fido2_credential_view_1.Fido2CredentialView();
        fido2Credential.credentialId = utils_1.Utils.newGuid();
        fido2Credential.keyType = "public-key";
        fido2Credential.keyAlgorithm = "ECDSA";
        fido2Credential.keyCurve = "P-256";
        fido2Credential.keyValue = fido2_utils_1.Fido2Utils.bufferToString(pkcs8Key);
        fido2Credential.rpId = params.rpEntity.id;
        fido2Credential.userHandle = fido2_utils_1.Fido2Utils.bufferToString(params.userEntity.id);
        fido2Credential.userName = params.userEntity.name;
        fido2Credential.counter = 0;
        fido2Credential.rpName = params.rpEntity.name;
        fido2Credential.userDisplayName = params.userEntity.displayName;
        fido2Credential.discoverable = params.requireResidentKey;
        fido2Credential.creationDate = new Date();
        return fido2Credential;
    });
}
function getPrivateKeyFromFido2Credential(fido2Credential) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyBuffer = fido2_utils_1.Fido2Utils.stringToBuffer(fido2Credential.keyValue);
        return yield crypto.subtle.importKey("pkcs8", keyBuffer, {
            name: fido2Credential.keyAlgorithm,
            namedCurve: fido2Credential.keyCurve,
        }, true, KeyUsages);
    });
}
function generateAuthData(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const authData = [];
        const rpIdHash = new Uint8Array(yield crypto.subtle.digest({ name: "SHA-256" }, utils_1.Utils.fromByteStringToArray(params.rpId)));
        authData.push(...rpIdHash);
        const flags = authDataFlags({
            extensionData: false,
            attestationData: params.keyPair != undefined,
            backupEligibility: true,
            backupState: true, // Credentials are always synced
            userVerification: params.userVerification,
            userPresence: params.userPresence,
        });
        authData.push(flags);
        // add 4 bytes of counter - we use time in epoch seconds as monotonic counter
        // TODO: Consider changing this to a cryptographically safe random number
        const counter = params.counter;
        authData.push(((counter & 0xff000000) >> 24) & 0xff, ((counter & 0x00ff0000) >> 16) & 0xff, ((counter & 0x0000ff00) >> 8) & 0xff, counter & 0x000000ff);
        if (params.keyPair) {
            // attestedCredentialData
            const attestedCredentialData = [];
            attestedCredentialData.push(...exports.AAGUID);
            // credentialIdLength (2 bytes) and credential Id
            const rawId = fido2_utils_1.Fido2Utils.bufferSourceToUint8Array(params.credentialId);
            const credentialIdLength = [(rawId.length - (rawId.length & 0xff)) / 256, rawId.length & 0xff];
            attestedCredentialData.push(...credentialIdLength);
            attestedCredentialData.push(...rawId);
            const publicKeyJwk = yield crypto.subtle.exportKey("jwk", params.keyPair.publicKey);
            // COSE format of the EC256 key
            const keyX = utils_1.Utils.fromUrlB64ToArray(publicKeyJwk.x);
            const keyY = utils_1.Utils.fromUrlB64ToArray(publicKeyJwk.y);
            // Can't get `cbor-redux` to encode in CTAP2 canonical CBOR. So we do it manually:
            const coseBytes = new Uint8Array(77);
            coseBytes.set([0xa5, 0x01, 0x02, 0x03, 0x26, 0x20, 0x01, 0x21, 0x58, 0x20], 0);
            coseBytes.set(keyX, 10);
            coseBytes.set([0x22, 0x58, 0x20], 10 + 32);
            coseBytes.set(keyY, 10 + 32 + 3);
            // credential public key - convert to array from CBOR encoded COSE key
            attestedCredentialData.push(...coseBytes);
            authData.push(...attestedCredentialData);
        }
        return new Uint8Array(authData);
    });
}
function generateSignature(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const sigBase = new Uint8Array([
            ...params.authData,
            ...fido2_utils_1.Fido2Utils.bufferSourceToUint8Array(params.clientDataHash),
        ]);
        const p1363_signature = new Uint8Array(yield crypto.subtle.sign({
            name: "ECDSA",
            hash: { name: "SHA-256" },
        }, params.privateKey, sigBase));
        const asn1Der_signature = (0, ecdsa_utils_1.p1363ToDer)(p1363_signature);
        return asn1Der_signature;
    });
}
function authDataFlags(options) {
    let flags = 0;
    if (options.extensionData) {
        flags |= 0b1000000;
    }
    if (options.attestationData) {
        flags |= 0b01000000;
    }
    if (options.backupEligibility) {
        flags |= 0b00001000;
    }
    if (options.backupState) {
        flags |= 0b00010000;
    }
    if (options.userVerification) {
        flags |= 0b00000100;
    }
    if (options.userPresence) {
        flags |= 0b00000001;
    }
    return flags;
}
//# sourceMappingURL=fido2-authenticator.service.js.map