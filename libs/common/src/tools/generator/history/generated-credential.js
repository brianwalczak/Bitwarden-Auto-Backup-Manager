"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratedCredential = void 0;
/** A credential generation result */
class GeneratedCredential {
    /**
     * Instantiates a generated credential
     * @param credential The value of the generated credential (e.g. a password)
     * @param category The kind of credential
     * @param generationDate The date that the credential was generated.
     *   Numeric values should are interpreted using {@link Date.valueOf}
     *   semantics.
     */
    constructor(credential, category, generationDate) {
        this.credential = credential;
        this.category = category;
        if (typeof generationDate === "number") {
            this.generationDate = new Date(generationDate);
        }
        else {
            this.generationDate = generationDate;
        }
    }
    /** Constructs a credential from its `toJSON` representation */
    static fromJSON(jsonValue) {
        return new GeneratedCredential(jsonValue.credential, jsonValue.category, jsonValue.generationDate);
    }
    /** Serializes a credential to a JSON-compatible object */
    toJSON() {
        return {
            credential: this.credential,
            category: this.category,
            generationDate: this.generationDate.valueOf(),
        };
    }
}
exports.GeneratedCredential = GeneratedCredential;
//# sourceMappingURL=generated-credential.js.map