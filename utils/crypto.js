const crypto = require('crypto');

// Reference to encryption types used (helps identify encryption type from b64)
const encTypes = {
    AesCbc256_B64: 0,
    AesCbc128_HmacSha256_B64: 1,
    AesCbc256_HmacSha256_B64: 2,
    Rsa2048_OaepSha256_B64: 3,
    Rsa2048_OaepSha1_B64: 4,
    Rsa2048_OaepSha256_HmacSha256_B64: 5,
    Rsa2048_OaepSha1_HmacSha256_B64: 6,
}

// Creates an array buffer from a string
function fromUtf8(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}

// Converts a buffer to a string
function toUtf8(buf) {
    const decoder = new TextDecoder();
    return decoder.decode(buf);
}

// Converts a buffer to base 64 format
function toB64(buf) {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, 'binary').toString('base64');
}

// Creates a byte data class from a buffer
class ByteData {
    constructor(buf) {
        if (!arguments.length) {
            this.arr = null;
            this.b64 = null;
            return;
        }

        this.arr = new Uint8Array(buf);
        this.b64 = toB64(buf);
    }
}

// Uses the pbkdf2 algorithm to derive a key from login
async function pbkdf2(password, salt, iterations, length) {
    const importAlg = {
        name: 'PBKDF2',
    };

    const deriveAlg = {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: { name: 'SHA-256' },
    };

    const aesOptions = {
        name: 'AES-CBC',
        length: length,
    };

    try {
        const importedKey = await crypto.subtle.importKey('raw', password, importAlg, false, ['deriveKey']);
        const derivedKey = await crypto.subtle.deriveKey(deriveAlg, importedKey, aesOptions, true, ['encrypt']);
        const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);

        return new ByteData(exportedKey);
    } catch (err) {
        return err;
    }
}

// Simple function for HKDF expansion
async function hkdfExpand(prk, info, size) {
    const alg = {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
    };
    const importedKey = await crypto.subtle.importKey('raw', prk, alg, false, ['sign']);
    const hashLen = 32; // SHA-256 output length
    const okm = new Uint8Array(size);
    let previousT = new Uint8Array(0);
    const n = Math.ceil(size / hashLen);
    for (let i = 0; i < n; i++) {
        const t = new Uint8Array(previousT.length + info.length + 1);
        t.set(previousT);
        t.set(info, previousT.length);
        t.set([i + 1], t.length - 1);
        previousT = new Uint8Array(await crypto.subtle.sign(alg, importedKey, t));
        okm.set(previousT, i * hashLen);
    }

    return okm;
}

// Derives a master key from any login and iteration count
async function deriveMasterKey(email, masterPassword, iterations) {
    // Convert email and password to ArrayBuffer
    const emailBuffer = fromUtf8(email);
    const passwordBuffer = fromUtf8(masterPassword);

    // Use PBKDF2 to derive a key from the buffers with a specific amount ofiterations
    const masterKey = await pbkdf2(passwordBuffer, emailBuffer, iterations, 256);

    return masterKey;
}

// Stretches a master key into 64 bytes
async function stretchKey(masterKey) {
    const keyBytes = new Uint8Array(masterKey.arr);
    
    // Stretching the master key using HKDF
    const encKey = await hkdfExpand(keyBytes, new Uint8Array(fromUtf8('enc')), 32); // 32 bytes for encryption key
    const macKey = await hkdfExpand(keyBytes, new Uint8Array(fromUtf8('mac')), 32); // 32 bytes for MAC key
    
    // Concatenate the keys
    const stretchedKey = new Uint8Array(64);
    stretchedKey.set(encKey);
    stretchedKey.set(macKey, 32);

    return new ByteData(stretchedKey.buffer);
}

// Derives your master password hash from your master key and password
async function deriveMasterPasswordHash(masterKey, masterPassword) {
    const passwordBuffer = fromUtf8(masterPassword); // Convert password to ArrayBuffer

    // Use PBKDF2 again to derive a new key from the previous PBKDF2 key and password buffer
    const masterPasswordHash = await pbkdf2(masterKey.arr.buffer, passwordBuffer, 1, 256);

    return masterPasswordHash;
}

// Computes an HMAC (Hash-based Message Authentication Code) using SHA-256 algorithm.
async function computeMac(data, key) {
    const alg = {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    }
    const importedKey = await crypto.subtle.importKey('raw', key, alg, false, ['sign'])
    return crypto.subtle.sign(alg, importedKey, data)
}

// Checks if two macs equal each other
async function macsEqual(mac1Data, mac2Data, key) {
    const alg = {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    }

    const importedMacKey = await crypto.subtle.importKey('raw', key, alg, false, ['sign'])
    const mac1 = await crypto.subtle.sign(alg, importedMacKey, mac1Data)
    const mac2 = await crypto.subtle.sign(alg, importedMacKey, mac2Data)

    if (mac1.byteLength !== mac2.byteLength) {
      return false
    }

    const arr1 = new Uint8Array(mac1)
    const arr2 = new Uint8Array(mac2)

    for (let i = 0; i < arr2.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }

    return true
}

