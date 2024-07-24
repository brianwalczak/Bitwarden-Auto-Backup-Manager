"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_SEND_MEMORY = exports.GENERATOR_MEMORY = exports.GENERATOR_DISK = exports.SM_ONBOARDING_DISK = exports.TASK_SCHEDULER_DISK = exports.TRANSLATION_DISK = exports.THEMING_DISK = exports.ENVIRONMENT_MEMORY = exports.ENVIRONMENT_DISK = exports.DESKTOP_SETTINGS_DISK = exports.CRYPTO_MEMORY = exports.CRYPTO_DISK = exports.CONFIG_DISK = exports.CLEAR_EVENT_DISK = exports.BIOMETRIC_SETTINGS_DISK = exports.APPLICATION_ID_DISK = exports.NEW_WEB_LAYOUT_BANNER_DISK = exports.AUTOFILL_SETTINGS_DISK_LOCAL = exports.AUTOFILL_SETTINGS_DISK = exports.DOMAIN_SETTINGS_DISK = exports.USER_NOTIFICATION_SETTINGS_DISK = exports.BADGE_SETTINGS_DISK = exports.VAULT_TIMEOUT_SETTINGS_DISK_LOCAL = exports.ORGANIZATION_INVITE_DISK = exports.USER_DECRYPTION_OPTIONS_DISK = exports.TWO_FACTOR_MEMORY = exports.TOKEN_MEMORY = exports.TOKEN_DISK_LOCAL = exports.TOKEN_DISK = exports.SSO_DISK = exports.ROUTER_DISK = exports.PIN_MEMORY = exports.PIN_DISK = exports.MASTER_PASSWORD_MEMORY = exports.MASTER_PASSWORD_DISK = exports.LOGIN_STRATEGY_MEMORY = exports.LOGIN_EMAIL_DISK = exports.KEY_CONNECTOR_DISK = exports.KDF_CONFIG_DISK = exports.DEVICE_TRUST_DISK_LOCAL = exports.AVATAR_DISK = exports.AUTH_REQUEST_DISK_LOCAL = exports.ACCOUNT_MEMORY = exports.ACCOUNT_DISK = exports.BILLING_DISK = exports.AC_BANNERS_DISMISSED_DISK = exports.ORGANIZATION_MANAGEMENT_PREFERENCES_DISK = exports.PROVIDERS_DISK = exports.POLICIES_DISK = exports.ORGANIZATIONS_DISK = void 0;
exports.BANNERS_DISMISSED_DISK = exports.PREMIUM_BANNER_DISK_LOCAL = exports.CIPHERS_MEMORY = exports.CIPHERS_DISK_LOCAL = exports.CIPHERS_DISK = exports.VAULT_SEARCH_MEMORY = exports.VAULT_BROWSER_MEMORY = exports.VAULT_SETTINGS_DISK = exports.VAULT_ONBOARDING = exports.VAULT_FILTER_DISK = exports.FOLDER_DISK = exports.COLLECTION_DATA = exports.SEND_MEMORY = exports.SEND_DISK = exports.EVENT_COLLECTION_DISK = void 0;
const state_definition_1 = require("./state-definition");
/**
 * `StateDefinition`s comes with some rules, to facilitate a quick review from
 * platform of this file, ensure you follow these rules, the ones marked with (tested)
 * have unit tests that you can run locally.
 *
 * 1. (tested) Names should not be null or undefined
 * 2. (tested) Name and storage location should be unique
 * 3. (tested) Name and storage location can't differ from another export by only casing
 * 4. (tested) Name should be longer than 3 characters. It should be descriptive, but brief.
 * 5. (tested) Name should not contain spaces or underscores
 * 6. Name should be human readable
 * 7. Name should be in camelCase format (unit tests ensure the first character is lowercase)
 * 8. Teams should only use state definitions they have created
 * 9. StateDefinitions should only be used for keys relating to the state name they chose
 *
 */
