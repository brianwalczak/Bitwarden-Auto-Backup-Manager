// Stores the Bitwarden refresh token in THIS app's own keychain to prevent redundant reads from Bitwarden Desktop
// https://github.com/brianwalczak/Bitwarden-Auto-Backup-Manager/issues/8
import keytar from "keytar";

const account = (userId) => `${userId}_refreshToken`;

async function getCredential(service, account) {
    try {
        let password = await keytar.getPassword(service, account);

        // Windows stores credentials as UTF-16LE, so it may have some ugly null bytes
        password = password?.replace(/\0/g, "")?.trim(); // remove null bytes and whitespace

        return password?.replaceAll('"', "") ?? null; // remove any quotes
    } catch {
        return null;
    }
}

// Get refresh token for a user from Bitwarden Desktop's credential store
async function getDesktopRefreshToken(userId) {
    return await getCredential("Bitwarden", account(userId));
}

// Get refresh token for a user from local credential store
async function getLocalRefreshToken(userId) {
    return await getCredential("BitwardenAutoBackupManager", account(userId));
}

// Update refresh token for a user in local credential store (if changes were made)
async function setLocalRefreshToken(userId, token) {
    if (!token) return false;

    try {
        const existing = await getCredential("BitwardenAutoBackupManager", account(userId));
        if (existing === token) return true; // no change, don't rewrite

        await keytar.setPassword("BitwardenAutoBackupManager", account(userId), token);
        return true;
    } catch {
        return false;
    }
}

// Delete refresh token for a user in local credential store (used when stale)
async function deleteLocalRefreshToken(userId) {
    try {
        await keytar.deletePassword("BitwardenAutoBackupManager", account(userId));
        return true;
    } catch {
        return false;
    }
}

export { getDesktopRefreshToken, getLocalRefreshToken, setLocalRefreshToken, deleteLocalRefreshToken };
