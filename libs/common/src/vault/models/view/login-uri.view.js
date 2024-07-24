"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUriView = void 0;
const domain_service_1 = require("../../../models/domain/domain-service");
const safe_urls_1 = require("../../../platform/misc/safe-urls");
const utils_1 = require("../../../platform/misc/utils");
class LoginUriView {
    constructor(u) {
        this.match = null;
        this._uri = null;
        this._domain = null;
        this._hostname = null;
        this._host = null;
        this._canLaunch = null;
        if (!u) {
            return;
        }
        this.match = u.match;
    }
    get uri() {
        return this._uri;
    }
    set uri(value) {
        this._uri = value;
        this._domain = null;
        this._canLaunch = null;
    }
    get domain() {
        if (this._domain == null && this.uri != null) {
            this._domain = utils_1.Utils.getDomain(this.uri);
            if (this._domain === "") {
                this._domain = null;
            }
        }
        return this._domain;
    }
    get hostname() {
        if (this.match === domain_service_1.UriMatchStrategy.RegularExpression) {
            return null;
        }
        if (this._hostname == null && this.uri != null) {
            this._hostname = utils_1.Utils.getHostname(this.uri);
            if (this._hostname === "") {
                this._hostname = null;
            }
        }
        return this._hostname;
    }
    get host() {
        if (this.match === domain_service_1.UriMatchStrategy.RegularExpression) {
            return null;
        }
        if (this._host == null && this.uri != null) {
            this._host = utils_1.Utils.getHost(this.uri);
            if (this._host === "") {
                this._host = null;
            }
        }
        return this._host;
    }
    get hostnameOrUri() {
        return this.hostname != null ? this.hostname : this.uri;
    }
    get hostOrUri() {
        return this.host != null ? this.host : this.uri;
    }
    get isWebsite() {
        return (this.uri != null &&
            (this.uri.indexOf("http://") === 0 ||
                this.uri.indexOf("https://") === 0 ||
                (this.uri.indexOf("://") < 0 && !utils_1.Utils.isNullOrWhitespace(utils_1.Utils.getDomain(this.uri)))));
    }
    get canLaunch() {
        if (this._canLaunch != null) {
            return this._canLaunch;
        }
        if (this.uri != null && this.match !== domain_service_1.UriMatchStrategy.RegularExpression) {
            this._canLaunch = safe_urls_1.SafeUrls.canLaunch(this.launchUri);
        }
        else {
            this._canLaunch = false;
        }
        return this._canLaunch;
    }
    get launchUri() {
        return this.uri.indexOf("://") < 0 && !utils_1.Utils.isNullOrWhitespace(utils_1.Utils.getDomain(this.uri))
            ? "http://" + this.uri
            : this.uri;
    }
    static fromJSON(obj) {
        return Object.assign(new LoginUriView(), obj);
    }
    matchesUri(targetUri, equivalentDomains, defaultUriMatch = null) {
        var _a;
        if (!this.uri || !targetUri) {
            return false;
        }
        let matchType = (_a = this.match) !== null && _a !== void 0 ? _a : defaultUriMatch;
        matchType !== null && matchType !== void 0 ? matchType : (matchType = domain_service_1.UriMatchStrategy.Domain);
        const targetDomain = utils_1.Utils.getDomain(targetUri);
        const matchDomains = equivalentDomains.add(targetDomain);
        switch (matchType) {
            case domain_service_1.UriMatchStrategy.Domain:
                return this.matchesDomain(targetUri, matchDomains);
            case domain_service_1.UriMatchStrategy.Host: {
                const urlHost = utils_1.Utils.getHost(targetUri);
                return urlHost != null && urlHost === utils_1.Utils.getHost(this.uri);
            }
            case domain_service_1.UriMatchStrategy.Exact:
                return targetUri === this.uri;
            case domain_service_1.UriMatchStrategy.StartsWith:
                return targetUri.startsWith(this.uri);
            case domain_service_1.UriMatchStrategy.RegularExpression:
                try {
                    const regex = new RegExp(this.uri, "i");
                    return regex.test(targetUri);
                }
                catch (e) {
                    // Invalid regex
                    return false;
                }
            case domain_service_1.UriMatchStrategy.Never:
                return false;
            default:
                break;
        }
        return false;
    }
    matchesDomain(targetUri, matchDomains) {
        if (targetUri == null || this.domain == null || !matchDomains.has(this.domain)) {
            return false;
        }
        if (utils_1.Utils.DomainMatchBlacklist.has(this.domain)) {
            const domainUrlHost = utils_1.Utils.getHost(targetUri);
            return !utils_1.Utils.DomainMatchBlacklist.get(this.domain).has(domainUrlHost);
        }
        return true;
    }
}
exports.LoginUriView = LoginUriView;
//# sourceMappingURL=login-uri.view.js.map