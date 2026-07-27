// Stores the Bitwarden refresh token in THIS app's own keychain to prevent redundant reads from Bitwarden Desktop
// https://github.com/brianwalczak/Bitwarden-Auto-Backup-Manager/issues/8
import keytar from "keytar";

const service = "BitwardenAutoBackupManager";
const account = (userId) => `${userId}_refreshToken`;

// Get refresh token for a user from keychain
async function getLocalRefreshToken(userId) {
    try {
        return (await keytar.getPassword(service, account(userId))) || null;
    } catch {
        return null;
    }
}

// Update refresh token for a user if changes were made
async function setLocalRefreshToken(userId, token) {
    if (!token) return false;

    try {
        const existing = await keytar.getPassword(service, account(userId));
        if (existing === token) return true; // no change, don't rewrite

        await keytar.setPassword(service, account(userId), token);
        return true;
    } catch {
        return false;
    }
}

// Delete refresh token for a user (used when stale)
async function deleteLocalRefreshToken(userId) {
    try {
        await keytar.deletePassword(service, account(userId));
        return true;
    } catch {
        return false;
    }
}

export { getLocalRefreshToken, setLocalRefreshToken, deleteLocalRefreshToken };
