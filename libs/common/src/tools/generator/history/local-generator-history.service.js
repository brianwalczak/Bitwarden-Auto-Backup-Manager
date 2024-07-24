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
exports.LocalGeneratorHistoryService = void 0;
const rxjs_1 = require("rxjs");
const buffered_state_1 = require("../../state/buffered-state");
const padded_data_packer_1 = require("../../state/padded-data-packer");
const secret_state_1 = require("../../state/secret-state");
const user_key_encryptor_1 = require("../../state/user-key-encryptor");
const generator_history_abstraction_1 = require("../abstractions/generator-history.abstraction");
const key_definitions_1 = require("../key-definitions");
const generated_credential_1 = require("./generated-credential");
const legacy_password_history_decryptor_1 = require("./legacy-password-history-decryptor");
const OPTIONS_FRAME_SIZE = 2048;
/** Tracks the history of password generations local to a device.
 *  {@link GeneratorHistoryService}
 */
class LocalGeneratorHistoryService extends generator_history_abstraction_1.GeneratorHistoryService {
    constructor(encryptService, keyService, stateProvider, options = { maxTotal: 100 }) {
        super();
        this.encryptService = encryptService;
        this.keyService = keyService;
        this.stateProvider = stateProvider;
        this.options = options;
        this._credentialStates = new Map();
        /** {@link GeneratorHistoryService.track} */
        this.track = (userId, credential, category, date) => __awaiter(this, void 0, void 0, function* () {
            const state = this.getCredentialState(userId);
            let result = null;
            yield state.update((credentials) => {
                credentials = credentials !== null && credentials !== void 0 ? credentials : [];
                // add the result
                result = new generated_credential_1.GeneratedCredential(credential, category, date !== null && date !== void 0 ? date : Date.now());
                credentials.unshift(result);
                // trim history
                const removeAt = Math.max(0, this.options.maxTotal);
                credentials.splice(removeAt, Infinity);
                return credentials;
            }, {
                shouldUpdate: (credentials) => { var _a; return !((_a = credentials === null || credentials === void 0 ? void 0 : credentials.some((f) => f.credential === credential)) !== null && _a !== void 0 ? _a : false); },
            });
            return result;
        });
        /** {@link GeneratorHistoryService.take} */
        this.take = (userId, credential) => __awaiter(this, void 0, void 0, function* () {
            const state = this.getCredentialState(userId);
            let credentialIndex;
            let result = null;
            yield state.update((credentials) => {
                credentials = credentials !== null && credentials !== void 0 ? credentials : [];
                [result] = credentials.splice(credentialIndex, 1);
                return credentials;
            }, {
                shouldUpdate: (credentials) => {
                    var _a;
                    credentialIndex = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.findIndex((f) => f.credential === credential)) !== null && _a !== void 0 ? _a : -1;
                    return credentialIndex >= 0;
                },
            });
            return result;
        });
        /** {@link GeneratorHistoryService.take} */
        this.clear = (userId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = this.getCredentialState(userId);
            const result = (_a = (yield state.update(() => null))) !== null && _a !== void 0 ? _a : [];
            return result;
        });
        /** {@link GeneratorHistoryService.credentials$} */
        this.credentials$ = (userId) => {
            return this.getCredentialState(userId).state$.pipe((0, rxjs_1.map)((credentials) => credentials !== null && credentials !== void 0 ? credentials : []));
        };
    }
    getCredentialState(userId) {
        let state = this._credentialStates.get(userId);
        if (!state) {
            state = this.createSecretState(userId);
            this._credentialStates.set(userId, state);
        }
        return state;
    }
    createSecretState(userId) {
        // construct the encryptor
        const packer = new padded_data_packer_1.PaddedDataPacker(OPTIONS_FRAME_SIZE);
        const encryptor = new user_key_encryptor_1.UserKeyEncryptor(this.encryptService, this.keyService, packer);
        // construct the durable state
        const state = secret_state_1.SecretState.from(userId, key_definitions_1.GENERATOR_HISTORY, this.stateProvider, encryptor);
        // decryptor is just an algorithm, but it can't run until the key is available;
        // providing it via an observable makes running it early impossible
        const decryptor = new legacy_password_history_decryptor_1.LegacyPasswordHistoryDecryptor(userId, this.keyService, this.encryptService);
        const decryptor$ = this.keyService
            .getInMemoryUserKeyFor$(userId)
            .pipe((0, rxjs_1.map)((key) => key && decryptor));
        // move data from the old password history once decryptor is available
        const buffer = new buffered_state_1.BufferedState(this.stateProvider, key_definitions_1.GENERATOR_HISTORY_BUFFER, state, decryptor$);
        return buffer;
    }
}
exports.LocalGeneratorHistoryService = LocalGeneratorHistoryService;
//# sourceMappingURL=local-generator-history.service.js.map