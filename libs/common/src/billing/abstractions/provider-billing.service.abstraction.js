"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasConsolidatedBilling = void 0;
const rxjs_1 = require("rxjs");
const enums_1 = require("@bitwarden/common/admin-console/enums");
const feature_flag_enum_1 = require("@bitwarden/common/enums/feature-flag.enum");
const hasConsolidatedBilling = (configService) => (0, rxjs_1.switchMap)((provider) => configService
    .getFeatureFlag$(feature_flag_enum_1.FeatureFlag.EnableConsolidatedBilling)
    .pipe((0, rxjs_1.map)((consolidatedBillingEnabled) => provider
    ? provider.providerStatus === enums_1.ProviderStatusType.Billable && consolidatedBillingEnabled
    : false)));
exports.hasConsolidatedBilling = hasConsolidatedBilling;
//# sourceMappingURL=provider-billing.service.abstraction.js.map