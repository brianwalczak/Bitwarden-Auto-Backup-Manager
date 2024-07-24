"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgDomainService = void 0;
const rxjs_1 = require("rxjs");
class OrgDomainService {
    constructor(platformUtilsService, i18nService) {
        this.platformUtilsService = platformUtilsService;
        this.i18nService = i18nService;
        this._orgDomains$ = new rxjs_1.BehaviorSubject([]);
        this.orgDomains$ = this._orgDomains$.asObservable();
    }
    get(orgDomainId) {
        const orgDomains = this._orgDomains$.getValue();
        return orgDomains.find((orgDomain) => orgDomain.id === orgDomainId);
    }
    copyDnsTxt(dnsTxt) {
        this.platformUtilsService.copyToClipboard(dnsTxt);
        this.platformUtilsService.showToast("success", null, this.i18nService.t("valueCopied", this.i18nService.t("dnsTxtRecord")));
    }
    upsert(orgDomains) {
        const existingOrgDomains = this._orgDomains$.getValue();
        orgDomains.forEach((orgDomain) => {
            // Determine if passed in orgDomain exists in existing array:
            const index = existingOrgDomains.findIndex((existingOrgDomain) => existingOrgDomain.id === orgDomain.id);
            if (index !== -1) {
                existingOrgDomains[index] = orgDomain;
            }
            else {
                existingOrgDomains.push(orgDomain);
            }
        });
        this._orgDomains$.next(existingOrgDomains);
    }
    replace(orgDomains) {
        this._orgDomains$.next(orgDomains);
    }
    clearCache() {
        this._orgDomains$.next([]);
    }
    delete(orgDomainIds) {
        const existingOrgDomains = this._orgDomains$.getValue();
        orgDomainIds.forEach((orgDomainId) => {
            const index = existingOrgDomains.findIndex((existingOrgDomain) => existingOrgDomain.id === orgDomainId);
            if (index !== -1) {
                existingOrgDomains.splice(index, 1);
            }
        });
        this._orgDomains$.next(existingOrgDomains);
    }
}
exports.OrgDomainService = OrgDomainService;
//# sourceMappingURL=org-domain.service.js.map