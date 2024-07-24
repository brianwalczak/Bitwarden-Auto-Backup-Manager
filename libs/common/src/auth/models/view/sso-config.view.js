"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsoConfigView = void 0;
const view_1 = require("../../../models/view/view");
const sso_1 = require("../../enums/sso");
class SsoConfigView extends view_1.View {
    constructor(orgSsoResponse) {
        super();
        if (orgSsoResponse == null) {
            return;
        }
        this.enabled = orgSsoResponse.enabled;
        this.ssoIdentifier = orgSsoResponse.identifier;
        if (orgSsoResponse.data == null) {
            return;
        }
        this.configType = orgSsoResponse.data.configType;
        this.memberDecryptionType = orgSsoResponse.data.memberDecryptionType;
        this.keyConnectorUrl = orgSsoResponse.data.keyConnectorUrl;
        if (this.configType === sso_1.SsoType.OpenIdConnect) {
            this.openId = {
                authority: orgSsoResponse.data.authority,
                clientId: orgSsoResponse.data.clientId,
                clientSecret: orgSsoResponse.data.clientSecret,
                metadataAddress: orgSsoResponse.data.metadataAddress,
                redirectBehavior: orgSsoResponse.data.redirectBehavior,
                getClaimsFromUserInfoEndpoint: orgSsoResponse.data.getClaimsFromUserInfoEndpoint,
                additionalScopes: orgSsoResponse.data.additionalScopes,
                additionalUserIdClaimTypes: orgSsoResponse.data.additionalUserIdClaimTypes,
                additionalEmailClaimTypes: orgSsoResponse.data.additionalEmailClaimTypes,
                additionalNameClaimTypes: orgSsoResponse.data.additionalNameClaimTypes,
                acrValues: orgSsoResponse.data.acrValues,
                expectedReturnAcrValue: orgSsoResponse.data.expectedReturnAcrValue,
            };
        }
        else if (this.configType === sso_1.SsoType.Saml2) {
            this.saml = {
                spUniqueEntityId: orgSsoResponse.data.spUniqueEntityId,
                spNameIdFormat: orgSsoResponse.data.spNameIdFormat,
                spOutboundSigningAlgorithm: orgSsoResponse.data.spOutboundSigningAlgorithm,
                spSigningBehavior: orgSsoResponse.data.spSigningBehavior,
                spMinIncomingSigningAlgorithm: orgSsoResponse.data.spMinIncomingSigningAlgorithm,
                spWantAssertionsSigned: orgSsoResponse.data.spWantAssertionsSigned,
                spValidateCertificates: orgSsoResponse.data.spValidateCertificates,
                idpEntityId: orgSsoResponse.data.idpEntityId,
                idpBindingType: orgSsoResponse.data.idpBindingType,
                idpSingleSignOnServiceUrl: orgSsoResponse.data.idpSingleSignOnServiceUrl,
                idpSingleLogoutServiceUrl: orgSsoResponse.data.idpSingleLogoutServiceUrl,
                idpX509PublicCert: orgSsoResponse.data.idpX509PublicCert,
                idpOutboundSigningAlgorithm: orgSsoResponse.data.idpOutboundSigningAlgorithm,
                idpAllowUnsolicitedAuthnResponse: orgSsoResponse.data.idpAllowUnsolicitedAuthnResponse,
                idpWantAuthnRequestsSigned: orgSsoResponse.data.idpWantAuthnRequestsSigned,
                // Value is inverted in the view model (allow instead of disable)
                idpAllowOutboundLogoutRequests: orgSsoResponse.data.idpDisableOutboundLogoutRequests == null
                    ? null
                    : !orgSsoResponse.data.idpDisableOutboundLogoutRequests,
            };
        }
    }
}
exports.SsoConfigView = SsoConfigView;
//# sourceMappingURL=sso-config.view.js.map