// Concatenates IV and ciphertext to build data for HMAC
function buildDataForMac(ivArr, ctArr) {
    const dataForMac = new Uint8Array(ivArr.length + ctArr.length)
    dataForMac.set(ivArr, 0)
    dataForMac.set(ctArr, ivArr.length)
    return dataForMac
}

// Decrypts with AES-CBC using any cipher and encryption + HMAC keys
async function aesDecrypt(cipher, encKey, macKey) {
    const keyOptions = {
      name: 'AES-CBC',
    }

    const decOptions = {
      name: 'AES-CBC',
      iv: cipher.iv.arr.buffer,
    }

    try {
      const checkMac = cipher.encType != encTypes.AesCbc256_B64
      if (checkMac) {
        if (!macKey) {
          throw 'MAC key not provided.'
        }
        const dataForMac = buildDataForMac(cipher.iv.arr, cipher.ct.arr)
        const macBuffer = await computeMac(dataForMac.buffer, macKey.arr.buffer)
        const macsMatch = await macsEqual(cipher.mac.arr.buffer, macBuffer, macKey.arr.buffer)
        if (!macsMatch) {
          throw 'MAC check failed (likely incorrect password).'
        }
        const importedKey = await crypto.subtle.importKey('raw', encKey.arr.buffer, keyOptions, false, [
          'decrypt',
        ])
        return crypto.subtle.decrypt(decOptions, importedKey, cipher.ct.arr.buffer)
      }
    } catch (err) {
      throw err;
    }
}

// Used to create key from the encryption key and "key" value
function resolveLegacyKey(key, encThing) {
  if (
    encThing.encryptionType === encTypes.AesCbc128_HmacSha256_B64 &&
    key.encType === encTypes.AesCbc256_B64
  ) {
    return new SymmetricCryptoKey(key.key, encTypes.AesCbc128_HmacSha256_B64);
  }

  return key;
}

// Special decryption function for "key" value
async function aesDecryptKey(data, iv, key) {
  try {
    const impKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      impKey,
      data
    );

    return new Uint8Array(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
}

// Function which utilizes the encryption key and "key" value to create a new byte symmetric key
async function decryptToBytes(encThing, key) {
    if (key == null) {
      throw new Error("No encryption key provided.");
    }

    if (encThing == null) {
      throw new Error("Nothing provided for decryption.");
    }

    key = resolveLegacyKey(key, encThing);

    if (key.macKey != null && encThing.macBytes == null) {
      return null;
    }

    if (key.encType !== encThing.encryptionType) {
      return null;
    }

    if (key.macKey != null && encThing.macBytes != null) {
      const macData = new Uint8Array(encThing.ivBytes.byteLength + encThing.dataBytes.byteLength);
      macData.set(new Uint8Array(encThing.ivBytes), 0);
      macData.set(new Uint8Array(encThing.dataBytes), encThing.ivBytes.byteLength);
      const computedMac = await computeMac(macData, key.macKey);
      if (computedMac === null) {
        return null;
      }
      
      const macsMatch = await macsEqual(encThing.macBytes, computedMac, new Uint8Array(crypto.randomBytes(32))); // Check if HMACs equal each other with random byte array

      if (!macsMatch) {
        this.logMacFailed("mac failed.");
        return null;
      }
    }

    const result = await aesDecryptKey(
      encThing.dataBytes, // the data bytes of the "key" encryption key
      encThing.ivBytes, // the iv bytes of the "key" encryption key
      key.encKey, // the original vault encryption key
    );
    
    return result ?? null;
}

// Converts a base64 encrypted string into a valid cipher
class EncCipher {
    constructor(encryptedString) {
        const [encTypeAndIV, ct, mac] = encryptedString.split('|');
        const [encType, iv] = encTypeAndIV.split('.');

        this.ct = new ByteData(Buffer.from(ct, 'base64'));
        this.encType = Number(encType);
        this.iv = new ByteData(Buffer.from(iv, 'base64'));
        this.mac = new ByteData(Buffer.from(mac, 'base64'));
        this.string = encryptedString;
    }
}

// Splits a base64 symmetric key into an encryption key and HMAC key
class SimpleSymmetricCryptoKey {
    constructor(b64) {
      if (!arguments.length) {
        this.key = new ByteData()
        this.encKey = new ByteData()
        this.macKey = new ByteData()
        return
      }

      this.key = new ByteData(Buffer.from(b64, 'base64'))

      // First half
      const encKey = this.key.arr.slice(0, this.key.arr.length / 2).buffer
      this.encKey = new ByteData(encKey)

      // Second half
      const macKey = this.key.arr.slice(this.key.arr.length / 2).buffer
      this.macKey = new ByteData(macKey)
    }
}


module.exports = {
    encTypes,
    fromUtf8,
    toUtf8,
    toB64,
    ByteData,
    pbkdf2,
    hkdfExpand,
    deriveMasterKey,
    stretchKey,
    deriveMasterPasswordHash,
    computeMac,
    macsEqual,
    buildDataForMac,
    aesDecrypt,
    EncCipher,
    SimpleSymmetricCryptoKey,
    decryptToBytes
};