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
exports.SecretState = void 0;
const rxjs_1 = require("rxjs");
const enc_string_1 = require("../../platform/models/domain/enc-string");
const ONE_MINUTE = 1000 * 60;
/** Stores account-specific secrets protected by a UserKeyEncryptor.
 *
 *  @remarks This state store changes the structure of `Plaintext` during
 *  storage, and requires user keys to operate. It is incompatible with sync,
 *  which expects the disk storage format to be identical to the sync format.
 *
 *  DO NOT USE THIS for synchronized data.
 */
class SecretState {
    // The constructor is private to avoid creating a circular dependency when
    // wiring the derived and secret states together.
    constructor(key, encryptor, userId, provider) {
        this.key = key;
        this.encryptor = encryptor;
        // construct the backing store
        this.encryptedState = provider.getUser(userId, key.toEncryptedStateKey());
        // cache plaintext
        this.combinedState$ = this.encryptedState.combinedState$.pipe((0, rxjs_1.concatMap)((_a) => __awaiter(this, [_a], void 0, function* ([userId, state]) { return [userId, yield this.declassifyAll(state)]; })), (0, rxjs_1.share)({
            connector: () => {
                return new rxjs_1.ReplaySubject(1);
            },
            resetOnRefCountZero: () => { var _a; return (0, rxjs_1.timer)((_a = key.options.cleanupDelayMs) !== null && _a !== void 0 ? _a : ONE_MINUTE); },
        }));
        this.state$ = this.combinedState$.pipe((0, rxjs_1.map)(([, state]) => state));
    }
    /** {@link SingleUserState.userId} */
    get userId() {
        return this.encryptedState.userId;
    }
    /** Creates a secret state bound to an account encryptor. The account must be unlocked
     *  when this method is called.
     *  @param userId: the user to which the secret state is bound.
     *  @param key Converts between a declassified secret and its formal type.
     *  @param provider constructs state objects.
     *  @param encryptor protects `Secret` data.
     *  @throws when `key.stateDefinition` is backed by memory storage.
     *  @remarks Secrets are written to a secret store as a named tuple. Data classification is
     *    determined by the encryptor's classifier. Secret-classification data is jsonified,
     *    encrypted, and stored in a `secret` property. Disclosed-classification data is stored
     *    in a `disclosed` property. Omitted-classification data is not stored.
     */
    static from(userId, key, provider, encryptor) {
        const secretState = new SecretState(key, encryptor, userId, provider);
        return secretState;
    }
    declassifyItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, secret, disclosed }) {
            const encrypted = enc_string_1.EncString.fromJSON(secret);
            const decrypted = yield this.encryptor.decrypt(encrypted, this.encryptedState.userId);
            const declassified = this.key.classifier.declassify(disclosed, decrypted);
            const result = [id, this.key.options.deserializer(declassified)];
            return result;
        });
    }
    declassifyAll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // fail fast if there's no value
            if (data === null || data === undefined) {
                return null;
            }
            // decrypt each item
            const decryptTasks = data.map((item) => __awaiter(this, void 0, void 0, function* () { return this.declassifyItem(item); }));
            // reconstruct expected type
            const results = yield Promise.all(decryptTasks);
            const result = this.key.reconstruct(results);
            return result;
        });
    }
    classifyItem(_a) {
        return __awaiter(this, arguments, void 0, function* ([id, item]) {
            const classified = this.key.classifier.classify(item);
            const encrypted = yield this.encryptor.encrypt(classified.secret, this.encryptedState.userId);
            // the deserializer in the plaintextState's `derive` configuration always runs, but
            // `encryptedState` is not guaranteed to serialize the data, so it's necessary to
            // round-trip `encrypted` proactively.
            const serialized = {
                id,
                secret: JSON.parse(JSON.stringify(encrypted)),
                disclosed: classified.disclosed,
            };
            return serialized;
        });
    }
    classifyAll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // fail fast if there's no value
            if (data === null || data === undefined) {
                return null;
            }
            // convert the object to a list format so that all encrypt and decrypt
            // operations are self-similar
            const desconstructed = this.key.deconstruct(data);
            // encrypt each value individually
            const classifyTasks = desconstructed.map((item) => __awaiter(this, void 0, void 0, function* () { return this.classifyItem(item); }));
            const classified = yield Promise.all(classifyTasks);
            return classified;
        });
    }
    /** Updates the secret stored by this state.
     *  @param configureState a callback that returns an updated decrypted
     *   secret state. The callback receives the state's present value as its
     *   first argument and the dependencies listed in `options.combinedLatestWith`
     *   as its second argument.
     *  @param options configures how the update is applied. See {@link StateUpdateOptions}.
     *  @returns a promise that resolves with the updated value read from the state.
     *   The round-trip encrypts, decrypts, and deserializes the data, producing a new
     *   object.
     *  @remarks `configureState` must return a JSON-serializable object.
     *   If there are properties of your class which are not JSON-serializable,
     *   they can be lost when the secret state updates its backing store.
     */
    update(configureState_1) {
        return __awaiter(this, arguments, void 0, function* (configureState, options = null) {
            var _a, _b;
            // read the backing store
            let latestClassified;
            let latestCombined;
            yield this.encryptedState.update((c) => c, {
                shouldUpdate: (latest, combined) => {
                    latestClassified = latest;
                    latestCombined = combined;
                    return false;
                },
                combineLatestWith: options === null || options === void 0 ? void 0 : options.combineLatestWith,
            });
            // exit early if there's no update to apply
            const latestDeclassified = yield this.declassifyAll(latestClassified);
            const shouldUpdate = (_b = (_a = options === null || options === void 0 ? void 0 : options.shouldUpdate) === null || _a === void 0 ? void 0 : _a.call(options, latestDeclassified, latestCombined)) !== null && _b !== void 0 ? _b : true;
            if (!shouldUpdate) {
                return latestDeclassified;
            }
            // apply the update
            const updatedDeclassified = configureState(latestDeclassified, latestCombined);
            const updatedClassified = yield this.classifyAll(updatedDeclassified);
            yield this.encryptedState.update(() => updatedClassified);
            return updatedDeclassified;
        });
    }
}
exports.SecretState = SecretState;
//# sourceMappingURL=secret-state.js.map