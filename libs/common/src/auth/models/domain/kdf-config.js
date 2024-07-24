"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_KDF_CONFIG = exports.Argon2KdfConfig = exports.PBKDF2KdfConfig = void 0;
const kdf_type_enum_1 = require("../../../platform/enums/kdf-type.enum");
const range_with_default_1 = require("../../../platform/misc/range-with-default");
/**
 * Password-Based Key Derivation Function 2 (PBKDF2) KDF configuration.
 */
class PBKDF2KdfConfig {
    constructor(iterations) {
        this.kdfType = kdf_type_enum_1.KdfType.PBKDF2_SHA256;
        this.iterations = iterations !== null && iterations !== void 0 ? iterations : PBKDF2KdfConfig.ITERATIONS.defaultValue;
    }
    /**
     * Validates the PBKDF2 KDF configuration.
     * A Valid PBKDF2 KDF configuration has KDF iterations between the 600_000 and 2_000_000.
     */
    validateKdfConfig() {
        if (!PBKDF2KdfConfig.ITERATIONS.inRange(this.iterations)) {
            throw new Error(`PBKDF2 iterations must be between ${PBKDF2KdfConfig.ITERATIONS.min} and ${PBKDF2KdfConfig.ITERATIONS.max}`);
        }
    }
    static fromJSON(json) {
        return new PBKDF2KdfConfig(json.iterations);
    }
}
exports.PBKDF2KdfConfig = PBKDF2KdfConfig;
PBKDF2KdfConfig.ITERATIONS = new range_with_default_1.RangeWithDefault(600000, 2000000, 600000);
/**
 * Argon2 KDF configuration.
 */
class Argon2KdfConfig {
    constructor(iterations, memory, parallelism) {
        this.kdfType = kdf_type_enum_1.KdfType.Argon2id;
        this.iterations = iterations !== null && iterations !== void 0 ? iterations : Argon2KdfConfig.ITERATIONS.defaultValue;
        this.memory = memory !== null && memory !== void 0 ? memory : Argon2KdfConfig.MEMORY.defaultValue;
        this.parallelism = parallelism !== null && parallelism !== void 0 ? parallelism : Argon2KdfConfig.PARALLELISM.defaultValue;
    }
    /**
     * Validates the Argon2 KDF configuration.
     * A Valid Argon2 KDF configuration has iterations between 2 and 10, memory between 16mb and 1024mb, and parallelism between 1 and 16.
     */
    validateKdfConfig() {
        if (!Argon2KdfConfig.ITERATIONS.inRange(this.iterations)) {
            throw new Error(`Argon2 iterations must be between ${Argon2KdfConfig.ITERATIONS.min} and ${Argon2KdfConfig.ITERATIONS.max}`);
        }
        if (!Argon2KdfConfig.MEMORY.inRange(this.memory)) {
            throw new Error(`Argon2 memory must be between ${Argon2KdfConfig.MEMORY.min}mb and ${Argon2KdfConfig.MEMORY.max}mb`);
        }
        if (!Argon2KdfConfig.PARALLELISM.inRange(this.parallelism)) {
            throw new Error(`Argon2 parallelism must be between ${Argon2KdfConfig.PARALLELISM.min} and ${Argon2KdfConfig.PARALLELISM.max}.`);
        }
    }
    static fromJSON(json) {
        return new Argon2KdfConfig(json.iterations, json.memory, json.parallelism);
    }
}
exports.Argon2KdfConfig = Argon2KdfConfig;
Argon2KdfConfig.MEMORY = new range_with_default_1.RangeWithDefault(16, 1024, 64);
Argon2KdfConfig.PARALLELISM = new range_with_default_1.RangeWithDefault(1, 16, 4);
Argon2KdfConfig.ITERATIONS = new range_with_default_1.RangeWithDefault(2, 10, 3);
exports.DEFAULT_KDF_CONFIG = new PBKDF2KdfConfig(PBKDF2KdfConfig.ITERATIONS.defaultValue);
//# sourceMappingURL=kdf-config.js.map