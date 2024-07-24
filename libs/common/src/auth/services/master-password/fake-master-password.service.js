"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeMasterPasswordService = void 0;
const jest_mock_extended_1 = require("jest-mock-extended");
const rxjs_1 = require("rxjs");
class FakeMasterPasswordService {
    constructor(initialMasterKey, initialMasterKeyHash) {
        this.mock = (0, jest_mock_extended_1.mock)();
        // eslint-disable-next-line rxjs/no-exposed-subjects -- test class
        this.masterKeySubject = new rxjs_1.ReplaySubject(1);
        // eslint-disable-next-line rxjs/no-exposed-subjects -- test class
        this.masterKeyHashSubject = new rxjs_1.ReplaySubject(1);
        // eslint-disable-next-line rxjs/no-exposed-subjects -- test class
        this.forceSetPasswordReasonSubject = new rxjs_1.ReplaySubject(1);
        this.masterKeySubject.next(initialMasterKey);
        this.masterKeyHashSubject.next(initialMasterKeyHash);
    }
    masterKey$(userId) {
        return this.masterKeySubject.asObservable();
    }
    setMasterKey(masterKey, userId) {
        return this.mock.setMasterKey(masterKey, userId);
    }
    clearMasterKey(userId) {
        return this.mock.clearMasterKey(userId);
    }
    masterKeyHash$(userId) {
        return this.masterKeyHashSubject.asObservable();
    }
    getMasterKeyEncryptedUserKey(userId) {
        return this.mock.getMasterKeyEncryptedUserKey(userId);
    }
    setMasterKeyEncryptedUserKey(encryptedKey, userId) {
        return this.mock.setMasterKeyEncryptedUserKey(encryptedKey, userId);
    }
    setMasterKeyHash(masterKeyHash, userId) {
        return this.mock.setMasterKeyHash(masterKeyHash, userId);
    }
    clearMasterKeyHash(userId) {
        return this.mock.clearMasterKeyHash(userId);
    }
    forceSetPasswordReason$(userId) {
        return this.forceSetPasswordReasonSubject.asObservable();
    }
    setForceSetPasswordReason(reason, userId) {
        return this.mock.setForceSetPasswordReason(reason, userId);
    }
    decryptUserKeyWithMasterKey(masterKey, userKey, userId) {
        return this.mock.decryptUserKeyWithMasterKey(masterKey, userKey, userId);
    }
}
exports.FakeMasterPasswordService = FakeMasterPasswordService;
//# sourceMappingURL=fake-master-password.service.js.map