// Admin Console
exports.ORGANIZATIONS_DISK = new state_definition_1.StateDefinition("organizations", "disk");
exports.POLICIES_DISK = new state_definition_1.StateDefinition("policies", "disk");
exports.PROVIDERS_DISK = new state_definition_1.StateDefinition("providers", "disk");
exports.ORGANIZATION_MANAGEMENT_PREFERENCES_DISK = new state_definition_1.StateDefinition("organizationManagementPreferences", "disk", {
    web: "disk-local",
});
exports.AC_BANNERS_DISMISSED_DISK = new state_definition_1.StateDefinition("acBannersDismissed", "disk", {
    web: "disk-local",
});
// Billing
exports.BILLING_DISK = new state_definition_1.StateDefinition("billing", "disk");
// Auth
exports.ACCOUNT_DISK = new state_definition_1.StateDefinition("account", "disk");
exports.ACCOUNT_MEMORY = new state_definition_1.StateDefinition("account", "memory");
exports.AUTH_REQUEST_DISK_LOCAL = new state_definition_1.StateDefinition("authRequestLocal", "disk", {
    web: "disk-local",
});
exports.AVATAR_DISK = new state_definition_1.StateDefinition("avatar", "disk", { web: "disk-local" });
exports.DEVICE_TRUST_DISK_LOCAL = new state_definition_1.StateDefinition("deviceTrust", "disk", {
    web: "disk-local",
});
exports.KDF_CONFIG_DISK = new state_definition_1.StateDefinition("kdfConfig", "disk");
exports.KEY_CONNECTOR_DISK = new state_definition_1.StateDefinition("keyConnector", "disk");
exports.LOGIN_EMAIL_DISK = new state_definition_1.StateDefinition("loginEmail", "disk", {
    web: "disk-local",
});
exports.LOGIN_STRATEGY_MEMORY = new state_definition_1.StateDefinition("loginStrategy", "memory");
exports.MASTER_PASSWORD_DISK = new state_definition_1.StateDefinition("masterPassword", "disk");
exports.MASTER_PASSWORD_MEMORY = new state_definition_1.StateDefinition("masterPassword", "memory");
exports.PIN_DISK = new state_definition_1.StateDefinition("pinUnlock", "disk");
exports.PIN_MEMORY = new state_definition_1.StateDefinition("pinUnlock", "memory");
exports.ROUTER_DISK = new state_definition_1.StateDefinition("router", "disk");
exports.SSO_DISK = new state_definition_1.StateDefinition("ssoLogin", "disk");
exports.TOKEN_DISK = new state_definition_1.StateDefinition("token", "disk");
exports.TOKEN_DISK_LOCAL = new state_definition_1.StateDefinition("tokenDiskLocal", "disk", {
    web: "disk-local",
});
exports.TOKEN_MEMORY = new state_definition_1.StateDefinition("token", "memory");
exports.TWO_FACTOR_MEMORY = new state_definition_1.StateDefinition("twoFactor", "memory");
exports.USER_DECRYPTION_OPTIONS_DISK = new state_definition_1.StateDefinition("userDecryptionOptions", "disk");
exports.ORGANIZATION_INVITE_DISK = new state_definition_1.StateDefinition("organizationInvite", "disk");
exports.VAULT_TIMEOUT_SETTINGS_DISK_LOCAL = new state_definition_1.StateDefinition("vaultTimeoutSettings", "disk", {
    web: "disk-local",
});
// Autofill
exports.BADGE_SETTINGS_DISK = new state_definition_1.StateDefinition("badgeSettings", "disk");
exports.USER_NOTIFICATION_SETTINGS_DISK = new state_definition_1.StateDefinition("userNotificationSettings", "disk");
exports.DOMAIN_SETTINGS_DISK = new state_definition_1.StateDefinition("domainSettings", "disk");
exports.AUTOFILL_SETTINGS_DISK = new state_definition_1.StateDefinition("autofillSettings", "disk");
exports.AUTOFILL_SETTINGS_DISK_LOCAL = new state_definition_1.StateDefinition("autofillSettingsLocal", "disk", {
    web: "disk-local",
});
// Components
exports.NEW_WEB_LAYOUT_BANNER_DISK = new state_definition_1.StateDefinition("newWebLayoutBanner", "disk", {
    web: "disk-local",
});
// Platform
exports.APPLICATION_ID_DISK = new state_definition_1.StateDefinition("applicationId", "disk", {
    web: "disk-local",
});
exports.BIOMETRIC_SETTINGS_DISK = new state_definition_1.StateDefinition("biometricSettings", "disk");
exports.CLEAR_EVENT_DISK = new state_definition_1.StateDefinition("clearEvent", "disk");
exports.CONFIG_DISK = new state_definition_1.StateDefinition("config", "disk", {
    web: "disk-local",
});
exports.CRYPTO_DISK = new state_definition_1.StateDefinition("crypto", "disk");
exports.CRYPTO_MEMORY = new state_definition_1.StateDefinition("crypto", "memory");
exports.DESKTOP_SETTINGS_DISK = new state_definition_1.StateDefinition("desktopSettings", "disk");
exports.ENVIRONMENT_DISK = new state_definition_1.StateDefinition("environment", "disk");
exports.ENVIRONMENT_MEMORY = new state_definition_1.StateDefinition("environment", "memory");
exports.THEMING_DISK = new state_definition_1.StateDefinition("theming", "disk", { web: "disk-local" });
exports.TRANSLATION_DISK = new state_definition_1.StateDefinition("translation", "disk", { web: "disk-local" });
exports.TASK_SCHEDULER_DISK = new state_definition_1.StateDefinition("taskScheduler", "disk");
// Secrets Manager
exports.SM_ONBOARDING_DISK = new state_definition_1.StateDefinition("smOnboarding", "disk", {
    web: "disk-local",
});
// Tools
exports.GENERATOR_DISK = new state_definition_1.StateDefinition("generator", "disk");
exports.GENERATOR_MEMORY = new state_definition_1.StateDefinition("generator", "memory");
exports.BROWSER_SEND_MEMORY = new state_definition_1.StateDefinition("sendBrowser", "memory");
exports.EVENT_COLLECTION_DISK = new state_definition_1.StateDefinition("eventCollection", "disk");
exports.SEND_DISK = new state_definition_1.StateDefinition("encryptedSend", "disk", {
    web: "memory",
});
exports.SEND_MEMORY = new state_definition_1.StateDefinition("decryptedSend", "memory", {
    browser: "memory-large-object",
});
// Vault
exports.COLLECTION_DATA = new state_definition_1.StateDefinition("collection", "disk", {
    web: "memory",
});
exports.FOLDER_DISK = new state_definition_1.StateDefinition("folder", "disk", { web: "memory" });
exports.VAULT_FILTER_DISK = new state_definition_1.StateDefinition("vaultFilter", "disk", {
    web: "disk-local",
});
exports.VAULT_ONBOARDING = new state_definition_1.StateDefinition("vaultOnboarding", "disk", {
    web: "disk-local",
});
exports.VAULT_SETTINGS_DISK = new state_definition_1.StateDefinition("vaultSettings", "disk", {
    web: "disk-local",
});
exports.VAULT_BROWSER_MEMORY = new state_definition_1.StateDefinition("vaultBrowser", "memory", {
    browser: "memory-large-object",
});
exports.VAULT_SEARCH_MEMORY = new state_definition_1.StateDefinition("vaultSearch", "memory", {
    browser: "memory-large-object",
});
exports.CIPHERS_DISK = new state_definition_1.StateDefinition("ciphers", "disk", { web: "memory" });
exports.CIPHERS_DISK_LOCAL = new state_definition_1.StateDefinition("ciphersLocal", "disk", {
    web: "disk-local",
});
exports.CIPHERS_MEMORY = new state_definition_1.StateDefinition("ciphersMemory", "memory", {
    browser: "memory-large-object",
});
exports.PREMIUM_BANNER_DISK_LOCAL = new state_definition_1.StateDefinition("premiumBannerReprompt", "disk", {
    web: "disk-local",
});
exports.BANNERS_DISMISSED_DISK = new state_definition_1.StateDefinition("bannersDismissed", "disk");
//# sourceMappingURL=state-definitions.js.map