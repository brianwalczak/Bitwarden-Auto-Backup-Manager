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
exports.GENERATOR_HISTORY_BUFFER = exports.GENERATOR_HISTORY = exports.SIMPLE_LOGIN_BUFFER = exports.FORWARD_EMAIL_BUFFER = exports.FIREFOX_RELAY_BUFFER = exports.FASTMAIL_BUFFER = exports.DUCK_DUCK_GO_BUFFER = exports.ADDY_IO_BUFFER = exports.SIMPLE_LOGIN_FORWARDER = exports.FORWARD_EMAIL_FORWARDER = exports.FIREFOX_RELAY_FORWARDER = exports.FASTMAIL_FORWARDER = exports.DUCK_DUCK_GO_FORWARDER = exports.ADDY_IO_FORWARDER = exports.SUBADDRESS_SETTINGS = exports.CATCHALL_SETTINGS = exports.EFF_USERNAME_SETTINGS = exports.PASSPHRASE_SETTINGS = exports.PASSWORD_SETTINGS = exports.GENERATOR_SETTINGS = void 0;
const state_1 = require("../../platform/state");
const buffered_key_definition_1 = require("../state/buffered-key-definition");
const secret_classifier_1 = require("../state/secret-classifier");
const secret_key_definition_1 = require("../state/secret-key-definition");
const generated_credential_1 = require("./history/generated-credential");
const generated_password_history_1 = require("./password/generated-password-history");
/** plaintext password generation options */
exports.GENERATOR_SETTINGS = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "generatorSettings", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** plaintext password generation options */
exports.PASSWORD_SETTINGS = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "passwordGeneratorSettings", {
    deserializer: (value) => value,
    clearOn: [],
});
/** plaintext passphrase generation options */
exports.PASSPHRASE_SETTINGS = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "passphraseGeneratorSettings", {
    deserializer: (value) => value,
    clearOn: [],
});
/** plaintext username generation options */
exports.EFF_USERNAME_SETTINGS = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "effUsernameGeneratorSettings", {
    deserializer: (value) => value,
    clearOn: [],
});
/** plaintext configuration for a domain catch-all address. */
exports.CATCHALL_SETTINGS = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "catchallGeneratorSettings", {
    deserializer: (value) => value,
    clearOn: [],
});
/** plaintext configuration for an email subaddress. */
exports.SUBADDRESS_SETTINGS = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "subaddressGeneratorSettings", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link Forwarders.AddyIo} */
exports.ADDY_IO_FORWARDER = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "addyIoForwarder", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link Forwarders.DuckDuckGo} */
exports.DUCK_DUCK_GO_FORWARDER = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "duckDuckGoForwarder", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link Forwarders.FastMail} */
exports.FASTMAIL_FORWARDER = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "fastmailForwarder", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link Forwarders.FireFoxRelay} */
exports.FIREFOX_RELAY_FORWARDER = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "firefoxRelayForwarder", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link Forwarders.ForwardEmail} */
exports.FORWARD_EMAIL_FORWARDER = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "forwardEmailForwarder", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link forwarders.SimpleLogin} */
exports.SIMPLE_LOGIN_FORWARDER = new state_1.UserKeyDefinition(state_1.GENERATOR_DISK, "simpleLoginForwarder", {
    deserializer: (value) => value,
    clearOn: [],
});
/** backing store configuration for {@link Forwarders.AddyIo} */
exports.ADDY_IO_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "addyIoBuffer", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** backing store configuration for {@link Forwarders.DuckDuckGo} */
exports.DUCK_DUCK_GO_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "duckDuckGoBuffer", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** backing store configuration for {@link Forwarders.FastMail} */
exports.FASTMAIL_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "fastmailBuffer", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** backing store configuration for {@link Forwarders.FireFoxRelay} */
exports.FIREFOX_RELAY_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "firefoxRelayBuffer", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** backing store configuration for {@link Forwarders.ForwardEmail} */
exports.FORWARD_EMAIL_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "forwardEmailBuffer", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** backing store configuration for {@link forwarders.SimpleLogin} */
exports.SIMPLE_LOGIN_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "simpleLoginBuffer", {
    deserializer: (value) => value,
    clearOn: ["logout"],
});
/** encrypted password generation history */
exports.GENERATOR_HISTORY = secret_key_definition_1.SecretKeyDefinition.array(state_1.GENERATOR_DISK, "localGeneratorHistory", secret_classifier_1.SecretClassifier.allSecret(), {
    deserializer: generated_credential_1.GeneratedCredential.fromJSON,
    clearOn: ["logout"],
});
/** encrypted password generation history subject to migration */
exports.GENERATOR_HISTORY_BUFFER = new buffered_key_definition_1.BufferedKeyDefinition(state_1.GENERATOR_DISK, "localGeneratorHistoryBuffer", {
    deserializer(history) {
        const items = history;
        return items === null || items === void 0 ? void 0 : items.map((h) => new generated_password_history_1.GeneratedPasswordHistory(h.password, h.date));
    },
    isValid(history) {
        return __awaiter(this, void 0, void 0, function* () {
            return history.length ? true : false;
        });
    },
    map(history, decryptor) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield decryptor.decrypt(history);
            const mapped = credentials.map((c) => new generated_credential_1.GeneratedCredential(c.password, "password", c.date));
            return mapped;
        });
    },
    clearOn: ["logout"],
});
//# sourceMappingURL=key-definitions.js.map