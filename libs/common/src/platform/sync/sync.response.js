"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncResponse = void 0;
const policy_response_1 = require("../../admin-console/models/response/policy.response");
const base_response_1 = require("../../models/response/base.response");
const domains_response_1 = require("../../models/response/domains.response");
const profile_response_1 = require("../../models/response/profile.response");
const send_response_1 = require("../../tools/send/models/response/send.response");
const cipher_response_1 = require("../../vault/models/response/cipher.response");
const collection_response_1 = require("../../vault/models/response/collection.response");
const folder_response_1 = require("../../vault/models/response/folder.response");
class SyncResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.folders = [];
        this.collections = [];
        this.ciphers = [];
        this.policies = [];
        this.sends = [];
        const profile = this.getResponseProperty("Profile");
        if (profile != null) {
            this.profile = new profile_response_1.ProfileResponse(profile);
        }
        const folders = this.getResponseProperty("Folders");
        if (folders != null) {
            this.folders = folders.map((f) => new folder_response_1.FolderResponse(f));
        }
        const collections = this.getResponseProperty("Collections");
        if (collections != null) {
            this.collections = collections.map((c) => new collection_response_1.CollectionDetailsResponse(c));
        }
        const ciphers = this.getResponseProperty("Ciphers");
        if (ciphers != null) {
            this.ciphers = ciphers.map((c) => new cipher_response_1.CipherResponse(c));
        }
        const domains = this.getResponseProperty("Domains");
        if (domains != null) {
            this.domains = new domains_response_1.DomainsResponse(domains);
        }
        const policies = this.getResponseProperty("Policies");
        if (policies != null) {
            this.policies = policies.map((p) => new policy_response_1.PolicyResponse(p));
        }
        const sends = this.getResponseProperty("Sends");
        if (sends != null) {
            this.sends = sends.map((s) => new send_response_1.SendResponse(s));
        }
    }
}
exports.SyncResponse = SyncResponse;
//# sourceMappingURL=sync.response.js.map