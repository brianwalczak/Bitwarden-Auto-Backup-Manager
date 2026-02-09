const { toUtf8, ByteData, deriveMasterKey, stretchKey, aesDecrypt, EncCipher, SimpleSymmetricCryptoKey, decryptToBytes } = require("../crypto.js");
const { CipherWithIdExport, FolderWithIdExport, SymmetricCryptoKey, EncString } = require("../../libs/common.cjs");

async function forEachEncString(cipher, callback) {
    // Helper function to traverse nested properties
    async function traverse(obj) {
        let promises = [];
        for (let key in obj) {
            if (obj[key] instanceof EncString) {
                promises.push(callback(key, obj)); // Collect promises
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
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

    // https://github.com/bitwarden/clients/blob/eab6e7ce804fa1c3c5c30f47f6f6165e109d7ee8/libs/importer/src/importers/bitwarden/bitwarden-encrypted-json-importer.ts#L150
    for (const key in backup.folders) {
        const folder = FolderWithIdExport.toDomain(backup.folders[key]);
        if (!folder) continue;

        // begin decryption for all encrypted strings in the folder
        await forEachEncString(folder, async (key, parentObj) => {
            if (parentObj[key] instanceof EncString) {
                try {
                    const data = await aesDecrypt(new EncCipher(parentObj[key].encryptedString), symmetricKey.encKey, symmetricKey.macKey);
                    parentObj[key] = toUtf8(data);
                } catch {
                    /* skip it */
                }
            }
        });

        backup.folders[key] = folder;
    }

    // https://github.com/bitwarden/clients/blob/eab6e7ce804fa1c3c5c30f47f6f6165e109d7ee8/libs/importer/src/importers/bitwarden/bitwarden-encrypted-json-importer.ts#L106
    for (const key in backup.items) {
        const cipher = CipherWithIdExport.toDomain(backup.items[key]);

        // reset ids in case they were set for some reason
        cipher.id = null;
        cipher.organizationId = this.organizationId;
        cipher.collectionIds = null;

        // make sure password history is limited
        if (cipher.passwordHistory != null && cipher.passwordHistory.length > 5) {
            cipher.passwordHistory = cipher.passwordHistory.slice(0, 5);
        }

        // begin decryption for all encrypted strings in the cipher
        await forEachEncString(cipher, async (key, parentObj) => {
            let activeSymmetricKey = symmetricKey; // by default, use the original symmetric key for decryption

            if (parentObj[key] instanceof EncString) {
                // if a cipher key is present, use it for decryption instead
                if (cipher["key"] != null) {
                    // NEED TO FIX THIS, IT'S CURRENTLY RETURNING NULL FOR VAL ALL THE TIME
                    const val = await decryptToBytes(cipher["key"], new SymmetricCryptoKey(symmetricKey.key.arr));

                    if(val) activeSymmetricKey = new SimpleSymmetricCryptoKey(val);
                }

                try {
                    const data = await aesDecrypt(new EncCipher(parentObj[key].encryptedString), activeSymmetricKey.encKey, activeSymmetricKey.macKey);
                    parentObj[key] = toUtf8(data);
                } catch {
                    /* skip it */
                }
            }
        });

        backup.items[key] = cipher;
    }

    return await completeRestore(backup);
}

// IMPLEMENTATION: buildJsonExport from https://github.com/bitwarden/clients -> ./libs/tools/export/vault-export/vault-export-core/src/services/individual-vault-export.service.ts#L297
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
        delete cipher.key;
        jsonDoc.items.push(cipher);
    });

    return jsonDoc;
}

async function restoreBackup(backup, masterPassword) {
    // --- PBKDF2 Key Derivation and symmetric key decryption --- //
    const masterKey = await deriveMasterKey(backup.userData.email, masterPassword, backup.userData.iterations);
    const stretchedKey = await stretchKey(masterKey);

    const unprotectedSymKey = new ByteData(
        await aesDecrypt(
            new EncCipher(backup.userData["autoBackup_encryptionKey_DO_NOT_EDIT"]),
            new ByteData(stretchedKey.arr.slice(0, 32).buffer), // stretched master key (encryption key bytedata)
            new ByteData(stretchedKey.arr.slice(32, 64).buffer), // stretched master key (mac key bytedata)
        ),
    );

    const file = await decryptItems(backup, new SimpleSymmetricCryptoKey(unprotectedSymKey.b64));
    return file;
}

module.exports = { restoreBackup };
