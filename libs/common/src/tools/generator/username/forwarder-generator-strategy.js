"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForwarderGeneratorStrategy = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("../../../admin-console/enums");
const buffered_state_1 = require("../../state/buffered-state");
const padded_data_packer_1 = require("../../state/padded-data-packer");
const secret_classifier_1 = require("../../state/secret-classifier");
const secret_key_definition_1 = require("../../state/secret-key-definition");
const secret_state_1 = require("../../state/secret-state");
const user_key_encryptor_1 = require("../../state/user-key-encryptor");
const abstractions_1 = require("../abstractions");
const rx_operators_1 = require("../rx-operators");
const util_1 = require("../util");
const OPTIONS_FRAME_SIZE = 512;
/** An email forwarding service configurable through an API. */
class ForwarderGeneratorStrategy extends abstractions_1.GeneratorStrategy {
    /** Initializes the generator strategy
     *  @param encryptService protects sensitive forwarder options
     *  @param keyService looks up the user key when protecting data.
     *  @param stateProvider creates the durable state for options storage
     */
    constructor(encryptService, keyService, stateProvider, defaultOptions) {
        super();
        this.encryptService = encryptService;
        this.keyService = keyService;
        this.stateProvider = stateProvider;
        this.defaultOptions = defaultOptions;
        // configuration
        this.policy = enums_1.PolicyType.PasswordGenerator;
        this.defaults$ = (0, util_1.clone$PerUserId)(this.defaultOptions);
        this.toEvaluator = (0, rx_operators_1.newDefaultEvaluator)();
        this.durableState = (0, util_1.sharedByUserId)((userId) => this.getUserSecrets(userId));
    }
    // per-user encrypted state
    getUserSecrets(userId) {
        // construct the encryptor
        const packer = new padded_data_packer_1.PaddedDataPacker(OPTIONS_FRAME_SIZE);
        const encryptor = new user_key_encryptor_1.UserKeyEncryptor(this.encryptService, this.keyService, packer);
        // always exclude request properties
        const classifier = secret_classifier_1.SecretClassifier.allSecret().exclude("website");
        // Derive the secret key definition
        const key = secret_key_definition_1.SecretKeyDefinition.value(this.key.stateDefinition, this.key.key, classifier, {
            deserializer: (d) => this.key.deserializer(d),
            cleanupDelayMs: this.key.cleanupDelayMs,
            clearOn: this.key.clearOn,
        });
        // the type parameter is explicit because type inference fails for `Omit<Options, "website">`
        const secretState = secret_state_1.SecretState.from(userId, key, this.stateProvider, encryptor);
        // rollover should occur once the user key is available for decryption
        const canDecrypt$ = this.keyService
            .getInMemoryUserKeyFor$(userId)
            .pipe((0, rxjs_1.map)((key) => key !== null));
        const rolloverState = new buffered_state_1.BufferedState(this.stateProvider, this.rolloverKey, secretState, canDecrypt$);
        return rolloverState;
    }
}
exports.ForwarderGeneratorStrategy = ForwarderGeneratorStrategy;
//# sourceMappingURL=forwarder-generator-strategy.js.map