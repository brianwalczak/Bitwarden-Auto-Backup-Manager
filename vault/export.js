// IMPLEMENTATION: getEncryptedExport from https://github.com/bitwarden/clients -> ./libs/tools/export/vault-export/vault-export-core/src/services/individual-vault-export.service.ts#L203


const keytar = require('keytar');
const fs = require('fs');

const { CipherData } = require('../libs/common/src/vault/models/data/cipher.data.js');
const { Cipher } = require('../libs/common/src/vault/models/domain/cipher.js');

const { FolderData } = require('../libs/common/src/vault/models/data/folder.data.js');
const { Folder } = require('../libs/common/src/vault/models/domain/folder.js');

const { FolderWithIdExport } = require('../libs/common/src/models/export/folder-with-id.export.js');
const { CipherWithIdExport } = require('../libs/common/src/models/export/cipher-with-ids.export.js');

// If you're prompted by your operating system, such as macOS, to enter your password before viewing your Bitwarden credential, make sure to click "Always Allow" to prevent any annoyances while automatic backups are running

// Simple function written with keytar to find credential based on search query
async function findCredential(service, code) {
    const credentials = await keytar.findCredentials('Bitwarden');
    let result;

    credentials.forEach((cred) => {
        if(cred.account.includes(code)) {
            result = cred.password;
        }
    });

    return result.replaceAll('"', '');
}

// Creates an API request to Bitwarden creating an access token
async function getAccessToken(refresh_token, region) {
    const req = await fetch(`https://${region == 'EU' ? 'identity.bitwarden.eu' : 'identity.bitwarden.com'}/connect/token`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
          'accept': 'application/json'
        },
        body: new URLSearchParams({
          'grant_type': 'refresh_token',
          'client_id': 'desktop',
          'refresh_token': refresh_token
        })
    });      

    const res = await req.json();
    return res.access_token;
}

// Creates an API request to Bitwarden to sync your vault
async function syncVault(access_token, region) {
    const req = await fetch(`https://${region == 'EU' ? 'api.bitwarden.eu' : 'api.bitwarden.com'}/sync?excludeDomains=true`, {
        headers: {
          'authorization': 'Bearer ' + access_token,
          'accept': 'application/json',
        }
      });

    const res = await req.json();
    return res;
}

// Simple function written with keytar to find exact credential
async function getCredential(service, account) {
    const password = await keytar.getPassword(service, account);

    return password.replaceAll('"', '');
}

// Read data.json file from Bitwarden Desktop app
async function getUserData(path) {
    try {
        const data = await fs.promises.readFile(path, 'utf8');
        const jsonData = JSON.parse(data);
        
        return jsonData;
    } catch (error) {
        return null;
    }
}

// Function to get the user iteration count
async function getIterations(email) {
    const req = await fetch("https://vault.bitwarden.com/identity/accounts/prelogin", {
        "headers": {
          "content-type": "application/json; charset=utf-8",
        },
        "body": `{\"email\":\"${email}\"}`,
        "method": "POST"
    });
    const res = await req.json();
    if(!res.kdfIterations) return null;

    return res.kdfIterations;
}

async function exportVault(appData) {
    const userData = await getUserData(appData);
    const userId = userData.global_account_activeAccountId;
    const env = userData[userId + '_environment_environment'] || { region: 'US' };

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

// Export all functions for use
module.exports = {
    exportVault
};