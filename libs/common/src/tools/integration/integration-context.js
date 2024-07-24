"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationContext = void 0;
const utils_1 = require("@bitwarden/common/platform/misc/utils");
/** Utilities for processing integration settings */
class IntegrationContext {
    /** Instantiates an integration context
     *  @param metadata - defines integration capabilities
     *  @param i18n - localizes error messages
     */
    constructor(metadata, i18n) {
        this.metadata = metadata;
        this.i18n = i18n;
    }
    /** Lookup the integration's baseUrl
     *  @param settings settings that override the baseUrl.
     *  @returns the baseUrl for the API's integration point.
     *   - By default this is defined by the metadata
     *   - When a service allows self-hosting, this can be supplied by `settings`.
     *  @throws a localized error message when a base URL is neither defined by the metadata or
     *   supplied by an argument.
     */
    baseUrl(settings) {
        var _a;
        // normalize baseUrl
        const setting = settings && "baseUrl" in settings ? settings.baseUrl : "";
        let result = "";
        // look up definition
        if (this.metadata.selfHost === "always") {
            result = setting;
        }
        else if (this.metadata.selfHost === "never" || setting.length <= 0) {
            result = (_a = this.metadata.baseUrl) !== null && _a !== void 0 ? _a : "";
        }
        else {
            result = setting;
        }
        // postconditions
        if (result === "") {
            const error = this.i18n.t("forwarderNoUrl", this.metadata.name);
            throw error;
        }
        return result;
    }
    /** look up a service API's authentication token
     *  @param settings store the API token
     *  @param options.base64 when `true`, base64 encodes the result. Defaults to `false`.
     *  @returns the user's authentication token
     *  @throws a localized error message when the token is invalid.
     */
    authenticationToken(settings, options = null) {
        if (!settings.token || settings.token === "") {
            const error = this.i18n.t("forwaderInvalidToken", this.metadata.name);
            throw error;
        }
        let token = settings.token;
        if (options === null || options === void 0 ? void 0 : options.base64) {
            token = utils_1.Utils.fromUtf8ToB64(token);
        }
        return token;
    }
    /** look up the website the integration is working with.
     *  @param request supplies information about the state of the extension site
     *  @returns The website or an empty string if a website isn't available
     *  @remarks `website` is usually supplied when generating a credential from the vault
     */
    website(request) {
        var _a;
        return (_a = request.website) !== null && _a !== void 0 ? _a : "";
    }
    /** look up localized text indicating Bitwarden requested the forwarding address.
     *  @param request supplies information about the state of the extension site
     *  @returns localized text describing a generated forwarding address
     */
    generatedBy(request) {
        const website = this.website(request);
        const descriptionId = website === "" ? "forwarderGeneratedBy" : "forwarderGeneratedByWithWebsite";
        const description = this.i18n.t(descriptionId, website);
        return description;
    }
}
exports.IntegrationContext = IntegrationContext;
//# sourceMappingURL=integration-context.js.map