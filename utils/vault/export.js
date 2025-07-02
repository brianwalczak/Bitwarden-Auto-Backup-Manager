const { getCredential } = require('../credentials.js');
const { getAccessToken, syncVault, getIterations } = require('../bitwarden.js');
const { readFile } = require('../utils.js');

const { CipherData } = require('../../libs/common/src/vault/models/data/cipher.data.js');
const { Cipher } = require('../../libs/common/src/vault/models/domain/cipher.js');

const { FolderData } = require('../../libs/common/src/vault/models/data/folder.data.js');
const { Folder } = require('../../libs/common/src/vault/models/domain/folder.js');

const { FolderWithIdExport } = require('../../libs/common/src/models/export/folder-with-id.export.js');
const { CipherWithIdExport } = require('../../libs/common/src/models/export/cipher-with-ids.export.js');

// IMPLEMENTATION: getEncryptedExport from https://github.com/bitwarden/clients -> ./libs/tools/export/vault-export/vault-export-core/src/services/individual-vault-export.service.ts#L203
async function exportVault(appData, uid = null) {
    const userData = await readFile(appData);
    const userId = uid ?? userData.global_account_activeAccountId;
    const env = userData[`user_${userId}_environment_environment`] || { region: 'US' };

    let refreshToken = await getCredential('Bitwarden', userId + '_refreshToken');
    refreshToken = refreshToken.replace(/[^A-Z0-9\-]/g, ''); // Remove weird white space

    const accessToken = await getAccessToken(refreshToken, env.region);
    const vault = await syncVault(accessToken, env.region);
    let ciphersData = {};
    let foldersData = {};

    vault.ciphers.forEach((item) => {
        const data = new CipherData(item);

        ciphersData[data.id] = data;
    });

    vault.folders.forEach((item) => {
        const data = new FolderData(item);

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
        folders.push(new Folder(foldersData[id]));
    }

    ciphers = ciphers.filter((f) => f.deletedDate == null);
    const iterations = await getIterations(vault.profile.email);
    if(!iterations) return console.log('At this time, only PBKDF2 is supported.');

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