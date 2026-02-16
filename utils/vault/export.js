const { getCredential } = require("../credentials.js");
const { getAccessToken, syncVault, getIterations } = require("../bitwarden.js");
const { readFile } = require("../utils.js");

const { Cipher, CipherData, CipherWithIdExport, Folder, FolderData, FolderWithIdExport } = require("../../libs/common.cjs");

async function exportVault(appData, uid = null) {
    const userData = await readFile(appData);
    if (!userData) throw new Error("Unable to read user data from " + appData + " (Bitwarden Desktop). File may not exist or has insufficient permissions.");

    const userId = uid ?? userData.global_account_activeAccountId;
    if (!userId) throw new Error("A user was not specified for vault export, and no default account is selected in Bitwarden Desktop.");

    const region = userData?.[`user_${userId}_environment_environment`]?.region?.trim() || "US";
    const urls = userData?.[`user_${userId}_environment_environment`]?.urls || null;

    const refreshToken = await getCredential("Bitwarden", userId + "_refreshToken");
    if (!refreshToken) throw new Error("Unable to retrieve refresh token for vault export from Bitwarden Desktop (are you logged in?).");

    const accessToken = await getAccessToken(refreshToken, region, urls);
    if (!accessToken) throw new Error("Unable to authenticate vault export with refresh token from Bitwarden Desktop (are you logged in?).");

    const vault = await syncVault(accessToken, region, urls);
    if (!vault) throw new Error("Unable to sync vault data for export from Bitwarden Desktop (are you logged in?).");
    if (!vault.profile) throw new Error("Unable to fetch profile data from vault sync (are you logged in?).");
    if (!vault.profile.email) throw new Error("Unable to fetch profile email from vault sync (are you logged in?).");
    if (!vault.profile.key) throw new Error("Unable to fetch profile key from vault sync (are you logged in?).");

    // https://github.com/bitwarden/clients/blob/eab6e7ce804fa1c3c5c30f47f6f6165e109d7ee8/libs/tools/export/vault-export/vault-export-core/src/services/individual-vault-export.service.ts#L203
    let ciphersData = {};
    let foldersData = {};

    vault?.ciphers?.forEach((item) => {
        const data = new CipherData(item);
        if (!data || !data.id) return;

        ciphersData[data.id] = data;
    });

    vault?.folders?.forEach((item) => {
        const data = new FolderData(item);
        if (!data || !data.id) return;

        foldersData[data.id] = data;
    });

    // ----- Actual Code ----- //

    let folders = [];
    let ciphers = [];

    for (const id in ciphersData) {
        if (ciphersData.hasOwnProperty(id)) {
            ciphers.push(new Cipher(ciphersData[id], null));
        }
    }

    for (const id in foldersData) {
        if (foldersData.hasOwnProperty(id)) {
            folders.push(new Folder(foldersData[id]));
        }
    }

    ciphers = ciphers.filter((f) => f?.deletedDate == null);
    const iterations = await getIterations(vault.profile.email, region, urls);
    if (!iterations) throw new Error("Argon2id was detected as the key derivation function for your vault, which is currently unsupported.");

    const jsonDoc = {
        encrypted: true,
        userData: {
            email: vault.profile.email,
            iterations,
            autoBackup_encryptionKey_DO_NOT_EDIT: vault.profile.key,
        },
        folders: [],
        items: [],
    };

    folders.forEach((f) => {
        if (f.id == null) {
            return;
        }

        const folder = new FolderWithIdExport();
        folder.build(f);
        jsonDoc.folders.push(folder);
    });

    ciphers.forEach((c) => {
        if (c.organizationId != null) {
            return;
        }

        const cipher = new CipherWithIdExport();
        cipher.build(c);
        cipher.collectionIds = null;
        jsonDoc.items.push(cipher);
    });

    return jsonDoc;
}

module.exports = { exportVault };
