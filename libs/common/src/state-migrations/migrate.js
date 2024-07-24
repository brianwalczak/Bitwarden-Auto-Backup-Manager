"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENT_VERSION = exports.MIN_VERSION = void 0;
exports.createMigrationBuilder = createMigrationBuilder;
exports.currentVersion = currentVersion;
exports.waitForMigrations = waitForMigrations;
const migration_builder_1 = require("./migration-builder");
const _10_move_ever_had_user_key_to_state_providers_1 = require("./migrations/10-move-ever-had-user-key-to-state-providers");
const _11_move_org_keys_to_state_providers_1 = require("./migrations/11-move-org-keys-to-state-providers");
const _12_move_environment_state_to_providers_1 = require("./migrations/12-move-environment-state-to-providers");
const _13_move_provider_keys_to_state_providers_1 = require("./migrations/13-move-provider-keys-to-state-providers");
const _14_move_biometric_client_key_half_state_to_providers_1 = require("./migrations/14-move-biometric-client-key-half-state-to-providers");
const _15_move_folder_state_to_state_provider_1 = require("./migrations/15-move-folder-state-to-state-provider");
const _16_move_last_sync_to_state_provider_1 = require("./migrations/16-move-last-sync-to-state-provider");
const _17_move_enable_passkeys_to_state_providers_1 = require("./migrations/17-move-enable-passkeys-to-state-providers");
const _18_move_autofill_settings_to_state_providers_1 = require("./migrations/18-move-autofill-settings-to-state-providers");
const _19_migrate_require_password_on_start_1 = require("./migrations/19-migrate-require-password-on-start");
const _20_move_private_key_to_state_providers_1 = require("./migrations/20-move-private-key-to-state-providers");
const _21_move_collections_state_to_state_provider_1 = require("./migrations/21-move-collections-state-to-state-provider");
const _22_move_collapsed_groupings_to_state_provider_1 = require("./migrations/22-move-collapsed-groupings-to-state-provider");
const _23_move_biometric_prompts_to_state_providers_1 = require("./migrations/23-move-biometric-prompts-to-state-providers");
const _24_move_sm_onboarding_key_to_state_providers_1 = require("./migrations/24-move-sm-onboarding-key-to-state-providers");
const _25_move_clear_clipboard_to_autofill_settings_state_provider_1 = require("./migrations/25-move-clear-clipboard-to-autofill-settings-state-provider");
const _26_revert_move_last_sync_to_state_provider_1 = require("./migrations/26-revert-move-last-sync-to-state-provider");
const _27_move_badge_settings_to_state_providers_1 = require("./migrations/27-move-badge-settings-to-state-providers");
const _28_move_biometric_unlock_to_state_providers_1 = require("./migrations/28-move-biometric-unlock-to-state-providers");
const _29_move_user_notification_settings_to_state_provider_1 = require("./migrations/29-move-user-notification-settings-to-state-provider");
const _30_move_policy_state_to_state_provider_1 = require("./migrations/30-move-policy-state-to-state-provider");
const _31_move_enable_context_menu_to_autofill_settings_state_provider_1 = require("./migrations/31-move-enable-context-menu-to-autofill-settings-state-provider");
const _32_move_preferred_language_1 = require("./migrations/32-move-preferred-language");
const _33_move_app_id_to_state_providers_1 = require("./migrations/33-move-app-id-to-state-providers");
const _34_move_domain_settings_to_state_providers_1 = require("./migrations/34-move-domain-settings-to-state-providers");
const _35_move_theme_to_state_providers_1 = require("./migrations/35-move-theme-to-state-providers");
const _36_move_show_card_and_identity_to_state_provider_1 = require("./migrations/36-move-show-card-and-identity-to-state-provider");
const _37_move_avatar_color_to_state_providers_1 = require("./migrations/37-move-avatar-color-to-state-providers");
const _38_migrate_token_svc_to_state_provider_1 = require("./migrations/38-migrate-token-svc-to-state-provider");
const _39_move_billing_account_profile_to_state_providers_1 = require("./migrations/39-move-billing-account-profile-to-state-providers");
const _4_remove_ever_been_unlocked_1 = require("./migrations/4-remove-ever-been-unlocked");
const _40_move_organization_state_to_state_provider_1 = require("./migrations/40-move-organization-state-to-state-provider");
const _41_move_event_collection_to_state_provider_1 = require("./migrations/41-move-event-collection-to-state-provider");
const _42_move_enable_favicon_to_domain_settings_state_provider_1 = require("./migrations/42-move-enable-favicon-to-domain-settings-state-provider");
const _43_move_auto_confirm_finger_prints_to_state_provider_1 = require("./migrations/43-move-auto-confirm-finger-prints-to-state-provider");
const _44_move_user_decryption_options_to_state_provider_1 = require("./migrations/44-move-user-decryption-options-to-state-provider");
const _45_merge_environment_state_1 = require("./migrations/45-merge-environment-state");
const _46_delete_orphaned_biometric_prompt_data_1 = require("./migrations/46-delete-orphaned-biometric-prompt-data");
const _47_move_desktop_settings_1 = require("./migrations/47-move-desktop-settings");
const _48_move_ddg_to_state_provider_1 = require("./migrations/48-move-ddg-to-state-provider");
const _49_move_account_server_configs_1 = require("./migrations/49-move-account-server-configs");
const _5_add_key_type_to_org_keys_1 = require("./migrations/5-add-key-type-to-org-keys");
const _50_move_key_connector_to_state_provider_1 = require("./migrations/50-move-key-connector-to-state-provider");
const _51_move_remembered_email_to_state_providers_1 = require("./migrations/51-move-remembered-email-to-state-providers");
const _52_delete_installed_version_1 = require("./migrations/52-delete-installed-version");
const _53_migrate_device_trust_svc_to_state_providers_1 = require("./migrations/53-migrate-device-trust-svc-to-state-providers");
const _54_move_encrypted_sends_1 = require("./migrations/54-move-encrypted-sends");
const _55_move_master_key_state_to_provider_1 = require("./migrations/55-move-master-key-state-to-provider");
const _56_move_auth_requests_1 = require("./migrations/56-move-auth-requests");
const _57_move_cipher_service_to_state_provider_1 = require("./migrations/57-move-cipher-service-to-state-provider");
const _58_remove_refresh_token_migrated_state_provider_flag_1 = require("./migrations/58-remove-refresh-token-migrated-state-provider-flag");
const _59_move_kdf_config_to_state_provider_1 = require("./migrations/59-move-kdf-config-to-state-provider");
const _6_remove_legacy_etm_key_1 = require("./migrations/6-remove-legacy-etm-key");
const _60_known_accounts_1 = require("./migrations/60-known-accounts");
const _61_move_pin_state_to_providers_1 = require("./migrations/61-move-pin-state-to-providers");
const _62_migrate_vault_timeout_settings_svc_to_state_provider_1 = require("./migrations/62-migrate-vault-timeout-settings-svc-to-state-provider");
const _63_migrate_password_settings_1 = require("./migrations/63-migrate-password-settings");
const _64_migrate_generator_history_1 = require("./migrations/64-migrate-generator-history");
const _65_migrate_forwarder_settings_1 = require("./migrations/65-migrate-forwarder-settings");
const _66_move_final_desktop_settings_1 = require("./migrations/66-move-final-desktop-settings");
const _7_move_biometric_auto_prompt_to_account_1 = require("./migrations/7-move-biometric-auto-prompt-to-account");
const _8_move_state_version_1 = require("./migrations/8-move-state-version");
const _9_move_browser_settings_to_global_1 = require("./migrations/9-move-browser-settings-to-global");
const min_version_1 = require("./migrations/min-version");
exports.MIN_VERSION = 3;
exports.CURRENT_VERSION = 66;
function createMigrationBuilder() {
    return migration_builder_1.MigrationBuilder.create()
        .with(min_version_1.MinVersionMigrator)
        .with(_4_remove_ever_been_unlocked_1.RemoveEverBeenUnlockedMigrator, 3, 4)
        .with(_5_add_key_type_to_org_keys_1.AddKeyTypeToOrgKeysMigrator, 4, 5)
        .with(_6_remove_legacy_etm_key_1.RemoveLegacyEtmKeyMigrator, 5, 6)
        .with(_7_move_biometric_auto_prompt_to_account_1.MoveBiometricAutoPromptToAccount, 6, 7)
        .with(_8_move_state_version_1.MoveStateVersionMigrator, 7, 8)
        .with(_9_move_browser_settings_to_global_1.MoveBrowserSettingsToGlobal, 8, 9)
        .with(_10_move_ever_had_user_key_to_state_providers_1.EverHadUserKeyMigrator, 9, 10)
        .with(_11_move_org_keys_to_state_providers_1.OrganizationKeyMigrator, 10, 11)
        .with(_12_move_environment_state_to_providers_1.MoveEnvironmentStateToProviders, 11, 12)
        .with(_13_move_provider_keys_to_state_providers_1.ProviderKeyMigrator, 12, 13)
        .with(_14_move_biometric_client_key_half_state_to_providers_1.MoveBiometricClientKeyHalfToStateProviders, 13, 14)
        .with(_15_move_folder_state_to_state_provider_1.FolderMigrator, 14, 15)
        .with(_16_move_last_sync_to_state_provider_1.LastSyncMigrator, 15, 16)
        .with(_17_move_enable_passkeys_to_state_providers_1.EnablePasskeysMigrator, 16, 17)
        .with(_18_move_autofill_settings_to_state_providers_1.AutofillSettingsKeyMigrator, 17, 18)
        .with(_19_migrate_require_password_on_start_1.RequirePasswordOnStartMigrator, 18, 19)
        .with(_20_move_private_key_to_state_providers_1.PrivateKeyMigrator, 19, 20)
        .with(_21_move_collections_state_to_state_provider_1.CollectionMigrator, 20, 21)
        .with(_22_move_collapsed_groupings_to_state_provider_1.CollapsedGroupingsMigrator, 21, 22)
        .with(_23_move_biometric_prompts_to_state_providers_1.MoveBiometricPromptsToStateProviders, 22, 23)
        .with(_24_move_sm_onboarding_key_to_state_providers_1.SmOnboardingTasksMigrator, 23, 24)
        .with(_25_move_clear_clipboard_to_autofill_settings_state_provider_1.ClearClipboardDelayMigrator, 24, 25)
        .with(_26_revert_move_last_sync_to_state_provider_1.RevertLastSyncMigrator, 25, 26)
        .with(_27_move_badge_settings_to_state_providers_1.BadgeSettingsMigrator, 26, 27)
        .with(_28_move_biometric_unlock_to_state_providers_1.MoveBiometricUnlockToStateProviders, 27, 28)
        .with(_29_move_user_notification_settings_to_state_provider_1.UserNotificationSettingsKeyMigrator, 28, 29)
        .with(_30_move_policy_state_to_state_provider_1.PolicyMigrator, 29, 30)
        .with(_31_move_enable_context_menu_to_autofill_settings_state_provider_1.EnableContextMenuMigrator, 30, 31)
        .with(_32_move_preferred_language_1.PreferredLanguageMigrator, 31, 32)
        .with(_33_move_app_id_to_state_providers_1.AppIdMigrator, 32, 33)
        .with(_34_move_domain_settings_to_state_providers_1.DomainSettingsMigrator, 33, 34)
        .with(_35_move_theme_to_state_providers_1.MoveThemeToStateProviderMigrator, 34, 35)
        .with(_36_move_show_card_and_identity_to_state_provider_1.VaultSettingsKeyMigrator, 35, 36)
        .with(_37_move_avatar_color_to_state_providers_1.AvatarColorMigrator, 36, 37)
        .with(_38_migrate_token_svc_to_state_provider_1.TokenServiceStateProviderMigrator, 37, 38)
        .with(_39_move_billing_account_profile_to_state_providers_1.MoveBillingAccountProfileMigrator, 38, 39)
        .with(_40_move_organization_state_to_state_provider_1.OrganizationMigrator, 39, 40)
        .with(_41_move_event_collection_to_state_provider_1.EventCollectionMigrator, 40, 41)
        .with(_42_move_enable_favicon_to_domain_settings_state_provider_1.EnableFaviconMigrator, 41, 42)
        .with(_43_move_auto_confirm_finger_prints_to_state_provider_1.AutoConfirmFingerPrintsMigrator, 42, 43)
        .with(_44_move_user_decryption_options_to_state_provider_1.UserDecryptionOptionsMigrator, 43, 44)
        .with(_45_merge_environment_state_1.MergeEnvironmentState, 44, 45)
        .with(_46_delete_orphaned_biometric_prompt_data_1.DeleteBiometricPromptCancelledData, 45, 46)
        .with(_47_move_desktop_settings_1.MoveDesktopSettingsMigrator, 46, 47)
        .with(_48_move_ddg_to_state_provider_1.MoveDdgToStateProviderMigrator, 47, 48)
        .with(_49_move_account_server_configs_1.AccountServerConfigMigrator, 48, 49)
        .with(_50_move_key_connector_to_state_provider_1.KeyConnectorMigrator, 49, 50)
        .with(_51_move_remembered_email_to_state_providers_1.RememberedEmailMigrator, 50, 51)
        .with(_52_delete_installed_version_1.DeleteInstalledVersion, 51, 52)
        .with(_53_migrate_device_trust_svc_to_state_providers_1.DeviceTrustServiceStateProviderMigrator, 52, 53)
        .with(_54_move_encrypted_sends_1.SendMigrator, 53, 54)
        .with(_55_move_master_key_state_to_provider_1.MoveMasterKeyStateToProviderMigrator, 54, 55)
        .with(_56_move_auth_requests_1.AuthRequestMigrator, 55, 56)
        .with(_57_move_cipher_service_to_state_provider_1.CipherServiceMigrator, 56, 57)
        .with(_58_remove_refresh_token_migrated_state_provider_flag_1.RemoveRefreshTokenMigratedFlagMigrator, 57, 58)
        .with(_59_move_kdf_config_to_state_provider_1.KdfConfigMigrator, 58, 59)
        .with(_60_known_accounts_1.KnownAccountsMigrator, 59, 60)
        .with(_61_move_pin_state_to_providers_1.PinStateMigrator, 60, 61)
        .with(_62_migrate_vault_timeout_settings_svc_to_state_provider_1.VaultTimeoutSettingsServiceStateProviderMigrator, 61, 62)
        .with(_63_migrate_password_settings_1.PasswordOptionsMigrator, 62, 63)
        .with(_64_migrate_generator_history_1.GeneratorHistoryMigrator, 63, 64)
        .with(_65_migrate_forwarder_settings_1.ForwarderOptionsMigrator, 64, 65)
        .with(_66_move_final_desktop_settings_1.MoveFinalDesktopSettingsMigrator, 65, exports.CURRENT_VERSION);
}
function currentVersion(storageService, logService) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let state = yield storageService.get("stateVersion");
        if (state == null) {
            // Pre v8
            state = (_a = (yield storageService.get("global"))) === null || _a === void 0 ? void 0 : _a.stateVersion;
        }
        if (state == null) {
            logService.info("No state version found, assuming empty state.");
            return -1;
        }
        logService.info(`State version: ${state}`);
        return state;
    });
}
/**
 * Waits for migrations to have a chance to run and will resolve the promise once they are.
 *
 * @param storageService Disk storage where the `stateVersion` will or is already saved in.
 * @param logService Log service
 */
function waitForMigrations(storageService, logService) {
    return __awaiter(this, void 0, void 0, function* () {
        const isReady = () => __awaiter(this, void 0, void 0, function* () {
            const version = yield currentVersion(storageService, logService);
            // The saved version is what we consider the latest
            // migrations should be complete, the state version
            // shouldn't become larger than `CURRENT_VERSION` in
            // any normal usage of the application but it is common
            // enough in dev scenarios where we want to consider that
            // ready as well and return true in that scenario.
            return version >= exports.CURRENT_VERSION;
        });
        const wait = (time) => __awaiter(this, void 0, void 0, function* () {
            // Wait exponentially
            const nextTime = time * 2;
            if (nextTime > 8192) {
                // Don't wait longer than ~8 seconds in a single wait,
                // if the migrations still haven't happened. They aren't
                // likely to.
                return;
            }
            return new Promise((resolve) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    if (!(yield isReady())) {
                        logService.info(`Waiting for migrations to finish, waiting for ${nextTime}ms`);
                        yield wait(nextTime);
                    }
                    resolve();
                }), time);
            });
        });
        if (!(yield isReady())) {
            // Wait for 2ms to start with
            yield wait(2);
        }
    });
}
//# sourceMappingURL=migrate.js.map