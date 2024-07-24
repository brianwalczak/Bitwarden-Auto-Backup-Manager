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
exports.UserKeyEncryptor = void 0;
const user_encryptor_abstraction_1 = require("./user-encryptor.abstraction");
/** A classification strategy that protects a type's secrets by encrypting them
 *  with a `UserKey`
 */
class UserKeyEncryptor extends user_encryptor_abstraction_1.UserEncryptor {
    /** Instantiates the encryptor
     *  @param encryptService protects properties of `Secret`.
     *  @param keyService looks up the user key when protecting data.
     *  @param dataPacker packs and unpacks data classified as secrets.
     */
    constructor(encryptService, keyService, dataPacker) {
        super();
        this.encryptService = encryptService;
        this.keyService = keyService;
        this.dataPacker = dataPacker;
    }
    /** {@link UserEncryptor.encrypt} */
    encrypt(secret, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assertHasValue("secret", secret);
            this.assertHasValue("userId", userId);
            let packed = this.dataPacker.pack(secret);
            // encrypt the data and drop the key
            let key = yield this.keyService.getUserKey(userId);
            const encrypted = yield this.encryptService.encrypt(packed, key);
            packed = null;
            key = null;
            return encrypted;
        });
    }
    /** {@link UserEncryptor.decrypt} */
    decrypt(secret, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assertHasValue("secret", secret);
            this.assertHasValue("userId", userId);
            // decrypt the data and drop the key
            let key = yield this.keyService.getUserKey(userId);
            let decrypted = yield this.encryptService.decryptToUtf8(secret, key);
            key = null;
            // reconstruct TFrom's data
            const unpacked = this.dataPacker.unpack(decrypted);
            decrypted = null;
            return unpacked;
        });
    }
    assertHasValue(name, value) {
        if (value === undefined || value === null) {
            throw new Error(`${name} cannot be null or undefined`);
        }
    }
}
exports.UserKeyEncryptor = UserKeyEncryptor;
//# sourceMappingURL=user-key-encryptor.js.map