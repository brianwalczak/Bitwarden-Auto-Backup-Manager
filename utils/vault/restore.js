const { toUtf8, ByteData, deriveMasterKey, stretchKey, aesDecrypt, EncCipher, SimpleSymmetricCryptoKey, decryptToBytes } = require('../crypto.js');

const { Cipher } = require('../../libs/common/src/vault/models/domain/cipher.js');
const { Folder } = require('../../libs/common/src/vault/models/domain/folder.js');

const { FolderWithIdExport } = require('../../libs/common/src/models/export/folder-with-id.export.js');
const { CipherWithIdExport } = require('../../libs/common/src/models/export/cipher-with-ids.export.js');

const { SymmetricCryptoKey } = require('../../libs/common/src/platform/models/domain/symmetric-crypto-key.js');
const { EncString } = require('../../libs/common/src/platform/models/domain/enc-string.js');

async function forEachEncString(cipher, callback) {
    // Helper function to traverse nested properties
    async function traverse(obj) {
      let promises = [];
      for (let key in obj) {
        if (obj[key] instanceof EncString) {
          promises.push(callback(key, obj)); // Collect promises
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          promises.push(traverse(obj[key])); // Recursively traverse
        }
      }
      await Promise.all(promises); // Wait for all promises to resolve
    }
  
    await traverse(cipher);
}

async function decryptItems(backup, symmetricKey) {
    backup.encrypted = false;
    delete backup.userData;

    // Ciphers
    for (const key in backup.items) {
        const cipher = new Cipher(backup.items[key]);

        await forEachEncString(cipher, async (key, parentObj) => {
            let activeSymmetricKey = symmetricKey;

            if (parentObj[key] instanceof EncString) {
              if(cipher['key'] != null) {
                const val = await decryptToBytes(cipher['key'], new SymmetricCryptoKey(symmetricKey.key.arr));
                
                activeSymmetricKey = new SimpleSymmetricCryptoKey(val); // Update the used symmetric key to the new "key" value
              }
              
              try {
                const data = await aesDecrypt(new EncCipher(parentObj[key].encryptedString), activeSymmetricKey.encKey, activeSymmetricKey.macKey);
                parentObj[key] = toUtf8(data);
              } catch(error) {};
            }
        });

        backup.items[key] = cipher;
    }

    // Folders
    for (const key in backup.folders) {
        const folder = new Folder(backup.folders[key]);

        await forEachEncString(folder, async (key, parentObj) => {
            let activeSymmetricKey = symmetricKey;

            if (parentObj[key] instanceof EncString) {
            // We don't know if folders contain a special key, but let's continue anyway
              if(folder['key'] != null) {
                const val = await decryptToBytes(folder['key'], new SymmetricCryptoKey(symmetricKey.key.arr));
                
                activeSymmetricKey = new SimpleSymmetricCryptoKey(val); // Update the used symmetric key to the new "key" value
              }
              
              try {
                const data = await aesDecrypt(new EncCipher(parentObj[key].encryptedString), activeSymmetricKey.encKey, activeSymmetricKey.macKey);
                parentObj[key] = toUtf8(data);
              } catch(error) {};
            }
        });

        backup.folders[key] = folder;
    }

    return await completeRestore(backup);
}

async function completeRestore(backup) {
    const jsonDoc = {
        encrypted: false,
        folders: [],
        items: [],
    };

    backup.folders.forEach((f) => {
        if (f.id == null) {
          return;
        }
        
        const folder = new FolderWithIdExport();
        folder.build(f);
        jsonDoc.folders.push(folder);
    });
  
    backup.items.forEach((c) => {
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

async function restoreBackup(backup, masterPassword) {
  // --- PBKDF2 Key Derivation and symmetric key decryption --- //
  const masterKey = await deriveMasterKey(backup.userData.email, masterPassword, backup.userData.iterations);
  const stretchedKey = await stretchKey(masterKey);
  
  const unprotectedSymKey = new ByteData(await aesDecrypt(
      new EncCipher(backup.userData['autoBackup_encryptionKey_DO_NOT_EDIT']),
      new ByteData(stretchedKey.arr.slice(0, 32).buffer), // stretched master key (encryption key bytedata)
      new ByteData(stretchedKey.arr.slice(32, 64).buffer) // stretched master key (mac key bytedata)
  ));

  const file = await decryptItems(backup, new SimpleSymmetricCryptoKey(unprotectedSymKey.b64));
  return file;
}

module.exports = { restoreBackup };