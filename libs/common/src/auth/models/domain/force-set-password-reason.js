"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceSetPasswordReason = void 0;
/*
 * This enum is used to determine if a user should be forced to initially set or reset their password
 * on login (server flag) or unlock via MP (client evaluation).
 */
var ForceSetPasswordReason;
(function (ForceSetPasswordReason) {
    /**
     * A password reset should not be forced.
     */
    ForceSetPasswordReason[ForceSetPasswordReason["None"] = 0] = "None";
    /**
     * Occurs when an organization admin forces a user to reset their password.
     * Communicated via server flag.
     */
    ForceSetPasswordReason[ForceSetPasswordReason["AdminForcePasswordReset"] = 1] = "AdminForcePasswordReset";
    /**
     * Occurs when a user logs in / unlocks their vault with a master password that does not meet an organization's
     * master password policy that is enforced on login/unlock.
     * Only set client side b/c server can't evaluate MP.
     */
    ForceSetPasswordReason[ForceSetPasswordReason["WeakMasterPassword"] = 2] = "WeakMasterPassword";
    /**
     * Occurs when a TDE user without a password obtains the password reset permission.
     * Set post login & decryption client side and by server in sync (to catch logged in users).
     */
    ForceSetPasswordReason[ForceSetPasswordReason["TdeUserWithoutPasswordHasPasswordResetPermission"] = 3] = "TdeUserWithoutPasswordHasPasswordResetPermission";
})(ForceSetPasswordReason || (exports.ForceSetPasswordReason = ForceSetPasswordReason = {}));
//# sourceMappingURL=force-set-password-reason.js.map