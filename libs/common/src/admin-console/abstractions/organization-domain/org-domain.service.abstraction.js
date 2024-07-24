"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgDomainInternalServiceAbstraction = exports.OrgDomainServiceAbstraction = void 0;
class OrgDomainServiceAbstraction {
}
exports.OrgDomainServiceAbstraction = OrgDomainServiceAbstraction;
// Note: this separate class is designed to hold methods that are not
// meant to be used in components (e.g., data write methods)
class OrgDomainInternalServiceAbstraction extends OrgDomainServiceAbstraction {
}
exports.OrgDomainInternalServiceAbstraction = OrgDomainInternalServiceAbstraction;
//# sourceMappingURL=org-domain.service.abstraction.js.map