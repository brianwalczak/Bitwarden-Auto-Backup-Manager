"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordManagerPlanFeaturesResponse = exports.SecretsManagerPlanFeaturesResponse = exports.PlanResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class PlanResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.type = this.getResponseProperty("Type");
        this.productTier = this.getResponseProperty("ProductTier");
        this.name = this.getResponseProperty("Name");
        this.isAnnual = this.getResponseProperty("IsAnnual");
        this.nameLocalizationKey = this.getResponseProperty("NameLocalizationKey");
        this.descriptionLocalizationKey = this.getResponseProperty("DescriptionLocalizationKey");
        this.canBeUsedByBusiness = this.getResponseProperty("CanBeUsedByBusiness");
        this.trialPeriodDays = this.getResponseProperty("TrialPeriodDays");
        this.hasSelfHost = this.getResponseProperty("HasSelfHost");
        this.hasPolicies = this.getResponseProperty("HasPolicies");
        this.hasGroups = this.getResponseProperty("HasGroups");
        this.hasDirectory = this.getResponseProperty("HasDirectory");
        this.hasEvents = this.getResponseProperty("HasEvents");
        this.hasTotp = this.getResponseProperty("HasTotp");
        this.has2fa = this.getResponseProperty("Has2fa");
        this.hasApi = this.getResponseProperty("HasApi");
        this.hasSso = this.getResponseProperty("HasSso");
        this.hasResetPassword = this.getResponseProperty("HasResetPassword");
        this.usersGetPremium = this.getResponseProperty("UsersGetPremium");
        this.upgradeSortOrder = this.getResponseProperty("UpgradeSortOrder");
        this.displaySortOrder = this.getResponseProperty("DisplaySortOrder");
        this.legacyYear = this.getResponseProperty("LegacyYear");
        this.disabled = this.getResponseProperty("Disabled");
        const passwordManager = this.getResponseProperty("PasswordManager");
        const secretsManager = this.getResponseProperty("SecretsManager");
        this.PasswordManager =
            passwordManager == null ? null : new PasswordManagerPlanFeaturesResponse(passwordManager);
        this.SecretsManager =
            secretsManager == null ? null : new SecretsManagerPlanFeaturesResponse(secretsManager);
    }
}
exports.PlanResponse = PlanResponse;
class SecretsManagerPlanFeaturesResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.stripeSeatPlanId = this.getResponseProperty("StripeSeatPlanId");
        this.baseSeats = this.getResponseProperty("BaseSeats");
        this.basePrice = this.getResponseProperty("BasePrice");
        this.seatPrice = this.getResponseProperty("SeatPrice");
        this.hasAdditionalSeatsOption = this.getResponseProperty("HasAdditionalSeatsOption");
        this.maxAdditionalSeats = this.getResponseProperty("MaxAdditionalSeats");
        this.maxSeats = this.getResponseProperty("MaxSeats");
        this.stripeServiceAccountPlanId = this.getResponseProperty("StripeServiceAccountPlanId");
        this.additionalPricePerServiceAccount = this.getResponseProperty("AdditionalPricePerServiceAccount");
        this.baseServiceAccount = this.getResponseProperty("BaseServiceAccount");
        this.maxServiceAccount = this.getResponseProperty("MaxServiceAccount");
        this.hasAdditionalServiceAccountOption = this.getResponseProperty("HasAdditionalServiceAccountOption");
        this.maxAdditionalServiceAccounts = this.getResponseProperty("MaxAdditionalServiceAccounts");
        this.maxProjects = this.getResponseProperty("MaxProjects");
    }
}
exports.SecretsManagerPlanFeaturesResponse = SecretsManagerPlanFeaturesResponse;
class PasswordManagerPlanFeaturesResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.stripePlanId = this.getResponseProperty("StripePlanId");
        this.stripeSeatPlanId = this.getResponseProperty("StripeSeatPlanId");
        this.stripeProviderPortalSeatPlanId = this.getResponseProperty("StripeProviderPortalSeatPlanId");
        this.stripeStoragePlanId = this.getResponseProperty("StripeStoragePlanId");
        this.stripePremiumAccessPlanId = this.getResponseProperty("StripePremiumAccessPlanId");
        this.basePrice = this.getResponseProperty("BasePrice");
        this.seatPrice = this.getResponseProperty("SeatPrice");
        this.providerPortalSeatPrice = this.getResponseProperty("ProviderPortalSeatPrice");
        this.baseSeats = this.getResponseProperty("BaseSeats");
        this.maxAdditionalSeats = this.getResponseProperty("MaxAdditionalSeats");
        this.premiumAccessOptionPrice = this.getResponseProperty("PremiumAccessOptionPrice");
        this.maxSeats = this.getResponseProperty("MaxSeats");
        this.additionalStoragePricePerGb = this.getResponseProperty("AdditionalStoragePricePerGb");
        this.hasAdditionalSeatsOption = this.getResponseProperty("HasAdditionalSeatsOption");
        this.baseStorageGb = this.getResponseProperty("BaseStorageGb");
        this.maxCollections = this.getResponseProperty("MaxCollections");
        this.hasAdditionalStorageOption = this.getResponseProperty("HasAdditionalStorageOption");
        this.maxAdditionalStorage = this.getResponseProperty("MaxAdditionalStorage");
        this.hasPremiumAccessOption = this.getResponseProperty("HasPremiumAccessOption");
    }
}
exports.PasswordManagerPlanFeaturesResponse = PasswordManagerPlanFeaturesResponse;
//# sourceMappingURL=plan.response.js.map