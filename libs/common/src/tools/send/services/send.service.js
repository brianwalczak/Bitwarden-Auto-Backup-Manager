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
exports.SendService = void 0;
const rxjs_1 = require("rxjs");
const kdf_config_1 = require("../../../auth/models/domain/kdf-config");
const utils_1 = require("../../../platform/misc/utils");
const send_type_1 = require("../enums/send-type");
const send_data_1 = require("../models/data/send.data");
const send_1 = require("../models/domain/send");
const send_file_1 = require("../models/domain/send-file");
const send_text_1 = require("../models/domain/send-text");
const send_with_id_request_1 = require("../models/request/send-with-id.request");
const send_kdf_1 = require("../send-kdf");
class SendService {
    constructor(cryptoService, i18nService, keyGenerationService, stateProvider, encryptService) {
        this.cryptoService = cryptoService;
        this.i18nService = i18nService;
        this.keyGenerationService = keyGenerationService;
        this.stateProvider = stateProvider;
        this.encryptService = encryptService;
        this.sendKeySalt = "bitwarden-send";
        this.sendKeyPurpose = "send";
        this.sends$ = this.stateProvider.encryptedState$.pipe((0, rxjs_1.map)((record) => Object.values(record || {}).map((data) => new send_1.Send(data))));
        this.sendViews$ = this.stateProvider.encryptedState$.pipe((0, rxjs_1.concatMap)((record) => this.decryptSends(Object.values(record || {}).map((data) => new send_1.Send(data)))));
    }
    encrypt(model, file, password, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileData = null;
            const send = new send_1.Send();
            send.id = model.id;
            send.type = model.type;
            send.disabled = model.disabled;
            send.hideEmail = model.hideEmail;
            send.maxAccessCount = model.maxAccessCount;
            if (model.key == null) {
                const key = yield this.keyGenerationService.createKeyWithPurpose(128, this.sendKeyPurpose, this.sendKeySalt);
                model.key = key.material;
                model.cryptoKey = key.derivedKey;
            }
            if (password != null) {
                const passwordKey = yield this.keyGenerationService.deriveKeyFromPassword(password, model.key, new kdf_config_1.PBKDF2KdfConfig(send_kdf_1.SEND_KDF_ITERATIONS));
                send.password = passwordKey.keyB64;
            }
            if (key == null) {
                key = yield this.cryptoService.getUserKey();
            }
            send.key = yield this.encryptService.encrypt(model.key, key);
            send.name = yield this.encryptService.encrypt(model.name, model.cryptoKey);
            send.notes = yield this.encryptService.encrypt(model.notes, model.cryptoKey);
            if (send.type === send_type_1.SendType.Text) {
                send.text = new send_text_1.SendText();
                send.text.text = yield this.encryptService.encrypt(model.text.text, model.cryptoKey);
                send.text.hidden = model.text.hidden;
            }
            else if (send.type === send_type_1.SendType.File) {
                send.file = new send_file_1.SendFile();
                if (file != null) {
                    if (file instanceof ArrayBuffer) {
                        const [name, data] = yield this.encryptFileData(model.file.fileName, file, model.cryptoKey);
                        send.file.fileName = name;
                        fileData = data;
                    }
                    else {
                        fileData = yield this.parseFile(send, file, model.cryptoKey);
                    }
                }
            }
            return [send, fileData];
        });
    }
    get$(id) {
        return this.sends$.pipe((0, rxjs_1.distinctUntilChanged)((oldSends, newSends) => {
            const oldSend = oldSends.find((oldSend) => oldSend.id === id);
            const newSend = newSends.find((newSend) => newSend.id === id);
            if (!oldSend || !newSend) {
                // If either oldSend or newSend is not found, consider them different
                return false;
            }
            // Compare each property of the old and new Send objects
            const allPropertiesSame = Object.keys(newSend).every((key) => {
                if ((oldSend[key] != null && newSend[key] === null) ||
                    (oldSend[key] === null && newSend[key] != null)) {
                    // If a key from either old or new send is not found, and the key from the other send has a value, consider them different
                    return false;
                }
                switch (key) {
                    case "name":
                    case "notes":
                    case "key":
                        if (oldSend[key] === null && newSend[key] === null) {
                            return true;
                        }
                        return oldSend[key].encryptedString === newSend[key].encryptedString;
                    case "text":
                        if (oldSend[key].text == null && newSend[key].text == null) {
                            return true;
                        }
                        if ((oldSend[key].text != null && newSend[key].text == null) ||
                            (oldSend[key].text == null && newSend[key].text != null)) {
                            return false;
                        }
                        return oldSend[key].text.encryptedString === newSend[key].text.encryptedString;
                    case "file":
                        //Files are never updated so never will be changed.
                        return true;
                    case "revisionDate":
                    case "expirationDate":
                    case "deletionDate":
                        if (oldSend[key] === null && newSend[key] === null) {
                            return true;
                        }
                        return oldSend[key].getTime() === newSend[key].getTime();
                    default:
                        // For other properties, compare directly
                        return oldSend[key] === newSend[key];
                }
            });
            return allPropertiesSame;
        }), (0, rxjs_1.map)((sends) => sends.find((o) => o.id === id)));
    }
    getFromState(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sends = yield this.stateProvider.getEncryptedSends();
            // eslint-disable-next-line
            if (sends == null || !sends.hasOwnProperty(id)) {
                return null;
            }
            return new send_1.Send(sends[id]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const sends = yield this.stateProvider.getEncryptedSends();
            const response = [];
            for (const id in sends) {
                // eslint-disable-next-line
                if (sends.hasOwnProperty(id)) {
                    response.push(new send_1.Send(sends[id]));
                }
            }
            return response;
        });
    }
    getAllDecryptedFromState() {
        return __awaiter(this, void 0, void 0, function* () {
            let decSends = yield this.stateProvider.getDecryptedSends();
            if (decSends != null) {
                return decSends;
            }
            decSends = [];
            const hasKey = yield this.cryptoService.hasUserKey();
            if (!hasKey) {
                throw new Error("No user key found.");
            }
            const promises = [];
            const sends = yield this.getAll();
            sends.forEach((send) => {
                promises.push(send.decrypt().then((f) => decSends.push(f)));
            });
            yield Promise.all(promises);
            decSends.sort(utils_1.Utils.getSortFunction(this.i18nService, "name"));
            yield this.stateProvider.setDecryptedSends(decSends);
            return decSends;
        });
    }
    upsert(send) {
        return __awaiter(this, void 0, void 0, function* () {
            let sends = yield this.stateProvider.getEncryptedSends();
            if (sends == null) {
                sends = {};
            }
            if (send instanceof send_data_1.SendData) {
                const s = send;
                sends[s.id] = s;
            }
            else {
                send.forEach((s) => {
                    sends[s.id] = s;
                });
            }
            yield this.replace(sends);
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.setDecryptedSends(null);
            yield this.stateProvider.setEncryptedSends(null);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sends = yield this.stateProvider.getEncryptedSends();
            if (sends == null) {
                return;
            }
            if (typeof id === "string") {
                if (sends[id] == null) {
                    return;
                }
                delete sends[id];
            }
            else {
                id.forEach((i) => {
                    delete sends[i];
                });
            }
            yield this.replace(sends);
        });
    }
    replace(sends) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.setEncryptedSends(sends);
        });
    }
    getRotatedData(originalUserKey, newUserKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newUserKey == null) {
                throw new Error("New user key is required for rotation.");
            }
            if (originalUserKey == null) {
                throw new Error("Original user key is required for rotation.");
            }
            const req = yield (0, rxjs_1.firstValueFrom)(this.sends$.pipe((0, rxjs_1.concatMap)((sends) => __awaiter(this, void 0, void 0, function* () { return this.toRotatedKeyRequestMap(sends, originalUserKey, newUserKey); }))));
            // separate return for easier debugging
            return req;
        });
    }
    toRotatedKeyRequestMap(sends, originalUserKey, rotateUserKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield Promise.all(sends.map((send) => __awaiter(this, void 0, void 0, function* () {
                const sendKey = yield this.encryptService.decryptToBytes(send.key, originalUserKey);
                send.key = yield this.encryptService.encrypt(sendKey, rotateUserKey);
                return new send_with_id_request_1.SendWithIdRequest(send);
            })));
            return requests;
        });
    }
    parseFile(send, file, key) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (evt) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const [name, data] = yield this.encryptFileData(file.name, evt.target.result, key);
                    send.file.fileName = name;
                    resolve(data);
                }
                catch (e) {
                    reject(e);
                }
            });
            reader.onerror = () => {
                reject("Error reading file.");
            };
        });
    }
    encryptFileData(fileName, data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key == null) {
                key = yield this.cryptoService.getUserKey();
            }
            const encFileName = yield this.encryptService.encrypt(fileName, key);
            const encFileData = yield this.encryptService.encryptToBytes(new Uint8Array(data), key);
            return [encFileName, encFileData];
        });
    }
    decryptSends(sends) {
        return __awaiter(this, void 0, void 0, function* () {
            const decryptSendPromises = sends.map((s) => s.decrypt());
            const decryptedSends = yield Promise.all(decryptSendPromises);
            decryptedSends.sort(utils_1.Utils.getSortFunction(this.i18nService, "name"));
            return decryptedSends;
        });
    }
}
exports.SendService = SendService;
//# sourceMappingURL=send.service.js.map